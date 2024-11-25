import { OpenAPIHono, z } from '@hono/zod-openapi';
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
  )
  .openapi(
    route
      .get('airlines/{id}/aircraft')
      .params(z.object({ id: z.string() }))
      .returns(
        z.object({
          airline: AirlineSchema,
          aircraft: z.array(
            z.object({
              iata_code: z.string(),
              model_name: z.string(),
            }),
          ),
        }),
      )
      .setOperationId('listAirlineAircraft')
      .setTags(['airline'])
      .build(),
    async (c) => {
      const db = c.get('db');
      const { id } = c.req.valid('param');

      type AircraftResults = {
        iata_code: string;
        model_name: string;
      };

      const [airlineData] = await db
        .select()
        .from(airline)
        .where(eq(airline.id, Number(id)));

      const aircraftQuery = sql`
				SELECT distinct aircraft.iata_code as iata_code, aircraft.model_name as model_name
				FROM route
				JOIN LATERAL UNNEST(string_to_array(route.aircraft_codes, ',')) as t(aircraft_type) on true
				JOIN aircraft on aircraft.iata_code = t.aircraft_type
				WHERE route.airline_iata = ${airlineData.iataCode}
        ORDER BY aircraft.model_name;
			`;

      const aircraftResults = await db.execute<AircraftResults>(aircraftQuery);

      return c.json(
        {
          airline: airlineData,
          aircraft: (aircraftResults.rows as AircraftResults[]).map((r) => ({
            iataCode: r.iata_code,
            modelName: r.model_name,
          })),
        },
        200,
      );
    },
  );
