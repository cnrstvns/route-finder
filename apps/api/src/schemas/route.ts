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
