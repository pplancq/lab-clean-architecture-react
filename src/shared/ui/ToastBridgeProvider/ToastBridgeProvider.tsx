import { useService } from '@Shared/ui/hooks/useService/useService';
import type { ToastStoreInterface } from '@Toast/application/stores/ToastStoreInterface';
import { TOAST_SERVICES } from '@Toast/serviceIdentifiers';
import { ToastProvider } from '@Toast/ui/providers/ToastProvider/ToastProvider';
import type { PropsWithChildren } from 'react';

export const ToastBridgeProvider = ({ children }: PropsWithChildren) => {
  const toastStore = useService<ToastStoreInterface>(TOAST_SERVICES.ToastStore);

  return <ToastProvider service={toastStore}>{children}</ToastProvider>;
};
