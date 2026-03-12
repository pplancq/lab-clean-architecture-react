import type { ToastApplicationErrorInterface } from './ToastApplicationErrorInterface';

/**
 * Error raised when no toast with the given ID exists in the repository.
 */
export class ToastNotFoundError extends Error implements ToastApplicationErrorInterface {
  readonly type = 'NotFound' as const;

  constructor(readonly toastId: string) {
    super(`Toast with id "${toastId}" not found`);
    this.name = 'ToastNotFoundError';
  }
}
