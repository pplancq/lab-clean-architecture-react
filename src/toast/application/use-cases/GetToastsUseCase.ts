import { Result } from '@Shared/domain/result/Result';
import type { Toast } from '@Toast/domain/entities/Toast';
import type { ToastRepositoryInterface } from '@Toast/domain/repositories/ToastRepositoryInterface';
import type { GetToastsUseCaseInterface } from './GetToastsUseCaseInterface';

/**
 * Use case for retrieving all active toast notifications.
 *
 * Delegates directly to the repository, which guarantees referential
 * stability of the returned array (only changes on add/remove).
 *
 * @implements {GetToastsUseCaseInterface}
 */
export class GetToastsUseCase implements GetToastsUseCaseInterface {
  constructor(private readonly repository: ToastRepositoryInterface) {}

  execute(): Result<Toast[], never> {
    return this.repository.getAll();
  }
}
