import { db, user as userTable } from '@/db';
import { currentUser } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';

export const isAdmin = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) return false;

  const userResult = await db
    .select()
    .from(userTable)
    .where(eq(userTable.clerkId, clerkUser.id));
  const user = userResult[0];

  if (!user) return false;

  return user.admin || false;
};
