import { router } from '@/server/trpc';
import { feedbackRouter } from './feedback';
import { airlineRouter } from './airline';

export const adminRouter = router({
	feedback: feedbackRouter,
	airline: airlineRouter,
});
