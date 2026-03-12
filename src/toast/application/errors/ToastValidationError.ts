import type { ToastApplicationErrorInterface } from './ToastApplicationErrorInterface';

/**
 * Validation error for the toast application layer.
 */
export class ToastValidationError extends Error implements ToastApplicationErrorInterface {
  readonly type = 'Validation' as const;

  constructor(
    message: string,
    readonly field: string,
  ) {
    super(message);
    this.name = 'ToastValidationError';
  }
}
