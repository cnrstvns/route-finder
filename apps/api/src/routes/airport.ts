import { OpenAPIHono, z } from '@hono/zod-openapi';
import { HonoGenerics } from '../types';
import { route } from '../lib/openapi';
import { AirportSchema, ListAirportSchema } from '../schemas/airport';
import { PaginationParamsSchema } from '../schemas/pagination';
import { airport } from '../db/schema';
import { getOffset, getSafePageSize } from '../lib/db';
import { eq, ilike, or, sql } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth';
import { HTTPException } from 'hono/http-exception';

export const airportRouter = new OpenAPIHono<HonoGenerics>()
  .openapi(
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
            ilike(airport.name, `%${q}%`),
            ilike(airport.iataCode, `%${q}%`),
            ilike(airport.city, `%${q}%`),
            ilike(airport.country, `%${q}%`),
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
  )
  .openapi(
    route
      .get('airports/{id}')
      .params(z.object({ id: z.string() }))
      .returns(AirportSchema)
      .setOperationId('retrieveAirport')
      .setTags(['airport'])
      .setMiddleware(authMiddleware(false))
      .build(),
    async (c) => {
      const db = c.get('db');
      const { id } = c.req.valid('param');

      const [airportData] = await db
        .select()
        .from(airport)
        .where(eq(airport.id, Number(id)));

      if (!airportData) throw new HTTPException(404, { message: 'Not found' });

      return c.json(airportData, 200);
    },
  );
