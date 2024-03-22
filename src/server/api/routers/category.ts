import { z } from "zod";
import { PrismaClient } from '@prisma/client';
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const prisma = new PrismaClient();

export const categoryRouter = createTRPCRouter({
    list: publicProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(6),
    }))
    .query(async ({ ctx, input }) => {
      const { page, limit } = input;
      const offset = (page - 1) * limit;
      const userId = ctx.user?.id
  
      const categories = await prisma.category.findMany({
        take: limit,
        skip: offset,
        orderBy: { name: 'asc' },
      });
  
      // Fetch user's interested categories
      const userCategories = await prisma.userCategories.findMany({
        where: { userId },
        select: { categoryId: true },
      });
      const interestedCategoryIds = new Set(userCategories.map(uc => uc.categoryId));
  
      const categoriesWithInterest = categories.map(category => ({
        ...category,
        isInterested: interestedCategoryIds.has(category.id),
      }));
  
      const total = await prisma.category.count();
      const hasMore = page * limit < total;
  
      return { categories: categoriesWithInterest, hasMore };
    }),

  toggleInterest: publicProcedure
    .input(z.object({
      categoryId: z.number(),
      interested: z.boolean(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { categoryId, interested } = input;
      const userId = ctx.user!!.id

      if (interested) {
        await prisma.userCategories.create({
          data: {
            userId,
            categoryId,
          },
        });
      } else {
        await prisma.userCategories.deleteMany({
          where: {
            userId,
            categoryId,
          },
        });
      }

      return { success: true };
    }),
});