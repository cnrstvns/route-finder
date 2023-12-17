'use client';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { ReactNode } from 'react';

type PostHogProps = {
	children: ReactNode;
};

if (typeof window !== 'undefined') {
	posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
		api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
		persistence: 'localStorage+cookie',
		autocapture: false,
	});
}

export function PostHog({ children }: PostHogProps) {
	return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
