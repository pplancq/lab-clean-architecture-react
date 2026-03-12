import type { NotificationServiceInterface } from '@Shared/domain/notifications/NotificationServiceInterface';
import type { ToastStoreInterface } from '@Toast/application/stores/ToastStoreInterface';

/**
 * Adapter that implements NotificationServiceInterface by delegating to the toast store.
 *
 * This is the coupling point between the shared notification port and the
 * toast bounded context. Instantiated by ToastServiceBridge with the live
 * ToastStore from React context.
 */
export class ToastNotificationService implements NotificationServiceInterface {
  constructor(private readonly toastStore: ToastStoreInterface) {}

  success(message: string): void {
    this.toastStore.addToast(message, 'success');
  }

  error(message: string): void {
    this.toastStore.addToast(message, 'error');
  }

  info(message: string): void {
    this.toastStore.addToast(message, 'info');
  }

  warning(message: string): void {
    this.toastStore.addToast(message, 'warning');
  }
}
