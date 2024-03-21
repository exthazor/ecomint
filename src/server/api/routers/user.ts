// src/server/api/routers/user.ts

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { initTRPC } from '@trpc/server';

const t = initTRPC.create();
const prisma = new PrismaClient();

export const userRouter = t.router({
  // User registration
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
      const user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          salt,
        },
      });
      
      // Placeholder for your token generation logic
      const authToken = 'token-placeholder'; 
      // Set the token TTL (time-to-live)
      const ttl = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days for example

      await prisma.authToken.create({
        data: {
          userId: user.id,
          authToken,
          ttl,
        },
      });

      return {
        status: 'success',
        message: 'User registered successfully',
        user,
      };
    }),

  // User login
  login: t.procedure
    .input(z.object({
      email: z.string().email(),
      password: z.string(),
    }))
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { email: input.email },
      });
      if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
        throw new Error('Invalid email or password.');
        }
          // Placeholder for your token generation logic
      const authToken = 'token-placeholder'; 
      const ttl = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days for example
  
        // Generating a new auth token for each login
      await prisma.authToken.create({
        data: {
            userId: user.id,
            authToken,
            ttl,
            },
        });

  return {
    status: 'success',
    message: 'User logged in successfully',
    authToken, // Send back the auth token
  };
  }),
});