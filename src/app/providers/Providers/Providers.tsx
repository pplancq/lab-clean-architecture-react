import { type ClientProviderProps, QueryClientProvider } from '@App/providers/QueryClientProvider/QueryClientProvider';
import { ServiceProvider, type ServiceProviderProps } from '@App/providers/ServiceProvider/ServiceProvider';
import type { PropsWithChildren } from 'react';

type ProvidersProps = ClientProviderProps & ServiceProviderProps;

export const Providers = ({ queryClient, container, children }: PropsWithChildren<ProvidersProps>) => (
  <ServiceProvider container={container}>
    <QueryClientProvider queryClient={queryClient}>{children}</QueryClientProvider>
  </ServiceProvider>
);
