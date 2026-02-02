import type { Container } from 'inversify';
import { type PropsWithChildren, useRef } from 'react';
import { ServiceContext } from './ServiceContext';

export type ServiceProviderProps = {
  container: Container;
};

export const ServiceProvider = ({ container, children }: PropsWithChildren<ServiceProviderProps>) => {
  const containerRef = useRef({ container });

  return <ServiceContext value={containerRef.current}>{children}</ServiceContext>;
};
