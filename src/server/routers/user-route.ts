import { protectedProcedure, router } from '../trpc';
import z from 'zod';
import { airline, airport, route, userRoute } from '@/db';
import { and, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { getOffset } from '@/lib/db';
import { PAGE_SIZE } from '@/lib/constants';
import { paginatedInput } from '../helpers';

export const userRouteRouter = router({
	fetchById: protectedProcedure
		.input(z.object({ routeId: z.number() }))
		.query(async ({ input, ctx }) => {
			const [existingUserRoute] = await ctx.db
				.select()
				.from(userRoute)
				.where(
					and(
						eq(userRoute.userId, ctx.user.id),
						eq(userRoute.routeId, input.routeId),
					),
				);

			if (!existingUserRoute) {
				return {
					route: null,
					success: true,
				};
			}

			return { route: existingUserRoute, success: true };
		}),

	toggleRouteSaved: protectedProcedure
		.input(z.object({ routeId: z.number() }))
		.mutation(async ({ input, ctx }) => {
			// If the user has already saved this route, we want to delete the saved route. Otherwise, we want to create it.
			const [existingUserRoute] = await ctx.db
				.select()
				.from(userRoute)
				.where(
					and(
						eq(userRoute.userId, ctx.user.id),
						eq(userRoute.routeId, input.routeId),
					),
				);

			if (existingUserRoute) {
				await ctx.db
					.delete(userRoute)
					.where(
						and(
							eq(userRoute.userId, ctx.user.id),
							eq(userRoute.routeId, input.routeId),
						),
					);
				return { data: null, success: true };
			}

			const savedRoute = await ctx.db
				.insert(userRoute)
				.values({
					userId: ctx.user.id,
					routeId: input.routeId,
				})
				.returning();

			return { data: savedRoute, success: true };
		}),

	listSavedRoutes: protectedProcedure
		.input(paginatedInput)
		.query(async ({ input, ctx }) => {
			const origin = alias(airport, 'origin');
			const destination = alias(airport, 'destination');

			const query = ctx.db
				.select()
				.from(userRoute)
				.leftJoin(route, eq(userRoute.routeId, route.id))
				.leftJoin(origin, eq(route.originIata, origin.iataCode))
				.leftJoin(destination, eq(route.destinationIata, destination.iataCode))
				.leftJoin(airline, eq(route.airlineIata, airline.iataCode));

			if (input.q) {
				query.where(
					or(
						ilike(route.originIata, input.q),
						ilike(route.destinationIata, input.q),
						ilike(airline.name, input.q),
						ilike(route.aircraftCodes, input.q),
					),
				);
			}

			const countQuery = await ctx.db.execute<{ count: number }>(
				sql`SELECT count(*) FROM (${query}) `,
			);

			query.offset(getOffset(input.page));
			query.limit(PAGE_SIZE);
			query.orderBy(desc(userRoute.createdAt));

			const result = await query;

			return {
				totalCount: countQuery.rows[0].count,
				data: result,
			};
		}),
});
