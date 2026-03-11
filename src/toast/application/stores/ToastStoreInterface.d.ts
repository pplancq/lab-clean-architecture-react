import type { Toast } from '@Toast/domain/entities/Toast';
import type { ToastTypeValue } from '@Toast/domain/entities/ToastInterface';

/**
 * Interface for the observable toast store.
 *
 * The store orchestrates use cases and schedules auto-dismiss timers.
 * It extends useSyncExternalStore's subscription contract via AbstractObserver.
 */
export interface ToastStoreInterface {
  /**
   * Add a new toast notification.
   *
   * Internally generates a UUID, creates and persists a Toast entity,
   * schedules auto-removal, and notifies subscribers.
   */
  addToast(message: string, type: ToastTypeValue, duration?: number): void;

  /**
   * Remove a toast by its ID, cancelling its timer if still active.
   */
  removeToast(id: string): void;

  /**
   * Return a stable snapshot of all active toasts.
   *
   * The returned array reference only changes after add/remove,
   * guaranteed by the repository implementation.
   */
  getAllToasts(): Toast[];

  /**
   * Subscribe to store changes.
   *
   * Compatible with useSyncExternalStore.
   *
   * @returns An unsubscribe function
   */
  subscribe(callback: () => void): () => void;
}
