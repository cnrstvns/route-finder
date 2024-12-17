import { OpenAPIHono } from '@hono/zod-openapi';
import { HonoGenerics } from '../types';
import { route } from '../lib/openapi';
import { ListAircraftSchema } from '../schemas/aircraft';
import { PaginationParamsSchema } from '../schemas/pagination';
import { aircraft } from '../db/schema';
import { getOffset, getSafePageSize } from '../lib/db';
import { ilike, or, sql } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth';

export const aircraftRouter = new OpenAPIHono<HonoGenerics>().openapi(
  route
    .get('aircraft')
    .query(PaginationParamsSchema)
    .returns(ListAircraftSchema)
    .setOperationId('listAircraft')
    .setTags(['aircraft'])
    .setMiddleware(authMiddleware(false))
    .build(),
  async (c) => {
    const db = c.get('db');
    const { q, page, limit } = c.req.valid('query');

    const query = db
      .select()
      .from(aircraft)
      .orderBy(aircraft.modelName)
      .$dynamic();

    if (q) {
      query.where(
        or(
          ilike(aircraft.modelName, `%${q}%`),
          ilike(aircraft.iataCode, `%${q}%`),
        ),
      );
    }

    const countQuery = db.execute<{ count: number }>(
      sql`SELECT count(*)::integer FROM ${query}`,
    );

    query.orderBy(aircraft.iataCode);
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
