import { IndexedDBRequestError } from '@Shared/domain/repositories/error/IndexedDBRequestError';
import type { FindAllErrorInterface } from '@Shared/domain/repositories/error/FindAllErrorInterface';

/**
 * Error thrown when an IndexedDB findAll operation fails
 *
 * @example
 * ```typescript
 * request.onerror = () => { reject(new FindAllError(request.error)); };
 * ```
 */
export class FindAllError extends IndexedDBRequestError implements FindAllErrorInterface {
  constructor(originalError: DOMException | null) {
    super('IndexedDB findAll request failed', originalError);
    this.name = 'FindAllError';
  }
}
