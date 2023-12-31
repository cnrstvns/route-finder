'use client';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { ReactNode } from 'react';

type PostHogProps = {
  children: ReactNode;
};

// Only load on the client and in production
if (typeof window !== 'undefined' && process.env.VERCEL_ENV === 'production') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    persistence: 'localStorage+cookie',
    autocapture: false,
  });
}

export function PostHog({ children }: PostHogProps) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
