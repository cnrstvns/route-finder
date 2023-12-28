import { router } from '@/server/trpc';
import { feedbackRouter } from './feedback';

export const adminRouter = router({
	feedback: feedbackRouter,
});
