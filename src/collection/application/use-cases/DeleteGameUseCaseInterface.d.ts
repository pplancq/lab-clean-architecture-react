import type { Result } from '@Shared/domain/result/Result';
import type { ApplicationErrorInterface } from '../errors/ApplicationErrorInterface';

/**
 * Interface for DeleteGame use case
 *
 * Orchestrates the business logic for removing a game from the collection.
 */
export interface DeleteGameUseCaseInterface {
  /**
   * Executes the delete game use case
   *
   * @param id - The unique identifier of the game to delete
   * @returns Promise resolving to Result with void on success, or ApplicationError on failure
   */
  execute(id: string): Promise<Result<void, ApplicationErrorInterface>>;
}
