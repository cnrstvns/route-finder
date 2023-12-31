import { airline, route } from '@/db';
import { PAGE_SIZE } from '@/lib/constants';
import { getOffset } from '@/lib/db';
import { eq, getTableColumns, ilike, or, sql } from 'drizzle-orm';
import { z } from 'zod';
import { paginatedInput } from '../helpers';
import { protectedProcedure, router } from '../trpc';

export const airlineRouter = router({
  listWithRouteCount: protectedProcedure
    .input(
      z.object({
        q: z
          .string()
          .optional()
          .transform((q) => q?.trim()),
      }),
    )
    .query(async ({ ctx, input }) => {
      const airlineColumns = getTableColumns(airline);
      const rows = await ctx.db
        .select({
          airline: {
            ...airlineColumns,
            routeCount: sql`count(${route.id})`.mapWith(Number),
          },
        })
        .from(airline)
        .innerJoin(route, eq(airline.iataCode, route.airlineIata))
        .having(input.q ? ilike(airline.name, `%${input.q}%`) : undefined)
        .groupBy(airline.id, airline.name)
        .orderBy(airline.name);

      return { data: rows };
    }),
  list: protectedProcedure
    .input(paginatedInput)
    .query(async ({ ctx, input }) => {
      const query = ctx.db
        .select()
        .from(airline)
        .where(
          input.q
            ? or(
                ilike(airline.name, `%${input.q}%`),
                ilike(airline.iataCode, `%${input.q}%`),
              )
            : undefined,
        );

      const countQuery = await ctx.db.execute<{ count: number }>(
        sql`SELECT count(*) FROM (${query})`,
      );
      const totalCount = countQuery.rows[0].count;

      query.orderBy(airline.iataCode);
      query.limit(PAGE_SIZE);
      query.offset(getOffset(input.page));

      const data = await query;

      return { data, totalCount };
    }),
  newFlight: protectedProcedure
    .input(
      z.object({
        airlineId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      type AircraftResults = {
        rows: { id: number; iata_code: string; model_name: string }[];
      };

      const airlines = await ctx.db
        .select()
        .from(airline)
        .where(eq(airline.slug, input.airlineId));
      const firstAirline = airlines[0];

      const aircraftQuery = sql`
				select distinct aircraft.iata_code, aircraft.model_name
				from route
				join lateral unnest(string_to_array(route.aircraft_codes, ',')) as t(aircraft_type) on true
				join aircraft on aircraft.iata_code = t.aircraft_type
				where route.airline_iata = ${firstAirline.iataCode};
			`;

      const aircraftResults: AircraftResults =
        await ctx.db.execute(aircraftQuery);

      return {
        airline: firstAirline,
        aircraft: aircraftResults.rows,
      };
    }),
});
