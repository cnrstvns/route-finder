import { OpenAPIHono, z } from '@hono/zod-openapi';
import { HonoGenerics } from '../types';
import { route } from '../lib/openapi';
import { CreateUserRouteSchema, UserRouteSchema } from '../schemas/user-route';
import { PaginationParamsSchema } from '../schemas/pagination';
import { authMiddleware } from '../middleware/auth';
import { alias } from 'drizzle-orm/pg-core';
import {
  airline,
  airport,
  userRoute,
  route as airlineRoute,
} from '../db/schema';
import { desc, eq, ilike, or, sql } from 'drizzle-orm';
import { getOffset, getSafePageSize } from '../lib/db';
import { AirlineSchema } from '../schemas/airline';
import { AirportSchema } from '../schemas/airport';
import { RouteSchema } from '../schemas/route';

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
              user_route: UserRouteSchema,
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

      const origin = alias(airport, 'origin');
      const destination = alias(airport, 'destination');

      const query = db
        .select()
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
          or(
            ilike(airlineRoute.originIata, q),
            ilike(airlineRoute.destinationIata, q),
            ilike(airline.name, q),
            ilike(airlineRoute.aircraftCodes, q),
          ),
        );
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
          data: data as unknown as {
            user_route: z.infer<typeof UserRouteSchema>;
            route: z.infer<typeof RouteSchema>;
            airline: z.infer<typeof AirlineSchema>;
            origin: z.infer<typeof AirportSchema>;
            destination: z.infer<typeof AirportSchema>;
          }[],
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
      .params(z.object({ id: z.number() }))
      .returns(UserRouteSchema)
      .setOperationId('getUserRoute')
      .setTags(['user_route'])
      .setMiddleware(authMiddleware(false))
      .build(),
    async (c) => {
      return c.json({ message: 'User route fetched successfully' }, 200);
    },
  );
