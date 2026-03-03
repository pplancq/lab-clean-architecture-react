/* eslint-disable class-methods-use-this */
import type { Game } from '@Collection/domain/entities/Game';
import type { GameRepositoryInterface } from '@Collection/domain/repositories/GameRepositoryInterface';
import type { RepositoryErrorInterface } from '@Shared/domain/repositories/error/RepositoryErrorInterface';
import { Result } from '@Shared/domain/result/Result';
import type { EditGameDTO } from '../dtos/EditGameDTO';
import type { ApplicationErrorInterface } from '../errors/ApplicationErrorInterface';
import { NotFoundError } from '../errors/NotFoundError';
import { RepositoryError } from '../errors/RepositoryError';
import { ValidationError } from '../errors/ValidationError';
import type { EditGameUseCaseInterface } from './EditGameUseCaseInterface';

/**
 * Use case for editing an existing game in the collection.
 *
 * Orchestration:
 * 1. Retrieves the game to verify it exists.
 * 2. Applies only the fields present in the DTO via the entity's update methods.
 * 3. Persists the updated entity via the repository.
 * 4. Returns the updated Game so callers (e.g. GamesStore) can update their state directly.
 */
export class EditGameUseCase implements EditGameUseCaseInterface {
  constructor(private readonly gameRepository: GameRepositoryInterface) {}

  async execute(dto: EditGameDTO): Promise<Result<Game, ApplicationErrorInterface>> {
    const findResult = await this.gameRepository.findById(dto.id);
    if (findResult.isErr()) {
      return this.mapFindError(findResult.getError());
    }

    const game = findResult.unwrap();
    const gameUpdated = this.applyUpdates(game, dto);
    if (gameUpdated.isErr()) {
      return gameUpdated;
    }

    const saveResult = await this.gameRepository.save(game);
    if (saveResult.isErr()) {
      return this.mapSaveError(saveResult.getError());
    }

    return Result.ok(game);
  }

  private applyUpdates(game: Game, dto: EditGameDTO): Result<Game, ApplicationErrorInterface> {
    if (dto.title !== undefined) {
      const result = game.updateTitle(dto.title);
      if (result.isErr()) {
        const domainError = result.getError();
        return Result.err(new ValidationError(domainError.message, domainError.field, { domainError }));
      }
    }

    if (dto.description !== undefined) {
      const result = game.updateDescription(dto.description);
      if (result.isErr()) {
        const domainError = result.getError();
        return Result.err(new ValidationError(domainError.message, domainError.field, { domainError }));
      }
    }

    if (dto.purchaseDate !== undefined) {
      game.updatePurchaseDate(dto.purchaseDate);
    }

    if (dto.status !== undefined) {
      const result = game.updateStatus(dto.status);
      if (result.isErr()) {
        const domainError = result.getError();
        return Result.err(new ValidationError(domainError.message, domainError.field, { domainError }));
      }
    }

    return Result.ok(game);
  }

  private mapFindError(repoError: RepositoryErrorInterface): Result<never, ApplicationErrorInterface> {
    if ('entityId' in repoError) {
      return Result.err(
        new NotFoundError(repoError.entityId as string, repoError.message, { repositoryError: repoError }),
      );
    }
    return Result.err(
      new RepositoryError(`Failed to retrieve game: ${repoError.message}`, { repositoryError: repoError }),
    );
  }

  private mapSaveError(repoError: RepositoryErrorInterface): Result<never, ApplicationErrorInterface> {
    return Result.err(new RepositoryError(`Failed to save game: ${repoError.message}`, { repositoryError: repoError }));
  }
}
