import type { NotFoundErrorInterface } from '@Shared/domain/repositories/error/NotFoundErrorInterface';

/**
 * Error thrown when an entity is not found in the repository
 *
 * @example
 * ```typescript
 * const error = new NotFoundError('game-123');
 * // Error: Entity with id 'game-123' not found
 * ```
 */
export class NotFoundError extends Error implements NotFoundErrorInterface {
  public readonly entityId: string;

  public readonly metadata?: Record<string, unknown>;

  constructor(
    entityId: string,
    message: string = `Entity with id '${entityId}' not found`,
    metadata?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'NotFoundError';
    this.entityId = entityId;
    this.metadata = metadata;
  }
}
