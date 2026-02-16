import { IndexedDB } from '@Shared/infrastructure/persistence/IndexedDB';
import { ContainerModule } from 'inversify';
import { IndexedDBGameRepository } from './infrastructure/persistence/IndexedDBGameRepository';

export const serviceCollection: ContainerModule = new ContainerModule(options => {
  options
    .bind(IndexedDB)
    .toDynamicValue(() => new IndexedDB('GameCollectionDB', 1, 'games'))
    .inSingletonScope();

  options
    .bind(IndexedDBGameRepository)
    .toDynamicValue(service => new IndexedDBGameRepository(service.get(IndexedDB)))
    .inSingletonScope();
});
