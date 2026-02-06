import { MessageHandler } from '@Pwa/handlers/MessageHandler';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockSelf = {
  skipWaiting: vi.fn().mockResolvedValue(undefined),
} as unknown as ServiceWorkerGlobalScope;

vi.stubGlobal('self', mockSelf);

describe('MessageHandler', () => {
  let messageHandler: MessageHandler;

  beforeEach(() => {
    vi.mocked(mockSelf.skipWaiting).mockClear();
    messageHandler = new MessageHandler();
  });

  describe('handle', () => {
    it('should call skipWaiting when SKIP_WAITING message received', () => {
      const mockEvent = {
        data: { type: 'SKIP_WAITING' },
      } as ExtendableMessageEvent;

      messageHandler.handle(mockEvent);

      expect(mockSelf.skipWaiting).toHaveBeenCalledWith();
    });

    it('should ignore messages without type', () => {
      const mockEvent = {
        data: { foo: 'bar' },
      } as ExtendableMessageEvent;

      messageHandler.handle(mockEvent);

      expect(mockSelf.skipWaiting).not.toHaveBeenCalled();
    });

    it('should ignore messages with different type', () => {
      const mockEvent = {
        data: { type: 'OTHER_MESSAGE' },
      } as ExtendableMessageEvent;

      messageHandler.handle(mockEvent);

      expect(mockSelf.skipWaiting).not.toHaveBeenCalled();
    });

    it('should ignore null data', () => {
      const mockEvent = {
        data: null,
      } as ExtendableMessageEvent;

      messageHandler.handle(mockEvent);

      expect(mockSelf.skipWaiting).not.toHaveBeenCalled();
    });

    it('should ignore undefined data', () => {
      const mockEvent = {
        data: undefined,
      } as ExtendableMessageEvent;

      messageHandler.handle(mockEvent);

      expect(mockSelf.skipWaiting).not.toHaveBeenCalled();
    });
  });
});
