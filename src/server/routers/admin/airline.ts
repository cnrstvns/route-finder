import { adminProcedure, router } from '@/server/trpc';
import { z } from 'zod';
import { airline } from '@/db';
import { eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { getRoutes } from '@/services/flights-from';

export const airlineRouter = router({
	createAirline: adminProcedure
		.input(
			z.object({
				name: z.string(),
				iataCode: z
					.string()
					.length(2)
					.transform((ic) => ic.toUpperCase()),
				slug: z.string().transform((s) => s.toLowerCase()),
				logoPath: z.string().url(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const [existingAirline] = await ctx.db
				.select()
				.from(airline)
				.where(eq(airline.iataCode, input.iataCode));

			if (existingAirline) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Airline already exists.',
				});
			}

			const apiAirline = await getRoutes(input.iataCode);

			if (!apiAirline) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Airline does not exist.',
				});
			}

			// start job
		}),
});
