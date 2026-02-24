import { IndexedDBRequestError } from '@Shared/domain/repositories/error/IndexedDBRequestError';
import type { FindByIdErrorInterface } from '@Shared/domain/repositories/error/FindByIdErrorInterface';

/**
 * Error thrown when an IndexedDB findById operation fails
 *
 * @example
 * ```typescript
 * request.onerror = () => { reject(new FindByIdError(request.error)); };
 * ```
 */
export class FindByIdError extends IndexedDBRequestError implements FindByIdErrorInterface {
  constructor(originalError: DOMException | null) {
    super('IndexedDB findById request failed', originalError);
    this.name = 'FindByIdError';
  }
}
