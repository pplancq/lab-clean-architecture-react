import type { IndexedDBRequestErrorInterface } from '@Shared/domain/repositories/error/IndexedDBRequestErrorInterface';

/**
 * Base error class for IndexedDB request and transaction failures
 *
 * Stores the original DOMException from the IDB event so callers can inspect
 * the underlying cause. Specific subclasses (SaveError, FindByIdError, etc.)
 * provide operation-specific messages.
 */
export class IndexedDBRequestError extends Error implements IndexedDBRequestErrorInterface {
  public readonly originalError: DOMException | null;

  /**
   * @param message - Human-readable description of the failure
   * @param originalError - The DOMException from the IDB request, or null when unavailable
   */
  constructor(message: string, originalError: DOMException | null) {
    super(message);
    this.name = 'IndexedDBRequestError';
    this.originalError = originalError;
  }
}
