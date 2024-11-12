import { OpenAPIHono, z } from '@hono/zod-openapi';
import {
  CreateFeedbackSchema,
  PopulatedFeedbackSchema,
} from '../schemas/feedback';
import { HonoGenerics } from '../types';
import { route } from '../lib/openapi';
import {
  PaginationParamsSchema,
  PaginatedResponseSchema,
} from '../schemas/pagination';
import { desc, eq, getTableColumns, ilike, or, sql } from 'drizzle-orm';
import { feedback, user } from '../db/schema';
import { getOffset } from '../lib/db';
import { getSafePageSize } from '../lib/db';
import { authMiddleware } from '../middleware/auth';

export const feedbackRouter = new OpenAPIHono<HonoGenerics>()
  .openapi(
    route
      .post('feedback')
      .returns(z.object({}))
      .body(CreateFeedbackSchema)
      .setOperationId('feedback.create')
      .setTags(['feedback'])
      .setMiddleware(authMiddleware(false))
      .build(),
    async (c) => {
      return c.json({ message: 'Feedback created successfully' }, 201);
    },
  )
  .openapi(
    route
      .get('feedback')
      .query(PaginationParamsSchema)
      .returns(PaginatedResponseSchema(PopulatedFeedbackSchema))
      .setOperationId('listFeedback')
      .setTags(['feedback'])
      .setMiddleware(authMiddleware(true))
      .build(),
    async (c) => {
      const db = c.get('db');
      const { q, page, limit } = c.req.valid('query');

      const columns = getTableColumns(feedback);
      const userName = sql<string>`CONCAT("user".first_name, ' ', "user".last_name)`;

      const query = db
        .select({
          userName: userName,
          emailAddress: user.emailAddress,
          profilePictureUrl: user.profilePictureUrl,
          ...columns,
        })
        .from(feedback)
        .leftJoin(user, eq(user.id, feedback.userId))
        .$dynamic();

      if (q) {
        query.where(
          or(
            sql`${userName} ILIKE ${q}`,
            ilike(feedback.feedbackText, q),
            ilike(user.emailAddress, q),
          ),
        );
      }

      const countQuery = db.execute<{ count: number }>(
        sql<{
          count: number;
        }>`SELECT count(*)::integer FROM (${query}) as total_count `,
      );

      query.orderBy(desc(feedback.createdAt));
      query.limit(getSafePageSize(limit));
      query.offset(getOffset(page, limit));

      const [rows, countResult] = await Promise.all([query, countQuery]);

      const totalCount = countResult.rows[0].count;

      return c.json(
        {
          data: rows,
          pagination: {
            page,
            totalCount,
            hasMore: rows.length < totalCount,
          },
        },
        200,
      );
    },
  );

export default feedbackRouter;
