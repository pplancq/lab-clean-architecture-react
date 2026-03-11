import type { Result } from '@Shared/domain/result/Result';
import type { Toast } from '../entities/Toast';

/**
 * Repository interface for Toast persistence.
 *
 * In the toast bounded context, the only implementation is in-memory
 * since toasts are transient notifications with no need for persistence.
 */
export interface ToastRepositoryInterface {
  /**
   * Persist a new toast.
   */
  add(toast: Toast): Result<void, never>;

  /**
   * Remove a toast by its ID.
   *
   * @returns ok(undefined) whether or not the ID existed
   */
  remove(id: string): Result<void, never>;

  /**
   * Find a toast by its ID.
   *
   * @returns ok(Toast) if found, ok(undefined) if no toast with that ID exists
   */
  findById(id: string): Result<Toast | undefined, never>;

  /**
   * Return a stable snapshot of all active toasts.
   *
   * The returned array reference only changes after an add or remove.
   * This guarantees referential stability for useSyncExternalStore.
   */
  getAll(): Result<Toast[], never>;
}
