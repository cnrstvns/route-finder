import { router } from '../trpc';
import { feedbackRouter } from './feedback';
import { userRouteRouter } from './user-route';
import { inferRouterOutputs } from '@trpc/server';

export const appRouter = router({
	userRoute: userRouteRouter,
	feedback: feedbackRouter,
});

export type AppRouter = typeof appRouter;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
