import { z } from '@hono/zod-openapi';
import { PaginatedResponseSchema } from './pagination';
import { AirportSchema } from './airport';
import { AirlineSchema } from './airline';
import { RouteSchema } from './route';
import { AircraftSchema } from './aircraft';

export const UserRouteSchema = z
  .object({
    id: z.number().openapi({
      description: 'The ID of the user route',
      example: 1,
    }),
    userId: z.number().openapi({
      description: 'The ID of the user',
      example: 1,
    }),
    routeId: z.number().openapi({
      description: 'The ID of the route',
      example: 1,
    }),
    createdAt: z.string().datetime().openapi({
      description: 'The date the user route was created',
      example: '2021-01-01T00:00:00.000Z',
    }),
  })
  .openapi('UserRoute');

export const ListUserRouteSchema = PaginatedResponseSchema(UserRouteSchema);

export const CreateUserRouteSchema = UserRouteSchema.omit({
  id: true,
  createdAt: true,
  userId: true,
});

export const PopulatedUserRouteSchema = z.object({
  userRoute: UserRouteSchema,
  origin: AirportSchema,
  destination: AirportSchema,
  airline: AirlineSchema,
  route: RouteSchema,
  aircraft: z.array(AircraftSchema),
  distanceInNm: z.string(),
  flightNumber: z.string(),
});
