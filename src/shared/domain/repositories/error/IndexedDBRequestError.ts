import type { IndexedDBRequestErrorInterface } from '@Shared/domain/repositories/error/IndexedDBRequestErrorInterface';

/**
 * Error thrown when an IndexedDB request or transaction fails
 *
 * Wraps the original DOMException from the IDB request, providing a consistent
 * Error instance for rejection handling.
 *
 * @example
 * ```typescript
 * request.onerror = () => {
 *   reject(new IndexedDBRequestError('IndexedDB save request failed', request.error));
 * };
 * ```
 */
export class IndexedDBRequestError extends Error implements IndexedDBRequestErrorInterface {
  public readonly originalError: DOMException | null;

  /**
   * @param message - Fallback message used when originalError is null
   * @param originalError - The DOMException from the IDB request, or null when unavailable
   */
  constructor(message: string, originalError: DOMException | null) {
    super(originalError?.message ?? message);
    this.name = 'IndexedDBRequestError';
    this.originalError = originalError;
  }
}
