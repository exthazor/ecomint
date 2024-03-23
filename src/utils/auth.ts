import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authenticateUser = async (authToken: string) => {
  // Look up the authToken in the database
  const tokenRecord = await prisma.authToken.findUnique({
    where: { authToken },
    include: { user: true }
  });

  if (!tokenRecord) {
    throw new Error('Token not found');
  }

  // Check if the token has expired
  if (!tokenRecord || new Date() > tokenRecord.ttl) {
    throw new Error('Token has expired');
  }

  // If the token is valid and not expired, return the associated user
  return tokenRecord.user;
};
