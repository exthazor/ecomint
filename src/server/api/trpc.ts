import { initTRPC } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "~/server/db";
import { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';

/**
 * 1. CONTEXT
 */

type CreateContextOptions = Record<string, never>;

const createInnerTRPCContext = (_opts: CreateContextOptions) => {
  return {
    db,
  };
};

const prisma = new PrismaClient();

export const createTRPCContext = async (_opts: CreateNextContextOptions) => {
  const authToken = _opts.req.headers.authorization?.split(' ')[1];

  let user = null;
  if (authToken) {
    const tokenRecord = await prisma.authToken.findUnique({
      where: { authToken },
      include: { user: true },
    });

    if (!tokenRecord || new Date() > tokenRecord.ttl) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    user = tokenRecord.user;
  }

  return { ...createInnerTRPCContext({}), user };
};

/**
 * 2. INITIALIZATION
 */

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 */

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next();
});