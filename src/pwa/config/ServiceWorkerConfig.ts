import type { ServiceWorkerConfigInterface } from '@Pwa/config/ServiceWorkerConfigInterface';

/**
 * Service Worker Configuration
 * Defines cache settings and assets to cache
 */
export class ServiceWorkerConfig implements ServiceWorkerConfigInterface {
  readonly cacheName = 'game-collection-v1';

  readonly cachePrefix = 'game-collection-';

  readonly assetsToCacheOnInstall = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon-192x192.png',
    '/icon-512x512.png',
    '/favicon.ico',
  ];
}
