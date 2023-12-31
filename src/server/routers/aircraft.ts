import { aircraft } from '@/db';
import { PAGE_SIZE } from '@/lib/constants';
import { getOffset } from '@/lib/db';
import { ilike, or, sql } from 'drizzle-orm';
import { paginatedInput } from '../helpers';
import { protectedProcedure, router } from '../trpc';

export const aircraftRouter = router({
  list: protectedProcedure
    .input(paginatedInput)
    .query(async ({ ctx, input }) => {
      const query = ctx.db
        .select()
        .from(aircraft)
        .where(
          input.q
            ? or(
                ilike(aircraft.modelName, `%${input.q}%`),
                ilike(aircraft.iataCode, `%${input.q}%`),
              )
            : undefined,
        )
        .orderBy(aircraft.modelName);

      const countQuery = await ctx.db.execute<{ count: number }>(
        sql`SELECT count(*) FROM ${query}`,
      );
      const totalCount = countQuery.rows[0].count;

      query.limit(PAGE_SIZE);
      query.offset(getOffset(input.page));

      const aircrafts = await query;

      return { data: aircrafts, totalCount };
    }),
});
