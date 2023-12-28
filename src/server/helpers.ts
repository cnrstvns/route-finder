import { z } from 'zod';

export const paginatedInput = z.object({
	q: z.string().nullish(),
	page: z
		.string()
		.transform((page) => parseInt(page))
		.default('1'),
});
