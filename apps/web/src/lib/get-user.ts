import { auth } from '@clerk/nextjs';

export const getUser = async (clerkId: string | null) => {
  if (!clerkId) return null;

  return {
    id: clerkId,
    admin: true,
  };
};

export const currentUser = async () => {
  const { userId } = auth();
  const user = await getUser(userId);
  if (!user) throw new Error('User not found');

  return user;
};
