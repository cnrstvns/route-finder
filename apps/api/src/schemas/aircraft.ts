import { z } from '@hono/zod-openapi';
import { PaginatedResponseSchema } from './pagination';

export const AircraftSchema = z
  .object({
    id: z.number().openapi({
      description: 'The ID of the aircraft',
      example: 1,
    }),
    iataCode: z.string().openapi({
      description: 'The IATA code of the aircraft',
      example: '737',
    }),
    modelName: z.string().openapi({
      description: 'The model name of the aircraft',
      example: 'Boeing 737',
    }),
    shortName: z.string().openapi({
      description: 'The short name of the aircraft',
      example: '737',
    }),
  })
  .openapi('Aircraft');

export const ListAircraftSchema =
  PaginatedResponseSchema(AircraftSchema).openapi('ListAircraft');
