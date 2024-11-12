import { z } from '@hono/zod-openapi';
import { PaginatedResponseSchema } from './pagination';

export const AirportSchema = z
  .object({
    id: z.number().openapi({
      description: 'The ID of the airport',
      example: 1,
    }),
    iataCode: z.string().openapi({
      description: 'The IATA code of the airport',
      example: 'LAX',
    }),
    icaoCode: z.string().openapi({
      description: 'The ICAO code of the airport',
      example: 'KLAX',
    }),
    name: z.string().openapi({
      description: 'The name of the airport',
      example: 'Los Angeles International Airport',
    }),
    city: z.string().openapi({
      description: 'The city of the airport',
      example: 'Los Angeles',
    }),
    country: z.string().openapi({
      description: 'The country of the airport',
      example: 'United States',
    }),
    latitude: z.string().openapi({
      description: 'The latitude of the airport',
      example: '33.9416',
    }),
    longitude: z.string().openapi({
      description: 'The longitude of the airport',
      example: '-118.4085',
    }),
    elevation: z.string().openapi({
      description: 'The elevation of the airport',
      example: '123',
    }),
    size: z.enum(['small', 'medium', 'large']).openapi({
      description: 'The size of the airport',
      example: 'large',
    }),
  })
  .openapi('Airport');

export const ListAirportSchema =
  PaginatedResponseSchema(AirportSchema).openapi('ListAirport');
