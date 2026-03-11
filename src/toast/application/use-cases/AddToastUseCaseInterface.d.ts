import type { Result } from '@Shared/domain/result/Result';
import type { Toast } from '@Toast/domain/entities/Toast';
import type { AddToastDTO } from '../dtos/AddToastDTO';
import type { ToastApplicationErrorInterface } from '../errors/ToastApplicationErrorInterface';

/**
 * Interface for the use case responsible for creating a new toast.
 */
export interface AddToastUseCaseInterface {
  execute(dto: AddToastDTO): Result<Toast, ToastApplicationErrorInterface>;
}
