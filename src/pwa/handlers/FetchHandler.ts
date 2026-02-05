import type { CacheStrategyInterface } from '@Pwa/cache/CacheStrategyInterface';
import type { HandlerInterface } from '@Pwa/handlers/HandlerInterface';

/**
 * Fetch Event Handler
 * Handles HTTP requests using configured cache strategy
 */
export class FetchHandler implements HandlerInterface {
  constructor(private readonly cacheStrategy: CacheStrategyInterface) {}

  handle(event: FetchEvent): void {
    // Only cache GET requests
    if (event.request.method !== 'GET') {
      return;
    }

    event.respondWith(this.cacheStrategy.execute(event.request));
  }
}
