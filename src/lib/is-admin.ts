import { currentUser } from '@clerk/nextjs';
import { db, user as userTable } from '@/db';
import { eq } from 'drizzle-orm';

export const isAdmin = async () => {
	const clerkUser = await currentUser();
	console.log(`[DEV] - Clerk user - ${clerkUser?.id}`);
	if (!clerkUser) return false;

	const userResult = await db
		.select()
		.from(userTable)
		.where(eq(userTable.clerkId, clerkUser.id));
	const user = userResult[0];
	console.log(`[DEV] - Local user - ${user?.id}`);

	if (!user) return false;

	console.log(`[DEV] - Admin user - ${user?.admin}`);
	return user.admin as boolean;
};
