/**
 * Service Worker Configuration Interface
 */
export interface ServiceWorkerConfigInterface {
  cacheName: string;
  assetsToCacheOnInstall: string[];
  cachePrefix: string;
}
