'use client';
import { useClerk } from '@clerk/nextjs';
import { useEffect } from 'react';

export default function Page() {
  const clerk = useClerk();

  useEffect(() => {
    clerk.handleRedirectCallback({ redirectUrl: '/home' });
  }, [clerk]);

  return <div className="h-screen w-screen bg-neutral-50 dark:bg-zinc-800" />;
}
