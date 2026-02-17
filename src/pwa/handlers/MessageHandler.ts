/* eslint-disable class-methods-use-this */
import type { HandlerInterface } from '@Pwa/handlers/HandlerInterface';

declare const self: ServiceWorkerGlobalScope;

/**
 * Message Event Handler
 * Handles messages from app (e.g., SKIP_WAITING)
 */
export class MessageHandler implements HandlerInterface {
  handle(event: ExtendableMessageEvent): void {
    if (event.data && (event.data as { type?: string }).type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  }
}
