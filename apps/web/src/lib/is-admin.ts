import { retrieveSession } from '@/api/server/auth';
import { serverRequestOptions } from './api';

export const isAdmin = async () => {
  const session = await retrieveSession({
    ...serverRequestOptions,
    cache: 'no-store',
  });

  return session.data?.admin || false;
};
