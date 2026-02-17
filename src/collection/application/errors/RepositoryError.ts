import type { RepositoryErrorInterface } from './RepositoryErrorInterface';

/**
 * Repository error wrapper implementation
 */
export class RepositoryError extends Error implements RepositoryErrorInterface {
  readonly type = 'Repository' as const;

  constructor(
    message: string,
    readonly metadata?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'RepositoryError';
  }
}
