import { type AppRouter } from '@/server/routers/_app';
import { createTRPCReact } from '@trpc/react-query';

export const trpc = createTRPCReact<AppRouter>({});

export const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
};

export const getUrl = () => {
  return `${getBaseUrl()}/api/trpc`;
};
