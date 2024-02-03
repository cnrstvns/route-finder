import { db, user } from '@/db';
import { posthog } from '@/lib/analytics';
import type { WebhookEvent } from '@clerk/clerk-sdk-node';
import { eq } from 'drizzle-orm';
import status from 'http-status';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Invalid parameters' });

  const [userRow] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.clerkId, id));

  if (userRow) {
    return NextResponse.json({ ready: true });
  }

  return NextResponse.json({ ready: false });
}

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
        firstName: createdUser.first_name,
        lastName: createdUser.last_name,
      });

      posthog.capture({
        distinctId: payload.data.id,
        event: 'User signed up',
        properties: {
          email: primaryEmailAddress?.email_address,
          name: `${createdUser.first_name} ${createdUser.last_name}`,
        },
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

      posthog.capture({
        distinctId: payload.data.id,
        event: 'User updated email',
        properties: {
          email: primaryEmailAddress?.email_address,
          name: `${updatedUser.first_name} ${updatedUser.last_name}`,
        },
      });

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

      posthog.capture({
        distinctId: payload.data.id as string,
        event: 'User deleted account',
        properties: {
          id: deletedUser.id,
        },
      });

      break;
    }
  }

  return NextResponse.json(null, { status: status.ACCEPTED });
}
