import { inferRouterOutputs } from '@trpc/server';
import { router } from '../trpc';
import { feedbackRouter } from './feedback';
import { routeRouter } from './route';
import { userRouteRouter } from './user-route';

export const appRouter = router({
	userRoute: userRouteRouter,
	feedback: feedbackRouter,
	route: routeRouter,
});

export type AppRouter = typeof appRouter;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
