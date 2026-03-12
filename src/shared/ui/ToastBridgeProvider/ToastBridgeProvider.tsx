import { useService } from '@Shared/ui/hooks/useService/useService';
import type { ToastStoreInterface } from '@Toast/application/stores/ToastStoreInterface';
import { TOAST_SERVICES } from '@Toast/serviceIdentifiers';
import { ToastProvider } from '@Toast/ui/providers/ToastProvider/ToastProvider';
import type { PropsWithChildren } from 'react';

type ToastBridgeProviderProps = PropsWithChildren;

export const ToastBridgeProvider = ({ children }: ToastBridgeProviderProps) => {
  const toastStore = useService<ToastStoreInterface>(TOAST_SERVICES.ToastStore);

  return <ToastProvider service={toastStore}>{children}</ToastProvider>;
};
