import { OpenAPIHono } from '@hono/zod-openapi';
import { HonoGenerics } from '../types';
import { route } from '../lib/openapi';
import {
  ListAirlineSchema,
  CreateAirlineSchema,
  AirlineSchema,
} from '../schemas/airline';
import { PaginationParamsSchema } from '../schemas/pagination';
import { airline } from '../db/schema';
import { getOffset, getSafePageSize } from '../lib/db';
import { ilike, or, sql } from 'drizzle-orm';

export const airlineRouter = new OpenAPIHono<HonoGenerics>()
  .openapi(
    route
      .get('airlines')
      .query(PaginationParamsSchema)
      .returns(ListAirlineSchema)
      .setOperationId('listAirlines')
      .setTags(['airline'])
      .build(),
    async (c) => {
      const db = c.get('db');
      const { q, page, limit } = c.req.valid('query');

      const query = db.select().from(airline).$dynamic();

      if (q) {
        query.where(
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
          data,
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
