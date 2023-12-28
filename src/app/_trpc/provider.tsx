'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { loggerLink, unstable_httpBatchStreamLink } from '@trpc/client';
import React, { useState } from 'react';
import { trpc } from './trpc';
import { getUrl } from './trpc';
import superjson from 'superjson';

type TrpcProviderProps = {
	children: React.ReactNode;
};

export default function TrpcProvider({ children }: TrpcProviderProps) {
	const [queryClient] = useState(() => new QueryClient({}));
	const [trpcClient] = useState(() =>
		trpc.createClient({
			transformer: superjson,
			links: [
				loggerLink({
					enabled: (op) =>
						process.env.NODE_ENV === 'development' ||
						(op.direction === 'down' && op.result instanceof Error),
				}),
				unstable_httpBatchStreamLink({
					url: getUrl(),
				}),
			],
		}),
	);
	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</trpc.Provider>
	);
}
