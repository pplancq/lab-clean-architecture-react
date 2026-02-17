import type { ApplicationErrorInterface } from './ApplicationErrorInterface';

/**
 * Repository error wrapper for application layer
 *
 * Wraps repository errors to provide application-level context
 */
export interface RepositoryErrorInterface extends ApplicationErrorInterface {
  readonly type: 'Repository';
}
