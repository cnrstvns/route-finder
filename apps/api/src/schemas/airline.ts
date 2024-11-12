import { z } from '@hono/zod-openapi';
import { PaginatedResponseSchema } from './pagination';

export const AirlineSchema = z
  .object({
    id: z.number().openapi({
      description: 'The ID of the airline',
      example: 1,
    }),
    slug: z.string().openapi({
      description: 'The slug of the airline',
      example: 'delta-airlines',
    }),
    name: z.string().openapi({
      description: 'The name of the airline',
      example: 'Delta Airlines',
    }),
    iataCode: z.string().openapi({
      description: 'The IATA code of the airline',
      example: 'DL',
    }),
    logoPath: z.string().url().openapi({
      description: 'The URL of the airline logo',
      example: 'https://example.com/logo.png',
    }),
  })
  .openapi('Airline');

export const ListAirlineSchema = PaginatedResponseSchema(
  AirlineSchema.merge(
    z.object({
      routeCount: z.number().openapi({
        description: 'The number of routes for the airline',
        example: 10,
      }),
    }),
  ),
).openapi('ListAirline');

export const CreateAirlineSchema = AirlineSchema.omit({ id: true }).openapi(
  'CreateAirline',
);
