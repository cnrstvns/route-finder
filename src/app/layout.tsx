import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import './globals.css';
import { PostHog } from './posthog';

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
