import { router } from '@/server/trpc';
import { airlineRouter } from './airline';
import { feedbackRouter } from './feedback';

export const adminRouter = router({
  feedback: feedbackRouter,
  airline: airlineRouter,
});
