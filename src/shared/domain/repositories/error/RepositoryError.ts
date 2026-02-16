import type { RepositoryErrorInterface } from '@Shared/domain/repositories/error/RepositoryErrorInterface';

export class RepositoryError extends Error implements RepositoryErrorInterface {
  constructor(message: string) {
    super(message);
    this.name = 'RepositoryError';
  }
}
