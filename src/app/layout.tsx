import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
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
			<html lang="en">
				<body>{children}</body>
			</html>
		</ClerkProvider>
	);
}
