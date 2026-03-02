import type { NotFoundErrorInterface } from './NotFoundErrorInterface';

/**
 * Not found error implementation for application layer
 */
export class NotFoundError extends Error implements NotFoundErrorInterface {
  readonly type = 'NotFound' as const;

  constructor(
    readonly entityId: string,
    message: string = `Game with id '${entityId}' not found`,
    readonly metadata?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'NotFoundError';
  }
}
