import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { initTRPC } from '@trpc/server';
import { generateOtp, sendOtpEmail } from '../../../utils/otp';

const t = initTRPC.create();
const prisma = new PrismaClient();

export const userRouter = t.router({
  // Initial user registration step
  register: t.procedure
    .input(z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(8),
    }))
    .mutation(async ({ input }) => {
      const { name, email, password } = input;
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      // Check if existing user
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
  
      if (existingUser && !existingUser.emailVerified) {
        throw new Error('An account with this email already exists but is not verified.');
      }

      if (existingUser && !existingUser.emailVerified) {
        throw new Error('A verified account with this email already exists.');
      }

      const user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          salt,
          emailVerified: false,
        },
      });

      const otp = generateOtp();
      const otpExpiration = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes

      await prisma.otpVerification.create({
        data: {
          userId: user.id,
          otp,
          otpExpiration,
        },
      });

      sendOtpEmail(email, otp);

      return {
        status: 'pending-verification',
        message: 'OTP sent to email. Please verify to complete registration.',
      };
    }),

  // OTP verification for completing the signup process
  verifyOtp: t.procedure
    .input(z.object({
      email: z.string().email(),
      otp: z.string(),
    }))
    .mutation(async ({ input }) => {
      const { email, otp } = input;
      const user = await prisma.user.findUnique({
        where: { email },
        include: { otpVerification: true },
      });

      if (!user || !user.otpVerification || user.otpVerification.otp !== otp || user.otpVerification.otpExpiration < new Date()) {
        throw new Error('OTP verification failed.');
      }

      // Mark the email as verified
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true },
      });

      // Optionally, clean up the OTP record
      await prisma.otpVerification.delete({
        where: { id: user.otpVerification.id },
      });

      // Generate and return a new auth token for the user
      const authToken = 'newly-generated-token'; // Implement token generation
      const ttl = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

      await prisma.authToken.create({
        data: {
          userId: user.id,
          authToken,
          ttl,
        },
      });

      return {
        status: 'success',
        message: 'Signup complete. User verified.',
        authToken,
      };
    }),

  // Logout functionality
  logout: t.procedure
    .input(z.object({
      userId: z.number(),
    }))
    .mutation(async ({ input }) => {
      const { userId } = input;
      // Invalidate or delete the auth token to log out the user
      await prisma.authToken.deleteMany({
        where: {
          userId,
        },
      });

      return {
        status: 'success',
        message: 'Logged out successfully.',
      };
    }),
});
