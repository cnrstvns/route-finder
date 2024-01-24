import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';

export default async function Layout({ children }: PropsWithChildren) {
  const clerkUser = await currentUser();

  if (clerkUser) {
    redirect('/home');
  }

  return children;
}
