import { ClerkProvider } from '@clerk/nextjs';
import '@fortawesome/fontawesome-svg-core/styles.css';
import type { Metadata, Viewport } from 'next';
import { Toaster } from 'sonner';
import './globals.css';
import { PostHog } from './posthog';
import { Providers } from './providers';

export const viewport: Viewport = {
  themeColor: '#4F46E5',
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
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <PostHog>
        <Providers>
          <html lang="en">
            <body className="overscroll-none">
              {children}
              <Toaster
                toastOptions={{
                  unstyled: true,
                  classNames: {
                    success:
                      'border dark:border-white/10 bg-white dark:bg-zinc-800 dark:text-white rounded space-x-3 text-sm p-3 flex items-center',
                  },
                }}
              />
            </body>
          </html>
        </Providers>
      </PostHog>
    </ClerkProvider>
  );
}
