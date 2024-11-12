import { cookies } from 'next/headers';

export const serverRequestOptions = {
  headers: {
    Authorization: `Bearer ${cookies().get('session_token')?.value}`,
  },
};
