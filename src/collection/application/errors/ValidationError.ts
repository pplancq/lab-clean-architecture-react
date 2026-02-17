import type { ValidationErrorInterface } from './ValidationErrorInterface';

/**
 * Validation error implementation
 */
export class ValidationError extends Error implements ValidationErrorInterface {
  readonly type = 'Validation' as const;

  constructor(
    message: string,
    readonly field?: string,
    readonly metadata?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}
