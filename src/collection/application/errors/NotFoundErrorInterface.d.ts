import type { ApplicationErrorInterface } from './ApplicationErrorInterface';

/**
 * Not found error interface for application layer
 *
 * Represents the case where a requested entity does not exist in the repository.
 * Used to distinguish 404-style errors from generic repository failures.
 */
export interface NotFoundErrorInterface extends ApplicationErrorInterface {
  readonly type: 'NotFound';

  /**
   * Identifier of the entity that was not found
   */
  readonly entityId: string;
}
