import type { LoggerInterface } from '@Pwa/logger/LoggerInterface';
import type { CacheStrategyInterface } from './CacheStrategyInterface';

/**
 * Cache-First Strategy
 * Returns cached response if available, otherwise fetches from network
 * Best for: Static assets (app shell, CSS, JS, images)
 */
export class CacheFirstStrategy implements CacheStrategyInterface {
  constructor(private readonly logger: LoggerInterface) {}

  async execute(request: Request): Promise<Response> {
    // Try cache first
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      this.logger.info('Cache hit:', request.url);
      return cachedResponse;
    }

    // Cache miss - fetch from network
    this.logger.info('Cache miss, fetching:', request.url);

    try {
      return await fetch(request);
    } catch (error) {
      this.logger.error('Fetch failed:', error);
      throw error;
    }
  }
}
