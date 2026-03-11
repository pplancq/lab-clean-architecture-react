import type { ToastStoreInterface } from '@Toast/application/stores/ToastStoreInterface';
import { ToastContext } from '@Toast/ui/providers/ToastProvider/ToastContext';
import { useContext } from 'react';

/**
 * Returns the ToastStoreInterface from the nearest ToastProvider.
 *
 * @throws Error if called outside of a ToastProvider
 */
export const useToastService = (): ToastStoreInterface => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToastService must be used within a ToastProvider');
  }

  return context.toast;
};
