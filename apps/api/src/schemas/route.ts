import { z } from '@hono/zod-openapi';

export const RouteSchema = z.object({
  id: z.number().openapi({
    description: 'The unique identifier for the route',
    example: 1,
  }),
  airlineIata: z.string().openapi({
    description: 'The IATA code of the airline',
    example: 'UA',
  }),
  originIata: z.string().openapi({
    description: 'The IATA code of the origin airport',
    example: 'LAX',
  }),
  destinationIata: z.string().openapi({
    description: 'The IATA code of the destination airport',
    example: 'LAX',
  }),
  aircraftCodes: z.string().openapi({
    description: 'The aircraft codes for the route',
    example: '320, 321, 32A',
  }),
  averageDuration: z.number().openapi({
    description: 'The average duration of the route',
    example: 120,
  }),
});

export const RouteSearchSchema = RouteSchema.omit({
  aircraftCodes: true,
}).extend({
  originName: z.string().optional().openapi({
    description: 'The name of the origin airport',
    example: 'Los Angeles International Airport',
  }),
  destinationName: z.string().optional().openapi({
    description: 'The name of the destination airport',
    example: 'Los Angeles International Airport',
  }),
  userRouteId: z.number().optional().openapi({
    description: 'The ID of the user route',
    example: 1,
  }),
  userRouteUserId: z.number().optional().openapi({
    description: 'The ID of the user who created the user route',
    example: 1,
  }),
  userRouteCreatedAt: z.string().optional().openapi({
    description: 'The created at date of the user route',
    example: '2024-05-20T14:40:00.000Z',
  }),
  matchingAircraftCodes: z
    .array(z.string())
    .optional()
    .openapi({
      description: 'The aircraft codes that match the search',
      example: ['320', '321', '32A'],
    }),
  nonMatchingAircraftCodes: z
    .array(z.string())
    .optional()
    .openapi({
      description: 'The aircraft codes that do not match the search',
      example: ['330', '331', '33A'],
    }),
});
