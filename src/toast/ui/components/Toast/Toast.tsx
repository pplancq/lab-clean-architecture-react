import { Alert } from '@pplancq/shelter-ui-react';
import type { ToastInterface } from '@Toast/domain/entities/ToastInterface';
import { useToastService } from '@Toast/ui/hooks/useToastService/useToastService';

type ToastProps = {
  toast: ToastInterface;
};

/**
 * Renders a single toast notification using the Alert component.
 *
 * Receives the full Toast entity as a prop — since toast content is
 * immutable once created, no store lookup is needed inside this component.
 * Calls `removeToast` on close.
 */
export const Toast = ({ toast }: ToastProps) => {
  const toastService = useToastService();

  const onClose = () => {
    toastService.removeToast(toast.getId());
  };

  return <Alert variant={toast.getType()} title={toast.getMessage()} onClose={onClose} buttonLabel="Close" />;
};
