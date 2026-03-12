import type { Result } from '@Shared/domain/result/Result';
import type { Toast } from '@Toast/domain/entities/Toast';

/**
 * Interface for the use case responsible for retrieving all active toasts.
 */
export interface GetToastsUseCaseInterface {
  execute(): Result<Toast[], never>;
}
