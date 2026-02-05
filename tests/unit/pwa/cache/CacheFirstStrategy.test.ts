import { CacheFirstStrategy } from '@Pwa/cache/CacheFirstStrategy';
import type { LoggerInterface } from '@Pwa/logger/LoggerInterface';
import { beforeEach, describe, expect, it, vi } from 'vitest';

declare let global: typeof globalThis;

describe('CacheFirstStrategy', () => {
  let cacheStrategy: CacheFirstStrategy;
  let mockLogger: LoggerInterface;
  let mockCaches: CacheStorage;

  beforeEach(() => {
    mockLogger = {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };

    mockCaches = {
      match: vi.fn(),
      open: vi.fn(),
      delete: vi.fn(),
      keys: vi.fn(),
      has: vi.fn(),
    };

    Object.defineProperty(global, 'caches', {
      value: mockCaches,
      writable: true,
    });

    cacheStrategy = new CacheFirstStrategy(mockLogger);
  });

  describe('execute', () => {
    it('should return cached response when available', async () => {
      const mockRequest = new Request('https://example.com/test');
      const mockResponse = new Response('cached data');

      vi.mocked(mockCaches.match).mockResolvedValue(mockResponse);

      const result = await cacheStrategy.execute(mockRequest);

      expect(result).toBe(mockResponse);
      expect(mockCaches.match).toHaveBeenCalledWith(mockRequest);
      expect(mockLogger.info).toHaveBeenCalledWith('Cache hit:', 'https://example.com/test');
    });

    it('should fetch from network when cache misses', async () => {
      const mockRequest = new Request('https://example.com/test');
      const mockResponse = new Response('network data');

      vi.mocked(mockCaches.match).mockResolvedValue(undefined);
      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      const result = await cacheStrategy.execute(mockRequest);

      expect(result).toBe(mockResponse);
      expect(mockCaches.match).toHaveBeenCalledWith(mockRequest);
      expect(mockLogger.info).toHaveBeenCalledWith('Cache miss, fetching:', 'https://example.com/test');
      expect(global.fetch).toHaveBeenCalledWith(mockRequest);
    });

    it('should log error and throw when fetch fails', async () => {
      const mockRequest = new Request('https://example.com/test');
      const fetchError = new Error('Network error');

      vi.mocked(global.caches.match).mockResolvedValue(undefined);
      global.fetch = vi.fn().mockRejectedValue(fetchError);

      await expect(cacheStrategy.execute(mockRequest)).rejects.toThrow('Network error');

      expect(mockLogger.error).toHaveBeenCalledWith('Fetch failed:', fetchError);
    });
  });
});
