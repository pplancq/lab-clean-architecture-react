import { Result } from '@Shared/domain/result/Result';
import type { IdGeneratorInterface } from '@Shared/domain/utils/IdGeneratorInterface';
import { Toast } from '@Toast/domain/entities/Toast';
import type { ToastRepositoryInterface } from '@Toast/domain/repositories/ToastRepositoryInterface';
import type { AddToastDTO } from '../dtos/AddToastDTO';
import type { ToastApplicationErrorInterface } from '../errors/ToastApplicationErrorInterface';
import { ToastValidationError } from '../errors/ToastValidationError';
import type { AddToastUseCaseInterface } from './AddToastUseCaseInterface';

/**
 * Use case for creating a new toast notification.
 *
 * Responsibilities:
 * - Generate a unique ID via the injected IdGeneratorInterface
 * - Validate and create the Toast entity
 * - Persist it via the repository
 *
 * @implements {AddToastUseCaseInterface}
 */
export class AddToastUseCase implements AddToastUseCaseInterface {
  constructor(
    private readonly repository: ToastRepositoryInterface,
    private readonly idGenerator: IdGeneratorInterface,
  ) {}

  execute(dto: AddToastDTO): Result<Toast, ToastApplicationErrorInterface> {
    const toastResult = Toast.create({
      id: this.idGenerator.generate(),
      message: dto.message,
      type: dto.type,
      duration: dto.duration,
    });

    if (toastResult.isErr()) {
      const error = toastResult.getError();

      return Result.err(new ToastValidationError(error.message, error.field));
    }

    const toast = toastResult.unwrap();
    this.repository.add(toast);

    return Result.ok(toast);
  }
}
