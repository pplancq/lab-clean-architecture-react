import type { Game } from '@Collection/domain/entities/Game';
import type { Result } from '@Shared/domain/result/Result';
import type { ApplicationErrorInterface } from '../errors/ApplicationErrorInterface';

/**
 * Interface for GetGames use case
 *
 * Retrieves all games from the collection.
 * This use case is framework-agnostic and can be used from any UI layer.
 *
 * @example
 * ```typescript
 * const result = await getGamesUseCase.execute();
 * if (result.isOk()) {
 *   const games = result.unwrap();
 *   console.log(`${games.length} games in collection`);
 * } else {
 *   const error = result.getError();
 *   console.error('Repository error:', error.message);
 * }
 * ```
 */
export interface GetGamesUseCaseInterface {
  /**
   * Executes the get games use case
   *
   * @returns Promise resolving to Result with array of Games on success, or ApplicationError on failure
   */
  execute(): Promise<Result<Game[], ApplicationErrorInterface>>;
}
