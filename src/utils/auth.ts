import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authenticateUser = async (authToken: string) => {
  const tokenRecord = await prisma.authToken.findUnique({
    where: { authToken },
    include: { user: true }
  });
  if (!tokenRecord) {
    throw new Error('Token not found');
  }
  if (!tokenRecord || new Date() > tokenRecord.ttl) {
    throw new Error('Token has expired');
  }
  return tokenRecord.user;
};
