import {
  type ClientProviderProps,
  QueryClientProvider,
} from '@Front/app/providers/QueryClientProvider/QueryClientProvider';
import type { PropsWithChildren } from 'react';

type ProvidersProps = ClientProviderProps;

export const Providers = ({ queryClient, children }: PropsWithChildren<ProvidersProps>) => (
  <QueryClientProvider queryClient={queryClient}>{children}</QueryClientProvider>
);
