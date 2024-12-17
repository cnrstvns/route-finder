'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { faDiscord } from '@fortawesome/free-brands-svg-icons/faDiscord';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons/faGoogle';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Page() {
  const router = useRouter();

  return (
    <div className="flex w-screen h-screen items-center justify-center bg-neutral-50 dark:bg-neutral-900">
      <Card className="p-5 w-full md:w-[350px] space-y-5 bg-white dark:bg-neutral-900">
        <div>
          <div className="text-xl font-medium">Welcome to RouteFinder</div>
          <div className="text-sm text-neutral-500 dark:text-zinc-400">
            Choose a sign-in method
          </div>
        </div>

        <div className="flex flex-col space-y-3 w-full">
          <Button
            size="md"
            variant="secondary"
            onClick={() => router.push('/auth/callback?provider=oauth_google')}
          >
            <FontAwesomeIcon icon={faGoogle} className="size-5 mr-2" />
            Continue with Google
          </Button>
          <Button
            size="md"
            variant="secondary"
            onClick={() => router.push('/auth/callback?provider=oauth_discord')}
          >
            <FontAwesomeIcon icon={faDiscord} className="size-6 mr-2" />
            Continue with Discord
          </Button>
        </div>

        {/* <div className="flex items-center justify-center before:content-[''] after:content-[''] before:flex-1 after:flex-1 before:border-b after:border-b before:mr-2 after:ml-2 before:border-neutral-400 dark:before:border-zinc-600 after:border-neutral-400 dark:after:border-zinc-600 text-neutral-400 dark:text-zinc-400">
          or
        </div> */}

        <div className="text-sm text-neutral-700 dark:text-zinc-400">
          Already have an account?{' '}
          <Link
            className="font-medium dark:text-zinc-200 hover:underline"
            href="/sign-in"
          >
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
}