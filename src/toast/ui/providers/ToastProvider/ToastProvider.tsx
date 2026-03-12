import type { ToastStoreInterface } from '@Toast/application/stores/ToastStoreInterface';
import { ToastContainer } from '@Toast/ui/components/ToastContainer/ToastContainer';
import { ToastContext } from '@Toast/ui/providers/ToastProvider/ToastContext';
import { type PropsWithChildren, useRef } from 'react';

type ToastProviderProps = PropsWithChildren<{
  /**
   * Pre-configured store instance to inject into the context.
   *
   * Must be provided by the caller (typically via DI container or tests).
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
