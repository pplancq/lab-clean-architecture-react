import type { Game } from '@Collection/domain/entities/Game';
import type { GameRepositoryInterface } from '@Collection/domain/repositories/GameRepositoryInterface';
import { Result } from '@Shared/domain/result/Result';
import type { ApplicationErrorInterface } from '../errors/ApplicationErrorInterface';
import { NotFoundError } from '../errors/NotFoundError';
import { RepositoryError } from '../errors/RepositoryError';
import type { GetGameByIdUseCaseInterface } from './GetGameByIdUseCaseInterface';

/**
 * Use case for retrieving a single game by its identifier
 *
 * This use case orchestrates the retrieval of a specific game:
 * 1. Fetches the game from the repository using its id
 * 2. Maps not-found repository errors to NotFoundApplicationError
 * 3. Returns the game or a typed error
 *
 * @example
 * ```typescript
 * const result = await getGameByIdUseCase.execute('game-id-123');
 * if (result.isOk()) {
 *   const game = result.unwrap();
 * }
 * ```
 */
export class GetGameByIdUseCase implements GetGameByIdUseCaseInterface {
  constructor(private readonly gameRepository: GameRepositoryInterface) {}

  /**
   * Executes the get game by id use case
   *
   * @param id - The unique identifier of the game to retrieve
   * @returns Promise resolving to Result with Game on success, or ApplicationError on failure
   */
  async execute(id: string): Promise<Result<Game, ApplicationErrorInterface>> {
    const result = await this.gameRepository.findById(id);

    if (result.isErr()) {
      const repoError = result.getError();

      if ('entityId' in repoError) {
        return Result.err(
          new NotFoundError(repoError.entityId as string, repoError.message, { repositoryError: repoError }),
        );
      }

      return Result.err(
        new RepositoryError(`Failed to retrieve game: ${repoError.message}`, { repositoryError: repoError }),
      );
    }

    return Result.ok(result.unwrap());
  }
}
