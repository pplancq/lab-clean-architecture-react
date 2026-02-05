import { CacheFirstStrategy } from '@Pwa/cache/CacheFirstStrategy';
import type { CacheStrategyInterface } from '@Pwa/cache/CacheStrategyInterface';
import { ServiceWorkerConfig } from '@Pwa/config/ServiceWorkerConfig';
import type { ServiceWorkerConfigInterface } from '@Pwa/config/ServiceWorkerConfigInterface';
import { ActivateHandler } from '@Pwa/handlers/ActivateHandler';
import { FetchHandler } from '@Pwa/handlers/FetchHandler';
import type { HandlerInterface } from '@Pwa/handlers/HandlerInterface';
import { InstallHandler } from '@Pwa/handlers/InstallHandler';
import { MessageHandler } from '@Pwa/handlers/MessageHandler';
import { ConsoleLogger } from '@Pwa/logger/ConsoleLogger';
import type { LoggerInterface } from '@Pwa/logger/LoggerInterface';
import { Container } from 'inversify';

export const SERVICE_NAME = Object.freeze({
  Logger: Symbol.for('ConsoleLogger'),
  Config: Symbol.for('ServiceWorkerConfig'),
  CacheStrategy: Symbol.for('CacheFirstStrategy'),
  InstallHandler: Symbol.for('InstallHandler'),
  ActivateHandler: Symbol.for('ActivateHandler'),
  FetchHandler: Symbol.for('FetchHandler'),
  MessageHandler: Symbol.for('MessageHandler'),
});

export const serviceContainer = new Container();

serviceContainer
  .bind<LoggerInterface>(SERVICE_NAME.Logger)
  .toDynamicValue(() => new ConsoleLogger())
  .inSingletonScope();

serviceContainer
  .bind<ServiceWorkerConfigInterface>(SERVICE_NAME.Config)
  .toDynamicValue(() => new ServiceWorkerConfig());

serviceContainer
  .bind<CacheStrategyInterface>(SERVICE_NAME.CacheStrategy)
  .toDynamicValue(services => new CacheFirstStrategy(services.get<LoggerInterface>(SERVICE_NAME.Logger)));

serviceContainer
  .bind<HandlerInterface>(SERVICE_NAME.InstallHandler)
  .toDynamicValue(
    services =>
      new InstallHandler(
        services.get<ServiceWorkerConfigInterface>(SERVICE_NAME.Config),
        services.get<LoggerInterface>(SERVICE_NAME.Logger),
      ),
  );

serviceContainer
  .bind<HandlerInterface>(SERVICE_NAME.ActivateHandler)
  .toDynamicValue(
    services =>
      new ActivateHandler(
        services.get<ServiceWorkerConfigInterface>(SERVICE_NAME.Config),
        services.get<LoggerInterface>(SERVICE_NAME.Logger),
      ),
  );

serviceContainer
  .bind<HandlerInterface>(SERVICE_NAME.FetchHandler)
  .toDynamicValue(services => new FetchHandler(services.get<CacheStrategyInterface>(SERVICE_NAME.CacheStrategy)));

serviceContainer.bind<HandlerInterface>(SERVICE_NAME.MessageHandler).toDynamicValue(() => new MessageHandler());
