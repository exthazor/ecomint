import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../server/api/root';
import { httpBatchLink } from '@trpc/client';

const getBaseUrl = () => {
    if (typeof window !== "undefined") return ""; // browser should use relative url
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
    return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
  };

export const trpc = createTRPCReact<AppRouter>();