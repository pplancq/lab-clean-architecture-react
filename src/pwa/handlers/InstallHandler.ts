import type { ServiceWorkerConfigInterface } from '@Pwa/config/ServiceWorkerConfigInterface';
import type { HandlerInterface } from '@Pwa/handlers/HandlerInterface';
import type { LoggerInterface } from '@Pwa/logger/LoggerInterface';

declare const self: ServiceWorkerGlobalScope;

/**
 * Install Event Handler
 * Caches app shell assets on service worker installation
 */
export class InstallHandler implements HandlerInterface {
  constructor(
    private readonly config: ServiceWorkerConfigInterface,
    private readonly logger: LoggerInterface,
  ) {}

  handle(event: ExtendableEvent): void {
    this.logger.info('Install event');

    event.waitUntil(this.install());
  }

  private async install(): Promise<void> {
    const { cacheName, assetsToCacheOnInstall } = this.config;

    try {
      const cache = await caches.open(cacheName);
      this.logger.info('Caching app shell assets');

      await cache.addAll(assetsToCacheOnInstall);

      this.logger.info('App shell cached successfully');

      await self.skipWaiting();
    } catch (error) {
      this.logger.error('Failed to cache app shell:', error);
    }
  }
}
