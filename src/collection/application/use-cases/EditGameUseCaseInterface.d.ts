import type { Game } from '@Collection/domain/entities/Game';
import type { Result } from '@Shared/domain/result/Result';
import type { EditGameDTO } from '../dtos/EditGameDTO';
import type { ApplicationErrorInterface } from '../errors/ApplicationErrorInterface';

/**
 * Interface for EditGame use case
 *
 * Orchestrates the business logic for editing an existing game in the collection.
 * Only the fields provided in the DTO are updated; omitted fields are left unchanged.
 */
export interface EditGameUseCaseInterface {
  /**
   * Executes the edit game use case
   *
   * @param dto - Partial update DTO; only provided fields are applied
   * @returns Promise resolving to Result with the updated Game on success, or ApplicationError on failure
   */
  execute(dto: EditGameDTO): Promise<Result<Game, ApplicationErrorInterface>>;
}
