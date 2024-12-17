'use client';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();

  const error = searchParams.get('error');

  if (error) {
    return <div>{error}</div>;
  }

  return <div className="h-screen w-screen bg-neutral-50 dark:bg-zinc-800" />;
}
