import { OpenAPIHono } from '@hono/zod-openapi';
import { HonoGenerics } from '../types';
import { route } from '../lib/openapi';
import {
  ListAirlineSchema,
  CreateAirlineSchema,
  AirlineSchema,
} from '../schemas/airline';
import { PaginationParamsSchema } from '../schemas/pagination';
import { airline, route as airlineRoute } from '../db/schema';
import { getOffset, getSafePageSize } from '../lib/db';
import { eq, getTableColumns, ilike, or, sql } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth';

export const airlineRouter = new OpenAPIHono<HonoGenerics>()
  .openapi(
    route
      .get('airlines')
      .query(PaginationParamsSchema)
      .returns(ListAirlineSchema)
      .setOperationId('listAirlines')
      .setTags(['airline'])
      .setMiddleware(authMiddleware(false))
      .build(),
    async (c) => {
      const db = c.get('db');
      const { q, page, limit } = c.req.valid('query');

      const airlineColumns = getTableColumns(airline);
      const query = db
        .select({
          airline: {
            ...airlineColumns,
            routeCount: sql`count(${airlineRoute.id})`.mapWith(Number),
          },
        })
        .from(airline)
        .leftJoin(airlineRoute, eq(airline.iataCode, airlineRoute.airlineIata))
        .groupBy(airline.id, airline.name)
        .$dynamic();

      if (q) {
        query.having(
          or(ilike(airline.name, `%${q}%`), ilike(airline.iataCode, `%${q}%`)),
        );
      }

      const countQuery = db.execute<{ count: number }>(
        sql`SELECT count(*)::integer FROM (${query})`,
      );

      query.orderBy(airline.iataCode);
      query.limit(getSafePageSize(limit));
      query.offset(getOffset(page, limit));

      const [data, countResult] = await Promise.all([query, countQuery]);

      const totalCount = countResult.rows[0].count;

      return c.json(
        {
          data: data.map((d) => d.airline),
          pagination: {
            page,
            totalCount,
            hasMore: page * limit < totalCount,
          },
        },
        200,
      );
    },
  )
  .openapi(
    route
      .post('airlines')
      .body(CreateAirlineSchema)
      .returns(AirlineSchema)
      .setOperationId('createAirline')
      .setTags(['airline'])
      .build(),
    async (c) => {
      const db = c.get('db');
      const airlineData = c.req.valid('json');

      const [data] = await db.insert(airline).values(airlineData).returning();

      return c.json(data, 201);
    },
  );
