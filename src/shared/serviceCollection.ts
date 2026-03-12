import type { NotificationServiceInterface } from '@Shared/domain/notifications/NotificationServiceInterface';
import type { DateFormatterInterface } from '@Shared/domain/utils/DateFormatterInterface';
import type { IdGeneratorInterface } from '@Shared/domain/utils/IdGeneratorInterface';
import { ToastNotificationService } from '@Shared/infrastructure/notifications/ToastNotificationService';
import { CryptoIdGenerator } from '@Shared/infrastructure/utils/CryptoIdGenerator';
import { DateFormatter } from '@Shared/infrastructure/utils/DateFormatter';
import type { ToastStoreInterface } from '@Toast/application/stores/ToastStoreInterface';
import { TOAST_SERVICES } from '@Toast/serviceIdentifiers';
import { ContainerModule } from 'inversify';
import { SHARED_SERVICES } from './serviceIdentifiers';

export const sharedServiceCollection: ContainerModule = new ContainerModule(options => {
  options
    .bind<DateFormatterInterface>(SHARED_SERVICES.DateFormatter)
    .toDynamicValue(() => new DateFormatter())
    .inSingletonScope();

  options
    .bind<IdGeneratorInterface>(SHARED_SERVICES.IdGenerator)
    .toDynamicValue(() => new CryptoIdGenerator())
    .inSingletonScope();

  // ToastNotificationService delegates to the ToastStore singleton already bound via serviceToast.
  // serviceToast must be loaded before this module (see src/app/config/serviceContainer.ts).
  options
    .bind<NotificationServiceInterface>(SHARED_SERVICES.NotificationService)
    .toDynamicValue(
      services => new ToastNotificationService(services.get<ToastStoreInterface>(TOAST_SERVICES.ToastStore)),
    )
    .inSingletonScope();
});
