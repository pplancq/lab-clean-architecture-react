import { IndexedDBRequestError } from '@Shared/domain/repositories/error/IndexedDBRequestError';
import type { DeleteErrorInterface } from '@Shared/domain/repositories/error/DeleteErrorInterface';

/**
 * Error thrown when an IndexedDB delete operation fails
 *
 * @example
 * ```typescript
 * request.onerror = () => { reject(new DeleteError(request.error)); };
 * ```
 */
export class DeleteError extends IndexedDBRequestError implements DeleteErrorInterface {
  constructor(originalError: DOMException | null) {
    super('IndexedDB delete request failed', originalError);
    this.name = 'DeleteError';
  }
}
