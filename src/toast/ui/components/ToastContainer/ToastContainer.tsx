import type { ToastInterface } from '@Toast/domain/entities/ToastInterface';
import { Toast } from '@Toast/ui/components/Toast/Toast';
import { useToastSelector } from '@Toast/ui/hooks/useToastSelector/useToastSelector';
import { memo } from 'react';

import defaultClasses from './ToastContainer.module.css';

const ToastMemo = memo(Toast);

/**
 * Container that renders all active toasts in a fixed overlay.
 *
 * Accessibility:
 * - `aria-live="polite"` announces new toasts to screen readers
 * - `aria-atomic="false"` allows individual toast announcements
 * - `aria-label="Notifications"` provides a descriptive region name
 *
 * The container is removed from the DOM entirely when there are no toasts.
 */
export const ToastContainer = () => {
  const toasts = useToastSelector(store => store.getAllToasts());

  if (toasts.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Notifications"
      aria-live="polite"
      aria-atomic="false"
      className={defaultClasses.toastContainer}
    >
      {toasts.map((toast: ToastInterface) => (
        <ToastMemo toast={toast} key={toast.getId()} />
      ))}
    </section>
  );
};
