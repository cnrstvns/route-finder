import { currentUser } from '@clerk/nextjs';
import { db, user as userTable } from '@/db';
import { eq } from 'drizzle-orm';

export const isAdmin = async () => {
	const clerkUser = await currentUser();
	console.log(`[DEV] — CLERK USER - ${clerkUser?.id}`);
	if (!clerkUser) return false;

	const userResult = await db
		.select()
		.from(userTable)
		.where(eq(userTable.clerkId, clerkUser.id));
	const user = userResult[0];
	console.log(`[DEV] — LOCAL USER - ${user?.id}`);

	if (!user) return false;

	console.log(`[DEV] — ADMIN USER - ${user.admin}`);
	return user.admin as boolean;
};
