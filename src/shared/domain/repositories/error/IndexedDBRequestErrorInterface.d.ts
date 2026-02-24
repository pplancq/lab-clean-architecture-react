import type { RepositoryErrorInterface } from '@Shared/domain/repositories/error/RepositoryErrorInterface';

export interface IndexedDBRequestErrorInterface extends RepositoryErrorInterface {
  originalError?: DOMException | null;
}
