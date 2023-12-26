import { Header } from '@/components/navigation/header';
import { PageTitle } from '@/components/ui/page-title';
import { Pagination } from '@/components/ui/pagination';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { feedback as feedbackTable, user as userTable, db } from '@/db';
import { PAGE_SIZE } from '@/lib/constants';
import { sql } from 'drizzle-orm';
import Image from 'next/image';
import { dayjs } from '@/lib/time';

type PageParams = { searchParams: { page?: string } };
type FeedbackResult = {
	id: number;
	user_id: number;
	feedback_text: string;
	created_at: Date;
	profile_picture_url: string;
	email_address: string;
	user_name: string;
};

export default async function Feedback({ searchParams }: PageParams) {
	const page = Number(searchParams.page ?? 1);
	const query = sql`
		SELECT
			feedback.id,
			feedback.user_id,
			feedback.feedback_text,
			feedback.created_at,
			"user".profile_picture_url,
			"user".email_address,
			CONCAT("user".first_name, ' ', "user".last_name) as user_name
		FROM
			${feedbackTable}
		JOIN
			${userTable} on feedback.user_id = "user".id
		`;

	const countQuery = await db.execute<{ count: number }>(
		sql`SELECT count(*) FROM (${query}) `,
	);
	const totalCount = countQuery.rows[0].count;

	query.append(sql`
		ORDER BY
			feedback.created_at DESC
		LIMIT
      ${PAGE_SIZE}
    OFFSET
      ${page * PAGE_SIZE - PAGE_SIZE}
  `);

	const { rows: feedback } = await db.execute<FeedbackResult>(query);

	return (
		<div>
			<Header searchPlaceholder="Search for feedback..." profile />

			<PageTitle
				title="Feedback"
				subtitle="List of user feedback and profile information."
				header
			/>

			<div className="overflow-auto w-screen md:w-full">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>User</TableHead>
							<TableHead>Feedback</TableHead>
							<TableHead>Created</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody className="bg-white">
						{feedback.map((userFeedback) => (
							<TableRow key={userFeedback.id}>
								<TableCell>
									<div className="flex space-x-3">
										<Image
											src={userFeedback.profile_picture_url}
											height={40}
											width={40}
											alt={userFeedback.user_name}
											className="rounded-full"
										/>
										<div className="flex flex-col">
											<div className="text-neutral-700 dark:text-zinc-300 font-medium">
												{userFeedback.user_name}
											</div>
											<div className="text-neutral-600 dark:text-zinc-400">
												{userFeedback.email_address}
											</div>
										</div>
									</div>
								</TableCell>
								<TableCell>{userFeedback.feedback_text}</TableCell>
								<TableCell>
									{dayjs(userFeedback.created_at).fromNow()}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			<Pagination totalCount={totalCount} resource="feedback" />
		</div>
	);
}
