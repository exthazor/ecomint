import { userRouter } from "~/server/api/routers/user";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { categoryRouter } from "./routers/category";

export const appRouter = createTRPCRouter({
  user: userRouter,
  category: categoryRouter
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
