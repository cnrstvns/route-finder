import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PostHog } from './posthog';
import { Toaster } from 'sonner';

export const viewport: Viewport = {
	themeColor: '#171717',
};

export const metadata: Metadata = {
	title: 'RouteFinder',
	applicationName:
		'RouteFinder — Find real-world routes to fly in your simulator',
	description: `We've curated over 15,000 real-world routes flown by dozens of airlines. Figuring out where to fly shouldn't be a chore. Get started today.`,
	keywords: ['simulator', 'x-plane', 'msfs', 'flight sim', 'flight simulator'],
	openGraph: {
		title: 'RouteFinder',
		siteName: 'RouteFinder',
		description: `We've curated over 15,000 real-world routes flown by dozens of airlines. Figuring out where to fly shouldn't be a chore. Get started today.`,
		url: 'https://routes.cnrstvns.dev',
		images: ['/og.png'],
	},
	metadataBase:
		process.env.NODE_ENV === 'production'
			? new URL('https://routes.cnrstvns.dev')
			: new URL('http://localhost:3000'),
};

type LayoutProps = {
	children: React.ReactNode;
};

export default function RootLayout({ children }: LayoutProps) {
	return (
		<ClerkProvider>
			<PostHog>
				<html lang="en">
					<body className="overscroll-none">
						{children}
						<Toaster />
					</body>
				</html>
			</PostHog>
		</ClerkProvider>
	);
}
