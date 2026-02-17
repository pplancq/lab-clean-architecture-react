import type { Result } from '@Shared/domain/result/Result';
import type { AddGameDTO } from '../dtos/AddGameDTO';
import type { ApplicationErrorInterface } from '../errors/ApplicationErrorInterface';

/**
 * Interface for AddGame use case
 *
 * Orchestrates the business logic for adding a game to the collection.
 * This use case is framework-agnostic and can be used from any UI layer.
 *
 * @example
 * ```typescript
 * const dto = new AddGameDTO(
 *   'game-123',
 *   'The Legend of Zelda',
 *   'Classic adventure game',
 *   'Nintendo Switch',
 *   'Physical',
 *   new Date(),
 *   'Owned'
 * );
 *
 * const result = await addGameUseCase.execute(dto);
 * if (result.isOk()) {
 *   console.log('Game added successfully');
 * } else {
 *   const error = result.getError();
 *   if (error.type === 'Validation') {
 *     console.log('Validation error:', error.message);
 *   }
 * }
 * ```
 */
export interface AddGameUseCaseInterface {
  /**
   * Executes the add game use case
   *
   * @param dto - Data transfer object containing game information
   * @returns Promise resolving to Result with void on success, or ApplicationError on failure
   */
  execute(dto: AddGameDTO): Promise<Result<void, ApplicationErrorInterface>>;
}
