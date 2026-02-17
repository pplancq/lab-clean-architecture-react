import type { RepositoryErrorInterface } from '@Shared/domain/repositories/error/RepositoryErrorInterface';

export interface NotFoundErrorInterface extends RepositoryErrorInterface {
  entityId: string;
}
