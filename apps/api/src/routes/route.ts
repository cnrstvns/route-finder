import { OpenAPIHono, z } from '@hono/zod-openapi';
import { HonoGenerics } from '../types';
import { route } from '../lib/openapi';
import {
  PaginatedResponseSchema,
  PaginationParamsSchema,
} from '../schemas/pagination';
import { RouteSchema, RouteSearchSchema } from '../schemas/route';
import { and, eq, getTableColumns, like, or, sql } from 'drizzle-orm';
import {
  airline,
  route as airlineRoute,
  airport,
  userRoute,
} from '../db/schema';
import { HTTPException } from 'hono/http-exception';
import { getOffset, getSafePageSize } from '../lib/db';
import { authMiddleware } from '../middleware/auth';
import { alias } from 'drizzle-orm/pg-core';
import { distanceInNauticalMiles } from '../lib/distance-in-nm';
import { generateFlightNumber } from '../lib/generate-flight-number';
import { UserRouteSchema } from '../schemas/user-route';
import { AirlineSchema } from '../schemas/airline';
import { AirportSchema } from '../schemas/airport';

type RouteResult = {
  id: number;
  airline_iata: string;
  origin_iata: string;
  destination_iata: string;
  origin_name: string;
  destination_name: string;
  average_duration: number;
  aircraft_iata_codes: string;
  user_route_id?: number;
  user_route_user_id?: number;
  user_route_created_at?: string;
};

export const routeRouter = new OpenAPIHono<HonoGenerics>()
  .openapi(
    route
      .get('routes/search')
      .query(
        PaginationParamsSchema.extend({
          aircraft: z.string(),
          airline: z.string(),
          minDuration: z.string(),
          maxDuration: z.string(),
        }),
      )
      .returns(PaginatedResponseSchema(RouteSearchSchema))
      .setOperationId('searchRoutes')
      .setTags(['route'])
      .setMiddleware(authMiddleware(false))
      .build(),
    async (c) => {
      const db = c.get('db');
      const { page, limit, aircraft, airline, minDuration, maxDuration } =
        c.req.valid('query');

      if (!c.var.user) {
        throw new HTTPException(401, { message: 'Unauthorized' });
      }

      const aircraftCodes = aircraft.split(',');
      const aircraftWhere = aircraftCodes.map((a) =>
        like(airlineRoute.aircraftCodes, `%${a}%`),
      );

      const query = sql`
        SELECT
          route.id,
          route.airline_iata,
          route.origin_iata,
          route.destination_iata,
          route.average_duration,
          origin.name AS origin_name,
          destination.name AS destination_name,
          STRING_AGG(aircraft.iata_code, ',') AS aircraft_iata_codes,
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
            c.var.user.id
          }
        WHERE
          airline_iata = ${airline}
          AND average_duration > ${Number(minDuration)}
          AND average_duration < ${Number(maxDuration)}
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

      const safePageSize = getSafePageSize(Number(limit));
      const offset = getOffset(Number(page), safePageSize);

      query.append(sql`LIMIT ${safePageSize} OFFSET ${offset};`);

      const result = await db.execute<RouteResult>(query);

      const mappedData: z.infer<typeof RouteSearchSchema>[] = (
        result.rows as RouteResult[]
      ).map((r) => ({
        id: r.id,
        airlineIata: r.airline_iata,
        originIata: r.origin_iata,
        destinationIata: r.destination_iata,
        matchingAircraftCodes: r.aircraft_iata_codes
          .split(',')
          .filter((a) => aircraftCodes.includes(a)),
        nonMatchingAircraftCodes: r.aircraft_iata_codes
          .split(',')
          .filter((a) => !aircraftCodes.includes(a)),
        averageDuration: r.average_duration,
        originName: r.origin_name,
        destinationName: r.destination_name,
        userRouteId: r.user_route_id,
        userRouteUserId: r.user_route_user_id,
        userRouteCreatedAt: r.user_route_created_at,
      }));

      return c.json({
        data: mappedData,
        pagination: {
          totalCount: Number(totalCount),
          page: Number(page),
          limit: safePageSize,
          hasMore: offset + safePageSize < totalCount,
        },
      });
    },
  )
  .openapi(
    route
      .get('routes/:id')
      .params(z.object({ id: z.string() }))
      .returns(
        z.object({
          userRoute: UserRouteSchema.nullable().openapi({
            description: 'The user route for the route',
          }),
          route: RouteSchema,
          airline: AirlineSchema,
          origin: AirportSchema,
          destination: AirportSchema,
        }),
      )
      .setOperationId('getRoute')
      .setTags(['route'])
      .setMiddleware(authMiddleware(false))
      .build(),
    async (c) => {
      const db = c.get('db');
      const { id } = c.req.valid('param');

      if (!c.var.user) {
        throw new HTTPException(401, { message: 'Unauthorized' });
      }

      const origin = alias(airport, 'origin');
      const destination = alias(airport, 'destination');

      const userRouteColumns = getTableColumns(userRoute);
      const airlineRouteColumns = getTableColumns(airlineRoute);
      const airlineColumns = getTableColumns(airline);
      const originColumns = getTableColumns(origin);
      const destinationColumns = getTableColumns(destination);

      const [routeData] = await db
        .select({
          userRoute: userRouteColumns,
          route: airlineRouteColumns,
          airline: airlineColumns,
          origin: originColumns,
          destination: destinationColumns,
        })
        .from(airlineRoute)
        .innerJoin(airline, eq(airlineRoute.airlineIata, airline.iataCode))
        .innerJoin(origin, eq(airlineRoute.originIata, origin.iataCode))
        .innerJoin(
          destination,
          eq(airlineRoute.destinationIata, destination.iataCode),
        )
        .leftJoin(
          userRoute,
          and(
            eq(airlineRoute.id, userRoute.routeId),
            eq(userRoute.userId, c.var.user.id),
          ),
        )
        .where(eq(airlineRoute.id, Number(id)));

      if (!routeData) {
        throw new HTTPException(404, { message: 'Route not found' });
      }

      return c.json(
        {
          ...routeData,
          distanceInNm: distanceInNauticalMiles(
            routeData.origin.latitude,
            routeData.origin.longitude,
            routeData.destination.latitude,
            routeData.destination.longitude,
          ),
          flightNumber: generateFlightNumber(routeData.route.airlineIata),
        },
        200,
      );
    },
  );
