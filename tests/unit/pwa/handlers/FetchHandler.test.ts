import type { CacheStrategyInterface } from '@Pwa/cache/CacheStrategyInterface';
import { FetchHandler } from '@Pwa/handlers/FetchHandler';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FetchHandler', () => {
  let fetchHandler: FetchHandler;
  let mockCacheStrategy: CacheStrategyInterface;

  beforeEach(() => {
    mockCacheStrategy = {
      execute: vi.fn(),
    };

    fetchHandler = new FetchHandler(mockCacheStrategy);
  });

  describe('handle', () => {
    it('should delegate GET requests to cache strategy', () => {
      const mockRequest = new Request('https://example.com/test', { method: 'GET' });
      const mockResponse = new Response('cached data');

      vi.mocked(mockCacheStrategy.execute).mockResolvedValue(mockResponse);

      const mockEvent = {
        request: mockRequest,
        respondWith: vi.fn(),
      } as unknown as FetchEvent;

      fetchHandler.handle(mockEvent);

      expect(mockEvent.respondWith).toHaveBeenCalled();
      expect(mockCacheStrategy.execute).toHaveBeenCalledWith(mockRequest);
    });

    it('should ignore non-GET requests', () => {
      const mockRequest = new Request('https://example.com/api', { method: 'POST' });

      const mockEvent = {
        request: mockRequest,
        respondWith: vi.fn(),
      } as unknown as FetchEvent;

      fetchHandler.handle(mockEvent);

      expect(mockEvent.respondWith).not.toHaveBeenCalled();
      expect(mockCacheStrategy.execute).not.toHaveBeenCalled();
    });

    it('should ignore PUT requests', () => {
      const mockRequest = new Request('https://example.com/api', { method: 'PUT' });

      const mockEvent = {
        request: mockRequest,
        respondWith: vi.fn(),
      } as unknown as FetchEvent;

      fetchHandler.handle(mockEvent);

      expect(mockEvent.respondWith).not.toHaveBeenCalled();
      expect(mockCacheStrategy.execute).not.toHaveBeenCalled();
    });

    it('should ignore DELETE requests', () => {
      const mockRequest = new Request('https://example.com/api', { method: 'DELETE' });

      const mockEvent = {
        request: mockRequest,
        respondWith: vi.fn(),
      } as unknown as FetchEvent;

      fetchHandler.handle(mockEvent);

      expect(mockEvent.respondWith).not.toHaveBeenCalled();
      expect(mockCacheStrategy.execute).not.toHaveBeenCalled();
    });
  });
});
