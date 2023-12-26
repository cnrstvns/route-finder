import { db, feedback as feedbackTable, user as userTable } from '@/db';
import { getIp } from '@/lib/get-ip';
import { auth } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import status from 'http-status';
import { NextResponse } from 'next/server';
import * as yup from 'yup';
import { rateLimit } from './rate-limit';

const LIMIT_PER_HOUR = 10;
const HOUR_IN_SECONDS = 3600;

const validationSchema = yup.object().shape({
	feedback: yup.string().required().min(15).max(500),
});

export async function POST(req: Request) {
	// Make sure user is logged in
	const { userId } = auth();
	if (!userId) {
		return new Response('Unauthorized', { status: 401 });
	}

	const userResult = await db
		.select()
		.from(userTable)
		.where(eq(userTable.clerkId, userId));
	const user = userResult[0];

	if (!user) {
		return new Response('Unauthorized', { status: 401 });
	}

	// Limit to 10 requests per hour per IP
	const ip = getIp();
	const result = await rateLimit(ip, LIMIT_PER_HOUR, HOUR_IN_SECONDS);

	// If at limit, deny request
	if (!result.success) {
		return NextResponse.json(
			{ message: 'You are being rate limited.' },
			{
				status: status.TOO_MANY_REQUESTS,
				headers: result.getHeaders(),
			},
		);
	}

	try {
		// Safely validate that the payload is valid JSON & matches the payload schema
		const body = await req.text();
		const parsedBody = JSON.parse(body);
		const content = await validationSchema.validate(parsedBody);

		// Insert the feedback to the database
		await db.insert(feedbackTable).values({
			userId: user.id,
			feedbackText: content.feedback,
		});
	} catch (err) {
		return NextResponse.json(
			{ message: 'Bad Request: Invalid request body.' },
			{
				status: status.BAD_REQUEST,
				headers: result.getHeaders(),
			},
		);
	}

	return NextResponse.json(null, {
		status: status.ACCEPTED,
		headers: result.getHeaders(),
	});
}
