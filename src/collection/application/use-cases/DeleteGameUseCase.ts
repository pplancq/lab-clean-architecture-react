/* eslint-disable class-methods-use-this */
import type { GameRepositoryInterface } from '@Collection/domain/repositories/GameRepositoryInterface';
import type { RepositoryErrorInterface } from '@Shared/domain/repositories/error/RepositoryErrorInterface';
import { Result } from '@Shared/domain/result/Result';
import type { ApplicationErrorInterface } from '../errors/ApplicationErrorInterface';
import { NotFoundError } from '../errors/NotFoundError';
import { RepositoryError } from '../errors/RepositoryError';
import type { DeleteGameUseCaseInterface } from './DeleteGameUseCaseInterface';

/**
 * Use case for deleting a game from the collection.
 *
 * Orchestration:
 * 1. Delegates deletion to the repository.
 * 2. Maps repository errors to application errors.
 * 3. Returns void on success.
 */
export class DeleteGameUseCase implements DeleteGameUseCaseInterface {
  constructor(private readonly gameRepository: GameRepositoryInterface) {}

  async execute(id: string): Promise<Result<void, ApplicationErrorInterface>> {
    const result = await this.gameRepository.delete(id);

    if (result.isErr()) {
      return this.mapError(result.getError());
    }

    return Result.ok(undefined);
  }

  private mapError(error: RepositoryErrorInterface): Result<never, ApplicationErrorInterface> {
    if ('entityId' in error) {
      return Result.err(new NotFoundError(error.entityId as string, error.message, { repositoryError: error }));
    }
    return Result.err(new RepositoryError(`Failed to delete game: ${error.message}`, { repositoryError: error }));
  }
}
