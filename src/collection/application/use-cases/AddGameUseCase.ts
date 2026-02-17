import { Game } from '@Collection/domain/entities/Game';
import type { GameRepositoryInterface } from '@Collection/domain/repositories/GameRepositoryInterface';
import { Result } from '@Shared/domain/result/Result';
import type { AddGameDTO } from '../dtos/AddGameDTO';
import type { ApplicationErrorInterface } from '../errors/ApplicationErrorInterface';
import { RepositoryError } from '../errors/RepositoryError';
import { ValidationError } from '../errors/ValidationError';
import type { AddGameUseCaseInterface } from './AddGameUseCaseInterface';

/**
 * Use case for adding a game to the collection
 *
 * This use case orchestrates the business logic for adding a game:
 * 1. Creates a Game entity (domain-level validation via value objects)
 * 2. Persists the game via the repository
 *
 * The validation is handled entirely by the domain layer (value objects).
 * UI-level validation (required fields, basic formats) should be done in the presentation layer.
 *
 * The use case is framework-agnostic and has no React dependencies.
 *
 * @example
 * ```typescript
 * const addGameUseCase = container.get<AddGameUseCaseInterface>(COLLECTION_SERVICES.AddGameUseCase);
 * const dto = new AddGameDTO(...);
 * const result = await addGameUseCase.execute(dto);
 * ```
 */
export class AddGameUseCase implements AddGameUseCaseInterface {
  constructor(private readonly gameRepository: GameRepositoryInterface) {}

  /**
   * Executes the add game use case
   *
   * @param dto - Data transfer object containing game information
   * @returns Promise resolving to Result with void on success, or ApplicationError on failure
   */
  async execute(dto: AddGameDTO): Promise<Result<void, ApplicationErrorInterface>> {
    // Create Game entity (domain-level validation)
    const gameResult = Game.create({
      id: dto.id,
      title: dto.title,
      description: dto.description,
      platform: dto.platform,
      format: dto.format,
      purchaseDate: dto.purchaseDate,
      status: dto.status,
    });

    if (gameResult.isErr()) {
      const domainError = gameResult.getError();
      return Result.err(
        new ValidationError(domainError.message, domainError.field, {
          domainError,
        }),
      );
    }

    // Persist the game via repository
    const game = gameResult.unwrap();
    const saveResult = await this.gameRepository.save(game);

    if (saveResult.isErr()) {
      const repoError = saveResult.getError();
      return Result.err(
        new RepositoryError(`Failed to save game: ${repoError.message}`, {
          repositoryError: repoError,
        }),
      );
    }

    return Result.ok(undefined);
  }
}
