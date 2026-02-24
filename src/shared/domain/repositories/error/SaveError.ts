import { IndexedDBRequestError } from '@Shared/domain/repositories/error/IndexedDBRequestError';
import type { SaveErrorInterface } from '@Shared/domain/repositories/error/SaveErrorInterface';

/**
 * Error thrown when an IndexedDB save operation fails
 *
 * @example
 * ```typescript
 * request.onerror = () => { reject(new SaveError(request.error)); };
 * ```
 */
export class SaveError extends IndexedDBRequestError implements SaveErrorInterface {
  constructor(originalError: DOMException | null) {
    super('IndexedDB save request failed', originalError);
    this.name = 'SaveError';
  }
}
