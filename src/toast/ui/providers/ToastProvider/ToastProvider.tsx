import type { ToastStoreInterface } from '@Toast/application/stores/ToastStoreInterface';
import { ToastContainer } from '@Toast/ui/components/ToastContainer/ToastContainer';
import { ToastContext } from '@Toast/ui/providers/ToastProvider/ToastContext';
import { type PropsWithChildren, useRef } from 'react';

type ToastProviderProps = PropsWithChildren<{
  /**
   * Optional pre-configured store instance.
   *
   * When provided (e.g. via DI container or tests), the provider uses it as-is.
   * When omitted, the provider instantiates a default ToastStore internally.
   */
  service: ToastStoreInterface;
}>;

/**
 * Provides the toast store to the component tree and renders the ToastContainer.
 *
 * The store is created once via `useRef` to remain stable across renders.
 * Callers can inject a custom store via the optional `service` prop, enabling
 * both DI integration and test isolation without a mandatory DI dependency.
 */
export const ToastProvider = ({ children, service }: ToastProviderProps) => {
  const contextRef = useRef<{ toast: ToastStoreInterface }>({
    toast: service,
  });

  return (
    <ToastContext value={contextRef.current}>
      <ToastContainer />
      {children}
    </ToastContext>
  );
};
