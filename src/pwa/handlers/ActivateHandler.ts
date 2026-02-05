import type { ServiceWorkerConfigInterface } from '@Pwa/config/ServiceWorkerConfigInterface';
import type { HandlerInterface } from '@Pwa/handlers/HandlerInterface';
import type { LoggerInterface } from '@Pwa/logger/LoggerInterface';

declare const self: ServiceWorkerGlobalScope;

/**
 * Activate Event Handler
 * Cleans up old caches and claims clients
 */
export class ActivateHandler implements HandlerInterface {
  constructor(
    private readonly config: ServiceWorkerConfigInterface,
    private readonly logger: LoggerInterface,
  ) {}

  handle(event: ExtendableEvent): void {
    this.logger.info('Activate event');

    event.waitUntil(this.activate());
  }

  private async activate(): Promise<void> {
    const { cacheName, cachePrefix } = this.config;

    try {
      const cacheNames = await caches.keys();

      const staleCacheNames = cacheNames.filter(name => {
        return name !== cacheName && name.startsWith(cachePrefix);
      });

      const deletions = staleCacheNames.map(name => {
        this.logger.info('Deleting old cache:', name);
        return caches.delete(name);
      });

      await Promise.all(deletions);

      this.logger.info('Activated successfully');
      await self.clients.claim();
    } catch (error) {
      this.logger.error('Failed during activation:', error);
    }
  }
}
