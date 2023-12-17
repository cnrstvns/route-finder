import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { PostHog } from './posthog';
import './globals.css';

export const metadata: Metadata = {
	title: 'RouteFinder',
};

type LayoutProps = {
	children: React.ReactNode;
};

export default function RootLayout({ children }: LayoutProps) {
	return (
		<ClerkProvider>
			<PostHog>
				<html lang="en">
					<body className="overscroll-none">{children}</body>
				</html>
			</PostHog>
		</ClerkProvider>
	);
}
