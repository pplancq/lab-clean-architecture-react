import type { IdGeneratorInterface } from '@Shared/domain/utils/IdGeneratorInterface';
import { SHARED_SERVICES } from '@Shared/serviceIdentifiers';
import { ContainerModule } from 'inversify';
import { ToastStore } from './application/stores/ToastStore';
import type { ToastStoreInterface } from './application/stores/ToastStoreInterface';
import { AddToastUseCase } from './application/use-cases/AddToastUseCase';
import type { AddToastUseCaseInterface } from './application/use-cases/AddToastUseCaseInterface';
import { GetToastsUseCase } from './application/use-cases/GetToastsUseCase';
import type { GetToastsUseCaseInterface } from './application/use-cases/GetToastsUseCaseInterface';
import { RemoveToastUseCase } from './application/use-cases/RemoveToastUseCase';
import type { RemoveToastUseCaseInterface } from './application/use-cases/RemoveToastUseCaseInterface';
import type { ToastRepositoryInterface } from './domain/repositories/ToastRepositoryInterface';
import { ImmutableInMemoryToastRepository } from './infrastructure/persistence/ImmutableInMemoryToastRepository';
import { TOAST_SERVICES } from './serviceIdentifier';

export const serviceToast: ContainerModule = new ContainerModule(options => {
  // Bind repository — single source of truth for active toasts
  options
    .bind<ToastRepositoryInterface>(TOAST_SERVICES.ToastRepository)
    .toDynamicValue(() => new ImmutableInMemoryToastRepository())
    .inSingletonScope();

  // Bind AddToastUseCase implementation to interface
  options
    .bind<AddToastUseCaseInterface>(TOAST_SERVICES.AddToastUseCase)
    .toDynamicValue(
      services =>
        new AddToastUseCase(
          services.get<ToastRepositoryInterface>(TOAST_SERVICES.ToastRepository),
          services.get<IdGeneratorInterface>(SHARED_SERVICES.IdGenerator),
        ),
    )
    .inSingletonScope();

  // Bind RemoveToastUseCase implementation to interface
  options
    .bind<RemoveToastUseCaseInterface>(TOAST_SERVICES.RemoveToastUseCase)
    .toDynamicValue(
      services => new RemoveToastUseCase(services.get<ToastRepositoryInterface>(TOAST_SERVICES.ToastRepository)),
    )
    .inSingletonScope();

  // Bind GetToastsUseCase implementation to interface
  options
    .bind<GetToastsUseCaseInterface>(TOAST_SERVICES.GetToastsUseCase)
    .toDynamicValue(
      services => new GetToastsUseCase(services.get<ToastRepositoryInterface>(TOAST_SERVICES.ToastRepository)),
    )
    .inSingletonScope();

  // Bind ToastStore as singleton — shared notification state across the app
  options
    .bind<ToastStoreInterface>(TOAST_SERVICES.ToastStore)
    .toDynamicValue(
      services =>
        new ToastStore(
          services.get<AddToastUseCaseInterface>(TOAST_SERVICES.AddToastUseCase),
          services.get<RemoveToastUseCaseInterface>(TOAST_SERVICES.RemoveToastUseCase),
          services.get<GetToastsUseCaseInterface>(TOAST_SERVICES.GetToastsUseCase),
        ),
    )
    .inSingletonScope();
});
