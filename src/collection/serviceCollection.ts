import { IndexedDB } from '@Shared/infrastructure/persistence/IndexedDB';
import type { IndexedDBInterface } from '@Shared/infrastructure/persistence/IndexedDBInterface';
import { ContainerModule } from 'inversify';
import type { GameRepositoryInterface } from './domain/repositories/GameRepositoryInterface';
import { IndexedDBGameRepository } from './infrastructure/persistence/IndexedDBGameRepository';
import { COLLECTION_SERVICES } from './serviceIdentifiers';

export const serviceCollection: ContainerModule = new ContainerModule(options => {
  // Bind IndexedDB implementation to interface
  options
    .bind<IndexedDBInterface>(COLLECTION_SERVICES.IndexedDB)
    .toDynamicValue(() => new IndexedDB('GameCollectionDB', 1, 'games'))
    .inSingletonScope();

  // Bind GameRepository implementation to interface
  options
    .bind<GameRepositoryInterface>(COLLECTION_SERVICES.GameRepository)
    .toDynamicValue(
      services => new IndexedDBGameRepository(services.get<IndexedDBInterface>(COLLECTION_SERVICES.IndexedDB)),
    )
    .inSingletonScope();
});
