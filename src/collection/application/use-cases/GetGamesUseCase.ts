import type { Game } from '@Collection/domain/entities/Game';
import type { GameRepositoryInterface } from '@Collection/domain/repositories/GameRepositoryInterface';
import { Result } from '@Shared/domain/result/Result';
import type { ApplicationErrorInterface } from '../errors/ApplicationErrorInterface';
import { RepositoryError } from '../errors/RepositoryError';
import type { GetGamesUseCaseInterface } from './GetGamesUseCaseInterface';

/**
 * Use case for retrieving all games from the collection
 *
 * This use case orchestrates the retrieval of all games:
 * 1. Fetches all games from the repository
 * 2. Returns the list or a typed error
 *
 * The use case is framework-agnostic and has no React dependencies.
 *
 * @example
 * ```typescript
 * const getGamesUseCase = container.get<GetGamesUseCaseInterface>(COLLECTION_SERVICES.GetGamesUseCase);
 * const result = await getGamesUseCase.execute();
 * if (result.isOk()) {
 *   const games = result.unwrap();
 * }
 * ```
 */
export class GetGamesUseCase implements GetGamesUseCaseInterface {
  constructor(private readonly gameRepository: GameRepositoryInterface) {}

  /**
   * Executes the get games use case
   *
   * @returns Promise resolving to Result with array of Games on success, or ApplicationError on failure
   */
  async execute(): Promise<Result<Game[], ApplicationErrorInterface>> {
    const result = await this.gameRepository.findAll();

    if (result.isErr()) {
      const repoError = result.getError();
      return Result.err(
        new RepositoryError(`Failed to retrieve games: ${repoError.message}`, {
          repositoryError: repoError,
        }),
      );
    }

    return Result.ok(result.unwrap());
  }
}
