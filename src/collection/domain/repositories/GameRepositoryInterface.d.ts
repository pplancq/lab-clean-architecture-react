import type { RepositoryErrorInterface } from '@Shared/domain/repositories/error/RepositoryErrorInterface';
import type { RepositoryInterface } from '@Shared/domain/repositories/RepositoryInterface';
import type { Result } from '@Shared/domain/result/Result';
import type { Game } from '../entities/Game';
import type { GameFilterCriteria } from '../entities/GameFilterCriteria';

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
export interface GameRepositoryInterface extends RepositoryInterface<Game> {
  /**
   * Finds games matching the provided criteria.
   * If criteria is empty, returns all games (equivalent to findAll).
   *
   * @param criteria - Filter criteria for the search
   * @returns Promise resolving to Result with array of matching Games on success, or RepositoryError on failure
   *
   * @example
   * ```typescript
   * const criteria = GameFilterCriteria.create('Mario').unwrap();
   * const result = await gameRepository.findByCriteria(criteria);
   * if (result.isOk()) {
   *   const games = result.unwrap();
   *   console.log('Found games:', games);
   * }
   * ```
   */
  findByCriteria(criteria: GameFilterCriteria): Promise<Result<Game[], RepositoryErrorInterface>>;
}
