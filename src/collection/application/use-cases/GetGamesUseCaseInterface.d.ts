import type { Game } from "@Collection/domain/entities/Game";
import type { GameFilterCriteria } from "@Collection/domain/entities/GameFilterCriteria";
import type { Result } from "@Shared/domain/result/Result";
import type { ApplicationErrorInterface } from "../errors/ApplicationErrorInterface";

/**
 * Interface for GetGames use case
 *
 * Retrieves games from the collection, optionally filtered by criteria.
 * This use case is framework-agnostic and can be used from any UI layer.
 *
 * @example
 * ```typescript
 * // Get all games
 * const result = await getGamesUseCase.execute();
 * if (result.isOk()) {
 *   const games = result.unwrap();
 *   console.log(`${games.length} games in collection`);
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Get filtered games
 * const criteria = GameFilterCriteria.create({ title: 'Mario' }).unwrap();
 * const result = await getGamesUseCase.execute(criteria);
 * if (result.isOk()) {
 *   const games = result.unwrap();
 *   console.log(`Found ${games.length} games matching 'Mario'`);
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
   * @param criteria - Optional filter criteria. If omitted, returns all games
   * @returns Promise resolving to Result with array of Games on success, or ApplicationError on failure
   */
  execute(criteria?: GameFilterCriteria): Promise<Result<Game[], ApplicationErrorInterface>>;
}
