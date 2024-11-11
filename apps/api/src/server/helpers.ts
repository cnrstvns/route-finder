import { z } from 'zod';

export const paginatedInput = z.object({
  q: z
    .string()
    .nullish()
    .transform((q) => q?.trim()),
  page: z
    .string()
    .transform((page) => parseInt(page))
    .default('1'),
});
