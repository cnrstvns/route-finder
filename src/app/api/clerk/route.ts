import { db, user } from '@/db';
import type { WebhookEvent } from '@clerk/clerk-sdk-node';
import { eq } from 'drizzle-orm';
import status from 'http-status';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';

export async function POST(req: Request) {
	const svixId = req.headers.get('svix-id') ?? '';
	const svixTimestamp = req.headers.get('svix-timestamp') ?? '';
	const svixSignature = req.headers.get('svix-signature') ?? '';

	const body = await req.text();
	const svix = new Webhook(process.env.CLERK_WEBHOOK_SIGNING_SECRET);

	const payload = svix.verify(body, {
		'svix-id': svixId,
		'svix-timestamp': svixTimestamp,
		'svix-signature': svixSignature,
	}) as WebhookEvent;

	switch (payload.type) {
		case 'user.created': {
			const createdUser = payload.data;

			const primaryEmailAddress = createdUser.email_addresses.find(
				(e) => e.id === createdUser.primary_email_address_id,
			);

			await db.insert(user).values({
				clerkId: createdUser.id,
				updatedAt: new Date(createdUser.updated_at),
				createdAt: new Date(createdUser.created_at),
				profilePictureUrl: createdUser.image_url,
				emailAddress: primaryEmailAddress?.email_address,
				requestedDeletionAt: null,
			});

			break;
		}

		case 'user.updated': {
			const updatedUser = payload.data;

			const primaryEmailAddress = updatedUser.email_addresses.find(
				(e) => e.id === updatedUser.primary_email_address_id,
			);

			await db
				.update(user)
				.set({
					updatedAt: new Date(updatedUser.updated_at),
					profilePictureUrl: updatedUser.image_url,
					emailAddress: primaryEmailAddress?.email_address,
				})
				.where(eq(user.clerkId, updatedUser.id));

			break;
		}

		case 'user.deleted': {
			const deletedUser = payload.data;

			if (!deletedUser.id) {
				return NextResponse.json(null, { status: status.ACCEPTED });
			}

			await db
				.update(user)
				.set({
					requestedDeletionAt: new Date(),
				})
				.where(eq(user.clerkId, deletedUser.id));

			break;
		}
	}

	return NextResponse.json(null, { status: status.ACCEPTED });
}
