import { OpenAPIHono } from '@hono/zod-openapi';
import { HonoGenerics } from '../types';
import { route } from '../lib/openapi';
import { ListAirportSchema } from '../schemas/airport';
import { PaginationParamsSchema } from '../schemas/pagination';
import { airport } from '../db/schema';
import { getOffset, getSafePageSize } from '../lib/db';
import { ilike, or, sql } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth';

export const airportRouter = new OpenAPIHono<HonoGenerics>().openapi(
  route
    .get('airports')
    .query(PaginationParamsSchema)
    .returns(ListAirportSchema)
    .setOperationId('listAirports')
    .setTags(['airport'])
    .setMiddleware(authMiddleware(false))
    .build(),
  async (c) => {
    const db = c.get('db');
    const { q, page, limit } = c.req.valid('query');

    const query = db.select().from(airport).orderBy(airport.name).$dynamic();

    if (q) {
      query.where(
        or(
          ilike(airport.name, `%${input.q}%`),
          ilike(airport.iataCode, `%${input.q}%`),
          ilike(airport.city, `%${input.q}%`),
          ilike(airport.country, `%${input.q}%`),
        ),
      );
    }

    const countQuery = db.execute<{ count: number }>(
      sql`SELECT count(*)::integer FROM ${query}`,
    );

    query.orderBy(airport.iataCode);
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
);
