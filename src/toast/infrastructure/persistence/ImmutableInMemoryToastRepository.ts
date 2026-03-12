import { Result } from '@Shared/domain/result/Result';
import type { Toast } from '@Toast/domain/entities/Toast';
import type { ToastRepositoryInterface } from '@Toast/domain/repositories/ToastRepositoryInterface';

/**
 * In-memory repository for Toast entities.
 *
 * Guarantees referential stability of the snapshot returned by `getAll()`:
 * the same array reference is returned on consecutive calls unless `add` or
 * `remove` has been called in between. This makes it safe to use the result
 * directly as a useSyncExternalStore snapshot without a store-level cache.
 */
export class ImmutableInMemoryToastRepository implements ToastRepositoryInterface {
  private toasts: Array<Toast> = [];

  add(toast: Toast): Result<void, never> {
    this.toasts = [...this.toasts, toast];

    return Result.ok(undefined);
  }

  remove(id: string): Result<void, never> {
    if (this.toasts.some(toast => toast.getId() === id)) {
      this.toasts = this.toasts.filter(toast => toast.getId() !== id);
    }

    return Result.ok(undefined);
  }

  findById(id: string): Result<Toast | undefined, never> {
    return Result.ok(this.toasts.find(toast => toast.getId() === id));
  }

  getAll(): Result<Toast[], never> {
    return Result.ok(this.toasts);
  }
}
