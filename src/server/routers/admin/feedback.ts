import { paginatedInput } from '@/server/helpers';
import { adminProcedure, router } from '@/server/trpc';
import { count, desc, eq, getTableColumns, ilike, or, sql } from 'drizzle-orm';
import { feedback, user } from '@/db';
import { PAGE_SIZE } from '@/lib/constants';
import { getOffset } from '@/lib/db';

export const feedbackRouter = router({
	list: adminProcedure.input(paginatedInput).query(async ({ ctx, input }) => {
		const columns = getTableColumns(feedback);
		const userName = sql<string>`CONCAT("user".first_name, ' ', "user".last_name)`;

		const query = ctx.db
			.select({
				userName: userName,
				emailAddress: user.emailAddress,
				profilePictureUrl: user.profilePictureUrl,
				...columns,
			})
			.from(feedback)
			.leftJoin(user, eq(user.id, feedback.userId));

		const countQuery = await ctx.db.execute<{ count: number }>(
			sql`SELECT count(*) FROM (${query}) `,
		);
		const totalCount = countQuery.rows[0].count;

		if (input.q) {
			query.where(
				or(
					sql`${userName} ILIKE ${input.q}`,
					ilike(feedback.feedbackText, input.q),
					ilike(user.emailAddress, input.q),
				),
			);
		}

		query.orderBy(desc(feedback.createdAt));
		query.limit(PAGE_SIZE);
		query.offset(getOffset(input.page));

		const rows = await query;

		return {
			data: rows,
			totalCount,
		};
	}),
});
