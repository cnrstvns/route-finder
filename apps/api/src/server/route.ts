import { db, route } from '@/db';
import { PAGE_SIZE } from '@/lib/constants';
import { like, or, sql } from 'drizzle-orm';
import { z } from 'zod';
import { paginatedInput } from '../helpers';
import { protectedProcedure, router } from '../trpc';

export type RouteResult = {
  id: number;
  origin_iata: string;
  destination_iata: string;
  origin_name: string;
  destination_name: string;
  average_duration: number;
  aircraft_short_names: string;
  user_route_id: number;
  user_route_user_id: number;
  user_route_created_at: Date;
};

export const routeRouter = router({
  search: protectedProcedure
    .input(
      paginatedInput.extend({
        aircraft: z.string(),
        airline: z.string(),
        minDuration: z.string(),
        maxDuration: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const aircraft = input.aircraft.split(',');
      const aircraftWhere = aircraft.map((a) =>
        like(route.aircraftCodes, `%${a}%`),
      );

      const query = sql`
        SELECT
          route.id,
          route.origin_iata,
          route.destination_iata,
          route.average_duration,
          origin.name AS origin_name,
          destination.name AS destination_name,
          STRING_AGG(aircraft.iata_code, ',') AS aircraft_short_names,
          user_route.id as user_route_id,
          user_route.user_id as user_route_user_id,
          user_route.created_at as user_route_created_at
        FROM
          route
          JOIN airport AS origin ON route.origin_iata = origin.iata_code
          JOIN airport AS destination ON route.destination_iata = destination.iata_code
          JOIN LATERAL UNNEST(string_to_array(route.aircraft_codes, ',')) AS ac_codes ON TRUE
          JOIN aircraft ON aircraft.iata_code = ac_codes
          LEFT JOIN user_route ON user_route.route_id = route.id AND user_route.user_id = ${
            ctx.user.id
          }
        WHERE
          airline_iata = ${input.airline}
          AND average_duration > ${input.minDuration}
          AND average_duration < ${input.maxDuration}
          AND ${or(...aircraftWhere)}
        GROUP BY
          route.id,
          origin.name,
          destination.name,
          user_route.id
        ORDER BY
          average_duration
      `;

      const countQuery = await db.execute<{ count: number }>(
        sql`SELECT count(*) FROM (${query});`,
      );
      const totalCount = countQuery.rows[0].count;

      query.append(
        sql`LIMIT ${PAGE_SIZE} OFFSET ${input.page * PAGE_SIZE - PAGE_SIZE};`,
      );

      const { rows } = await db.execute<RouteResult>(query);

      return {
        data: rows,
        totalCount,
      };
    }),
});
