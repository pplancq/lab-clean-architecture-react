import type { UnknownErrorInterface } from '@Shared/domain/repositories/error/UnknownErrorInterface';

/**
 * Error thrown when an unknown/unexpected error occurs in the repository
 *
 * This error wraps other errors that don't fit into specific error categories.
 *
 * @example
 * ```typescript
 * try {
 *   // Some operation
 * } catch (err) {
 *   const error = new UnknownError(err as Error);
 *   console.log(error.originalError); // Access original error
 * }
 * ```
 */
export class UnknownError extends Error implements UnknownErrorInterface {
  public originalError?: Error;

  constructor(originalError: Error | string) {
    super(typeof originalError === 'string' ? originalError : originalError.message);
    this.name = 'UnknownError';

    if (typeof originalError !== 'string') {
      this.originalError = originalError;
    }
  }
}
