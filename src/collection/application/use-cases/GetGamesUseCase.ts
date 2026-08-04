import type { Game } from "@Collection/domain/entities/Game";
import type { GameFilterCriteria } from "@Collection/domain/entities/GameFilterCriteria";
import type { GameRepositoryInterface } from "@Collection/domain/repositories/GameRepositoryInterface";
import { Result } from "@Shared/domain/result/Result";
import type { ApplicationErrorInterface } from "../errors/ApplicationErrorInterface";
import { RepositoryError } from "../errors/RepositoryError";
import type { GetGamesUseCaseInterface } from "./GetGamesUseCaseInterface";

/**
 * Use case for retrieving games from the collection
 *
 * This use case orchestrates the retrieval of games:
 * 1. Fetches games from the repository (all or filtered by criteria)
 * 2. Returns the list or a typed error
 *
 * The use case is framework-agnostic and has no React dependencies.
 *
 * @example
 * ```typescript
 * // Get all games
 * const getGamesUseCase = container.get<GetGamesUseCaseInterface>(COLLECTION_SERVICES.GetGamesUseCase);
 * const result = await getGamesUseCase.execute();
 * if (result.isOk()) {
 *   const games = result.unwrap();
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
 * }
 * ```
 */
export class GetGamesUseCase implements GetGamesUseCaseInterface {
  constructor(private readonly gameRepository: GameRepositoryInterface) {}

  /**
   * Executes the get games use case
   *
   * @param criteria - Optional filter criteria. If omitted or empty, returns all games
   * @returns Promise resolving to Result with array of Games on success, or ApplicationError on failure
   */
  async execute(criteria?: GameFilterCriteria): Promise<Result<Game[], ApplicationErrorInterface>> {
    const result =
      !criteria || criteria.isEmpty()
        ? await this.gameRepository.findAll()
        : await this.gameRepository.findByCriteria(criteria);

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
