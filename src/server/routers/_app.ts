import { inferRouterOutputs } from '@trpc/server';
import { router } from '../trpc';
import { feedbackRouter } from './feedback';
import { routeRouter } from './route';
import { userRouteRouter } from './user-route';
import { adminRouter } from './admin';
import { airlineRouter } from './airline';
import { aircraftRouter } from './aircraft';
import { airportRouter } from './airport';

export const appRouter = router({
	userRoute: userRouteRouter,
	feedback: feedbackRouter,
	route: routeRouter,
	admin: adminRouter,
	airline: airlineRouter,
	aircraft: aircraftRouter,
	airport: airportRouter,
});

export type AppRouter = typeof appRouter;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
