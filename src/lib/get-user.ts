import { db, user as userTable } from '@/db';
import { auth } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';

export const getUser = async (clerkId: string | null) => {
  if (!clerkId) return null;

  const userResult = await db
    .select()
    .from(userTable)
    .where(eq(userTable.clerkId, clerkId));
  const user = userResult[0];

  return user;
};

export const currentUser = async () => {
  const { userId } = auth();
  const user = await getUser(userId);
  if (!user) throw new Error('User not found');

  return user;
};
