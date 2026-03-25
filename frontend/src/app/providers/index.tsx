import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from '@entities/session';
import { ToastProvider } from '@shared/ui';
import { PropsWithChildren, useState } from 'react';

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false
          }
        }
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <SessionProvider>{children}</SessionProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
