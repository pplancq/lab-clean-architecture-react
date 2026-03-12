import { Result } from '@Shared/domain/result/Result';
import type { ToastRepositoryInterface } from '@Toast/domain/repositories/ToastRepositoryInterface';
import type { ToastApplicationErrorInterface } from '../errors/ToastApplicationErrorInterface';
import { ToastNotFoundError } from '../errors/ToastNotFoundError';
import { ToastValidationError } from '../errors/ToastValidationError';
import type { RemoveToastUseCaseInterface } from './RemoveToastUseCaseInterface';

/**
 * Use case for removing a toast notification.
 *
 * Responsibilities:
 * - Validate that the provided ID is non-empty
 * - Verify the toast exists in the repository
 * - Delete the toast from the repository
 *
 * @implements {RemoveToastUseCaseInterface}
 */
export class RemoveToastUseCase implements RemoveToastUseCaseInterface {
  constructor(private readonly repository: ToastRepositoryInterface) {}

  execute(id: string): Result<void, ToastApplicationErrorInterface> {
    if (!id || id.trim().length === 0) {
      return Result.err(new ToastValidationError('Toast ID cannot be empty', 'id'));
    }

    if (this.repository.findById(id).unwrap() === undefined) {
      return Result.err(new ToastNotFoundError(id));
    }

    this.repository.remove(id);

    return Result.ok(undefined);
  }
}
