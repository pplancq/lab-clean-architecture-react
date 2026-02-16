import type { QuotaExceededErrorInterface } from '@Shared/domain/repositories/error/QuotaExceededErrorInterface';

/**
 * Error thrown when storage quota is exceeded
 *
 * This error occurs when IndexedDB or other storage mechanisms
 * reach their storage limit.
 *
 * @example
 * ```typescript
 * const error = new QuotaExceededError();
 * // Error: Storage quota exceeded
 * ```
 */
export class QuotaExceededError extends Error implements QuotaExceededErrorInterface {
  constructor(message: string = 'Storage quota exceeded') {
    super(message);
    this.name = 'QuotaExceededError';
  }
}
