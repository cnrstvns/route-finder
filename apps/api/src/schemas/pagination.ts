import { z } from '@hono/zod-openapi';
import { ZodSchema } from 'zod';

export const PaginationParamsSchema = z.object({
  q: z
    .string()
    .optional()
    .transform((q) => q?.trim())
    .openapi({
      param: {
        in: 'query',
        name: 'q',
        description: 'The search query',
      },
      example: 'John Doe',
    }),
  page: z
    .string()
    .transform((page) => parseInt(page))
    .default('1')
    .openapi({
      param: {
        name: 'page',
        in: 'query',
        description: 'The page number',
      },
      example: '1',
    }),
  limit: z
    .string()
    .transform((limit) => parseInt(limit))
    .default('10')
    .openapi({
      param: {
        name: 'limit',
        in: 'query',
        description: 'The number of items per page',
      },
      example: '10',
    }),
});

export const PaginatedResponseSchema = <S extends ZodSchema>(schema: S) =>
  z.object({
    data: z.array(schema),
    pagination: z.object({
      page: z.number(),
      totalCount: z.number(),
      hasMore: z.boolean(),
    }),
  });
