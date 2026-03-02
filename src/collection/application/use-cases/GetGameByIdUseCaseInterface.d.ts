import type { Game } from '@Collection/domain/entities/Game';
import type { Result } from '@Shared/domain/result/Result';
import type { ApplicationErrorInterface } from '../errors/ApplicationErrorInterface';

/**
 * Interface for GetGameById use case
 *
 * Retrieves a single game by its identifier from the collection.
 *
 * @example
 * ```typescript
 * const result = await getGameByIdUseCase.execute('game-id-123');
 * if (result.isOk()) {
 *   const game = result.unwrap();
 * } else {
 *   const error = result.getError();
 *   if (error.type === 'NotFound') {
 *     // handle 404
 *   }
 * }
 * ```
 */
export interface GetGameByIdUseCaseInterface {
  /**
   * Executes the get game by id use case
   *
   * @param id - The unique identifier of the game to retrieve
   * @returns Promise resolving to Result with Game on success, or ApplicationError on failure
   */
  execute(id: string): Promise<Result<Game, ApplicationErrorInterface>>;
}
