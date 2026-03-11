import type { Result } from '@Shared/domain/result/Result';
import type { ToastApplicationErrorInterface } from '../errors/ToastApplicationErrorInterface';

/**
 * Interface for the use case responsible for removing a toast.
 */
export interface RemoveToastUseCaseInterface {
  execute(id: string): Result<void, ToastApplicationErrorInterface>;
}
