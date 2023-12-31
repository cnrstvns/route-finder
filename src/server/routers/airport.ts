import { airport } from '@/db';
import { PAGE_SIZE } from '@/lib/constants';
import { getOffset } from '@/lib/db';
import { ilike, or, sql } from 'drizzle-orm';
import { paginatedInput } from '../helpers';
import { protectedProcedure, router } from '../trpc';

export const airportRouter = router({
  list: protectedProcedure
    .input(paginatedInput)
    .query(async ({ ctx, input }) => {
      const query = ctx.db
        .select()
        .from(airport)
        .where(
          input.q
            ? or(
                ilike(airport.name, `%${input.q}%`),
                ilike(airport.iataCode, `%${input.q}%`),
                ilike(airport.city, `%${input.q}%`),
                ilike(airport.country, `%${input.q}%`),
              )
            : undefined,
        );

      const countQuery = await ctx.db.execute<{ count: number }>(
        sql`SELECT count(*) FROM (${query})`,
      );
      const totalCount = countQuery.rows[0].count;

      query.orderBy(airport.iataCode);
      query.limit(PAGE_SIZE);
      query.offset(getOffset(input.page));

      const airports = await query;

      return { data: airports, totalCount };
    }),
});
