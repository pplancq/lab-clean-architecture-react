import {
  type ClientProviderProps,
  QueryClientProvider,
} from '@Front/app/providers/QueryClientProvider/QueryClientProvider';
import { ServiceProvider, type ServiceProviderProps } from '@Front/app/providers/ServiceProvider/ServiceProvider';
import type { PropsWithChildren } from 'react';

type ProvidersProps = ClientProviderProps & ServiceProviderProps;

export const Providers = ({ queryClient, container, children }: PropsWithChildren<ProvidersProps>) => (
  <ServiceProvider container={container}>
    <QueryClientProvider queryClient={queryClient}>{children}</QueryClientProvider>
  </ServiceProvider>
);
