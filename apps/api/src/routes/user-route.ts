import { OpenAPIHono, z } from '@hono/zod-openapi';
import { HonoGenerics } from '../types';
import { route } from '../lib/openapi';
import {
  CreateUserRouteSchema,
  UserRouteSchema,
  PopulatedUserRouteSchema,
} from '../schemas/user-route';
import { PaginationParamsSchema } from '../schemas/pagination';
import { authMiddleware } from '../middleware/auth';
import { alias } from 'drizzle-orm/pg-core';
import {
  airline,
  airport,
  userRoute,
  route as airlineRoute,
  aircraft,
} from '../db/schema';
import {
  and,
  desc,
  eq,
  getTableColumns,
  ilike,
  like,
  or,
  sql,
} from 'drizzle-orm';
import { getOffset, getSafePageSize } from '../lib/db';
import { AirlineSchema } from '../schemas/airline';
import { AirportSchema } from '../schemas/airport';
import { RouteSchema } from '../schemas/route';
import { HTTPException } from 'hono/http-exception';
import { generateFlightNumber } from '../lib/generate-flight-number';
import { distanceInNauticalMiles } from '../lib/distance-in-nm';

type CompleteUserRouteData = {
  userRoute: {
    id: number;
    userId: number;
    routeId: number;
    createdAt: Date;
  };
  route: {
    id: number;
    airlineIata: string;
    originIata: string;
    destinationIata: string;
    aircraftCodes: string;
    averageDuration: number;
  };
  airline: {
    id: number;
    name: string;
    iataCode: string;
  };
  origin: {
    iataCode: string;
    name: string;
    city: string;
    country: string;
  };
  destination: {
    iataCode: string;
    name: string;
    city: string;
    country: string;
  };
};

export const userRouteRouter = new OpenAPIHono<HonoGenerics>()
  .openapi(
    route
      .post('user_routes/toggle')
      .body(CreateUserRouteSchema)
      .returns(z.object({}))
      .setOperationId('toggleUserRoute')
      .setTags(['user_route'])
      .setMiddleware(authMiddleware(false))
      .build(),
    async (c) => {
      const db = c.get('db');
      const { routeId } = c.req.valid('json');

      if (!c.var.user) {
        throw new HTTPException(401, { message: 'Unauthorized' });
      }

      const [existingUserRoute] = await db
        .select()
        .from(userRoute)
        .where(
          and(
            eq(userRoute.routeId, routeId),
            eq(userRoute.userId, c.var.user.id),
          ),
        );

      if (existingUserRoute) {
        await db
          .delete(userRoute)
          .where(eq(userRoute.id, existingUserRoute.id));
      } else {
        await db.insert(userRoute).values({
          routeId,
          userId: c.var.user.id,
        });
      }

      return c.json({ message: 'User route toggled successfully' }, 201);
    },
  )
  .openapi(
    route
      .get('user_routes')
      .query(PaginationParamsSchema)
      .returns(
        z.object({
          data: z.array(
            z.object({
              userRoute: UserRouteSchema,
              route: RouteSchema,
              airline: AirlineSchema,
              origin: AirportSchema,
              destination: AirportSchema,
            }),
          ),
          pagination: z.object({
            page: z.number(),
            totalCount: z.number(),
            hasMore: z.boolean(),
          }),
        }),
      )
      .setOperationId('listUserRoutes')
      .setTags(['user_route'])
      .setMiddleware(authMiddleware(false))
      .build(),
    async (c) => {
      const db = c.get('db');
      const { q, page, limit } = c.req.valid('query');

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

      const query = db
        .select({
          userRoute: userRouteColumns,
          route: airlineRouteColumns,
          airline: airlineColumns,
          origin: originColumns,
          destination: destinationColumns,
        })
        .from(userRoute)
        .leftJoin(airlineRoute, eq(userRoute.routeId, airlineRoute.id))
        .leftJoin(origin, eq(airlineRoute.originIata, origin.iataCode))
        .leftJoin(
          destination,
          eq(airlineRoute.destinationIata, destination.iataCode),
        )
        .leftJoin(airline, eq(airlineRoute.airlineIata, airline.iataCode))
        .$dynamic();

      if (q) {
        query.where(
          and(
            or(
              ilike(airlineRoute.originIata, q),
              ilike(airlineRoute.destinationIata, q),
              ilike(airline.name, q),
              ilike(airlineRoute.aircraftCodes, q),
            ),
            eq(userRoute.userId, c.var.user.id),
          ),
        );
      } else {
        query.where(eq(userRoute.userId, c.var.user.id));
      }

      const countQuery = await db.execute<{ count: number }>(
        sql`SELECT count(*)::integer FROM (${query}) `,
      );

      query.offset(getOffset(page, limit));
      query.limit(getSafePageSize(limit));
      query.orderBy(desc(userRoute.createdAt));

      const [data, countResult] = await Promise.all([query, countQuery]);

      const totalCount = countResult.rows[0].count;

      return c.json(
        {
          data: data as unknown as CompleteUserRouteData[],
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
      .get('user_routes/:id')
      .params(z.object({ id: z.string() }))
      .returns(PopulatedUserRouteSchema)
      .setOperationId('getUserRoute')
      .setTags(['user_route'])
      .setMiddleware(authMiddleware(false))
      .build(),
    async (c) => {
      const db = c.get('db');
      const { id } = c.req.valid('param');

      const origin = alias(airport, 'origin');
      const destination = alias(airport, 'destination');

      const userRouteColumns = getTableColumns(userRoute);
      const airlineRouteColumns = getTableColumns(airlineRoute);
      const airlineColumns = getTableColumns(airline);
      const originColumns = getTableColumns(origin);
      const destinationColumns = getTableColumns(destination);

      const [userRouteData] = await db
        .select({
          userRoute: userRouteColumns,
          route: airlineRouteColumns,
          airline: airlineColumns,
          origin: originColumns,
          destination: destinationColumns,
        })
        .from(userRoute)
        .innerJoin(airlineRoute, eq(userRoute.routeId, airlineRoute.id))
        .innerJoin(origin, eq(airlineRoute.originIata, origin.iataCode))
        .innerJoin(
          destination,
          eq(airlineRoute.destinationIata, destination.iataCode),
        )
        .innerJoin(airline, eq(airlineRoute.airlineIata, airline.iataCode))
        .where(eq(userRoute.id, Number(id)));

      if (!userRouteData) {
        throw new HTTPException(404, { message: 'User route not found' });
      }

      const parsedAircraftCodes = userRouteData.route.aircraftCodes.split(',');
      const aircraftWhere = parsedAircraftCodes.map((a) =>
        like(aircraft.iataCode, `%${a}%`),
      );

      const relatedAircraft = await db
        .select()
        .from(aircraft)
        .where(or(...aircraftWhere));

      return c.json(
        {
          ...userRouteData,
          aircraft: relatedAircraft,
          distanceInNm: distanceInNauticalMiles(
            userRouteData.origin.latitude,
            userRouteData.origin.longitude,
            userRouteData.destination.latitude,
            userRouteData.destination.longitude,
          ),
          flightNumber: generateFlightNumber(userRouteData.route.airlineIata),
        },
        200,
      );
    },
  );
