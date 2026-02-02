import type { Container } from 'inversify';
import { createContext } from 'react';

type ServiceContextProps = {
  container: Container;
};

export const ServiceContext = createContext<ServiceContextProps | null>(null);
