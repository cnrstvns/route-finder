import { feedback } from '@/db';
import { z } from 'zod';
import { protectedProcedure, rateLimitMiddleware, router } from '../trpc';

const LIMIT_PER_HOUR = 10;
const HOUR_IN_SECONDS = 3600;

const feedbackProcedure = protectedProcedure.use(
	rateLimitMiddleware(LIMIT_PER_HOUR, HOUR_IN_SECONDS),
);

export const feedbackRouter = router({
	submitFeedback: feedbackProcedure
		.input(
			z.object({
				feedback: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.db.insert(feedback).values({
				userId: ctx.user!.id,
				feedbackText: input.feedback,
			});

			return { success: true };
		}),
});
