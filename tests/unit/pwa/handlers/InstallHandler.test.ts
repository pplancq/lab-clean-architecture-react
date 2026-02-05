import type { ServiceWorkerConfigInterface } from '@Pwa/config/ServiceWorkerConfigInterface';
import { InstallHandler } from '@Pwa/handlers/InstallHandler';
import type { LoggerInterface } from '@Pwa/logger/LoggerInterface';
import { beforeEach, describe, expect, it, vi } from 'vitest';

declare let global: typeof globalThis;

const mockSelf = {
  skipWaiting: vi.fn().mockResolvedValue(undefined),
} as unknown as ServiceWorkerGlobalScope;

vi.stubGlobal('self', mockSelf);

describe('InstallHandler', () => {
  let installHandler: InstallHandler;
  let mockConfig: ServiceWorkerConfigInterface;
  let mockLogger: LoggerInterface;
  let mockCaches: CacheStorage;
  let mockCache: Cache;

  beforeEach(() => {
    mockConfig = {
      cacheName: 'gcm-cache-v1',
      cachePrefix: 'gcm-cache',
      assetsToCacheOnInstall: ['/index.html', '/app.js', '/styles.css'],
    };

    mockLogger = {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };

    mockCache = {
      addAll: vi.fn().mockResolvedValue(undefined),
      match: vi.fn(),
      add: vi.fn(),
      delete: vi.fn(),
      keys: vi.fn(),
      put: vi.fn(),
    } as unknown as Cache;

    mockCaches = {
      open: vi.fn().mockResolvedValue(mockCache),
      match: vi.fn(),
      delete: vi.fn(),
      keys: vi.fn(),
      has: vi.fn(),
    } as unknown as CacheStorage;

    Object.defineProperty(global, 'caches', {
      value: mockCaches,
      writable: true,
    });

    vi.mocked(mockSelf.skipWaiting).mockClear();

    installHandler = new InstallHandler(mockConfig, mockLogger);
  });

  describe('handle', () => {
    it('should cache app shell assets on install', async () => {
      let promiseToWait: Promise<unknown> | undefined;
      const mockEvent = {
        waitUntil: vi.fn((promise: Promise<unknown>) => {
          promiseToWait = promise;
        }),
      } as unknown as ExtendableEvent;

      installHandler.handle(mockEvent);

      await promiseToWait;

      expect(mockLogger.info).toHaveBeenCalledWith('Install event');
      expect(mockCaches.open).toHaveBeenCalledWith('gcm-cache-v1');
      expect(mockCache.addAll).toHaveBeenCalledWith(['/index.html', '/app.js', '/styles.css']);
      expect(mockLogger.info).toHaveBeenCalledWith('Caching app shell assets');
      expect(mockLogger.info).toHaveBeenCalledWith('App shell cached successfully');
      expect(mockSelf.skipWaiting).toHaveBeenCalled();
    });

    it('should log error when caching fails', async () => {
      const cacheError = new Error('Cache error');
      vi.mocked(mockCache.addAll).mockRejectedValue(cacheError);

      let promiseToWait: Promise<unknown> | undefined;
      const mockEvent = {
        waitUntil: vi.fn((promise: Promise<unknown>) => {
          promiseToWait = promise;
        }),
      } as unknown as ExtendableEvent;

      installHandler.handle(mockEvent);

      await promiseToWait?.catch(() => {});

      expect(mockLogger.error).toHaveBeenCalledWith('Failed to cache app shell:', cacheError);
    });
  });
});
