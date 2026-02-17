import type { RepositoryErrorInterface } from '@Shared/domain/repositories/error/RepositoryErrorInterface';

export interface UnknownErrorInterface extends RepositoryErrorInterface {
  originalError?: Error;
}
