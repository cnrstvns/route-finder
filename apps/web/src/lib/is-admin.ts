import { retrieveSession } from '@/api/server/auth';
import { headers } from 'next/headers';

export const isAdmin = async () => {
  const session = await retrieveSession({
    cache: 'no-store',
    headers: headers(),
  });

  return session.data?.admin || false;
};
