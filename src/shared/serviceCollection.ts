import type { DateFormatterInterface } from '@Shared/domain/utils/DateFormatterInterface';
import { DateFormatter } from '@Shared/infrastructure/utils/DateFormatter';
import { ContainerModule } from 'inversify';
import { SHARED_SERVICES } from './serviceIdentifiers';

export const sharedServiceCollection: ContainerModule = new ContainerModule(options => {
  options
    .bind<DateFormatterInterface>(SHARED_SERVICES.DateFormatter)
    .toDynamicValue(() => new DateFormatter())
    .inSingletonScope();
});
