import type { RepositoryInterface } from '@Shared/domain/repositories/RepositoryInterface';
import type { Game } from '../entities/Game';

/**
 * Repository interface for Game entity persistence
 *
 * Defines the contract for storing and retrieving Game entities.
 * All operations return Results to enable explicit error handling.
 *
 * @example
 * ```typescript
 * const result = await gameRepository.save(game);
 * if (result.isOk()) {
 *   console.log('Game saved successfully');
 * } else {
 *   const error = result.getError();
 *   if (error.type === 'QuotaExceeded') {
 *     // Handle storage quota exceeded
 *   }
 * }
 * ```
 */
export interface GameRepositoryInterface extends RepositoryInterface<Game> {}
