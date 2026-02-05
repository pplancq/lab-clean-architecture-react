import { SERVICE_NAME } from '@Pwa/config/serviceContainer';
import type { HandlerInterface } from '@Pwa/handlers/HandlerInterface';
import type { LoggerInterface } from '@Pwa/logger/LoggerInterface';
import type { Container } from 'inversify';

declare const self: ServiceWorkerGlobalScope;

/**
 * Service Worker Controller
 * Static orchestrator that manages SW lifecycle events
 * Uses DI container to resolve handlers
 */
export class ServiceWorkerController {
  private static container: Container;

  /**
   * Initialize Service Worker with DI container
   * @param container - Configured DI container
   */
  static initialize(container: Container): void {
    this.container = container;
    const logger = container.get<LoggerInterface>(SERVICE_NAME.Logger);

    self.addEventListener('install', this.onInstall.bind(this));
    self.addEventListener('activate', this.onActivate.bind(this));
    self.addEventListener('fetch', this.onFetch.bind(this));
    self.addEventListener('message', this.onMessage.bind(this));

    logger.info('Service Worker initialized with DI container');
  }

  private static onInstall(event: ExtendableEvent): void {
    const handler = this.container.get<HandlerInterface>(SERVICE_NAME.InstallHandler);
    handler.handle(event);
  }

  private static onActivate(event: ExtendableEvent): void {
    const handler = this.container.get<HandlerInterface>(SERVICE_NAME.ActivateHandler);
    handler.handle(event);
  }

  private static onFetch(event: FetchEvent): void {
    const handler = this.container.get<HandlerInterface>(SERVICE_NAME.FetchHandler);
    handler.handle(event);
  }

  private static onMessage(event: ExtendableMessageEvent): void {
    const handler = this.container.get<HandlerInterface>(SERVICE_NAME.MessageHandler);
    handler.handle(event);
  }
}
