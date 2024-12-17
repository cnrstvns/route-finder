'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMemo } from 'react';


export const Providers = ({ children }: { children: React.ReactNode }) => {
  const client = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 0,
            staleTime: 1000 * 60,
          },
          mutations: {
            onError: (err) => {
              console.error(String(err));
            },
          },
        },
      }),
    [],
  );

  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  );
};
