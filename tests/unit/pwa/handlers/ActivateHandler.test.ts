import type { ServiceWorkerConfigInterface } from '@Pwa/config/ServiceWorkerConfigInterface';
import { ActivateHandler } from '@Pwa/handlers/ActivateHandler';
import type { LoggerInterface } from '@Pwa/logger/LoggerInterface';
import { beforeEach, describe, expect, it, vi } from 'vitest';

declare let global: typeof globalThis;

const mockSelf = {
  clients: {
    claim: vi.fn().mockResolvedValue(undefined),
  },
} as unknown as ServiceWorkerGlobalScope;

vi.stubGlobal('self', mockSelf);

describe('ActivateHandler', () => {
  let activateHandler: ActivateHandler;
  let mockConfig: ServiceWorkerConfigInterface;
  let mockLogger: LoggerInterface;
  let mockCaches: CacheStorage;

  beforeEach(() => {
    mockConfig = {
      cacheName: 'gcm-cache-v2',
      cachePrefix: 'gcm-cache',
      assetsToCacheOnInstall: [],
    };

    mockLogger = {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };

    mockCaches = {
      keys: vi.fn(),
      delete: vi.fn().mockResolvedValue(true),
      open: vi.fn(),
      match: vi.fn(),
      has: vi.fn(),
    };

    Object.defineProperty(global, 'caches', {
      value: mockCaches,
      writable: true,
    });

    vi.mocked(mockSelf.clients.claim).mockClear();

    activateHandler = new ActivateHandler(mockConfig, mockLogger);
  });

  describe('handle', () => {
    it('should delete old caches and claim clients', async () => {
      vi.mocked(mockCaches.keys).mockResolvedValue(['gcm-cache-v1', 'gcm-cache-v2', 'other-cache']);

      let promiseToWait: Promise<unknown> | undefined;
      const mockEvent = {
        waitUntil: vi.fn((promise: Promise<unknown>) => {
          promiseToWait = promise;
        }),
      } as unknown as ExtendableEvent;

      activateHandler.handle(mockEvent);

      await promiseToWait;

      expect(mockLogger.info).toHaveBeenCalledWith('Activate event');
      expect(mockCaches.keys).toHaveBeenCalled();
      expect(mockCaches.delete).toHaveBeenCalledWith('gcm-cache-v1');
      expect(mockCaches.delete).not.toHaveBeenCalledWith('gcm-cache-v2');
      expect(mockCaches.delete).not.toHaveBeenCalledWith('other-cache');
      expect(mockLogger.info).toHaveBeenCalledWith('Deleting old cache:', 'gcm-cache-v1');
      expect(mockLogger.info).toHaveBeenCalledWith('Activated successfully');
      expect(mockSelf.clients.claim).toHaveBeenCalled();
    });

    it('should not delete current cache', async () => {
      vi.mocked(mockCaches.keys).mockResolvedValue(['gcm-cache-v2']);

      let promiseToWait: Promise<unknown> | undefined;
      const mockEvent = {
        waitUntil: vi.fn((promise: Promise<unknown>) => {
          promiseToWait = promise;
        }),
      } as unknown as ExtendableEvent;

      activateHandler.handle(mockEvent);

      await promiseToWait;

      expect(mockCaches.delete).not.toHaveBeenCalled();
      expect(mockSelf.clients.claim).toHaveBeenCalled();
    });

    it('should not delete caches with different prefix', async () => {
      vi.mocked(mockCaches.keys).mockResolvedValue(['other-prefix-v1', 'gcm-cache-v1']);

      let promiseToWait: Promise<unknown> | undefined;
      const mockEvent = {
        waitUntil: vi.fn((promise: Promise<unknown>) => {
          promiseToWait = promise;
        }),
      } as unknown as ExtendableEvent;

      activateHandler.handle(mockEvent);

      await promiseToWait;

      expect(mockCaches.delete).toHaveBeenCalledWith('gcm-cache-v1');
      expect(mockCaches.delete).not.toHaveBeenCalledWith('other-prefix-v1');
    });
  });
});
