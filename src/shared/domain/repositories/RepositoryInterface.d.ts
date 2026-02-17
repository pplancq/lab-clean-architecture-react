import type { RepositoryErrorInterface } from '@Shared/domain/repositories/error/RepositoryErrorInterface';
import type { Result } from '@Shared/domain/result/Result';

/**
 * RepositoryInterface defines the contract for a generic repository that manages entities of type T.
 *
 * This interface provides methods for saving, retrieving, and deleting entities, with all operations returning Results to enable explicit error handling.
 * Implementations of this interface can be used for various types of entities, allowing for flexible and reusable data management across the application.
 *
 * @template T - The type of entity managed by the repository
 */
export interface RepositoryInterface<T> {
  /**
   * Saves an entity to the repository. If an entity with the same ID already exists, it will be updated.
   *
   * @param entity
   * @returns Promise resolving to Result with void on success, or RepositoryError on failure
   *
   * @example
   * ```typescript
   * const entity = Entity.create({ id: 'entity-123', ... }).unwrap();
   * const result = await repository.save(entity);
   * if (result.isOk()) {
   *   console.log('Entity saved successfully');
   * } else {
   *   const error = result.getError();
   *   if (error.type === 'QuotaExceeded') {
   *     // Handle storage quota exceeded
   *   }
   * }
   * ```
   */
  save(entity: T): Promise<Result<void, RepositoryErrorInterface>>;

  /**
   * Finds an entity by its unique identifier.
   *
   * @param id - The unique identifier of the entity
   * @returns Promise resolving to Result with the entity on success, NotFoundError if not found, or other RepositoryError on failure
   *
   * @example
   * ```typescript
   * const result = await repository.findById('entity-123');
   * if (result.isOk()) {
   *   const entity = result.getValue();
   *   console.log('Entity found:', entity);
   * } else {
   *   const error = result.getError();
   *   if (error.type === 'NotFound') {
   *     console.log('Entity not found');
   *   } else {
   *     // Handle other errors
   *   }
   * }
   * ```
   */
  findById(id: string): Promise<Result<T, RepositoryErrorInterface>>;

  /**
   * Retrieves all entities from the repository.
   *
   * @returns Promise resolving to Result with an array of entities on success, or RepositoryError on failure
   *
   * @example
   * ```typescript
   * const result = await repository.findAll();
   * if (result.isOk()) {
   *   const entities = result.getValue();
   *   console.log('All entities:', entities);
   * } else {
   *   const error = result.getError();
   *   // Handle error
   * }
   * ```
   */
  findAll(): Promise<Result<T[], RepositoryErrorInterface>>;

  /**
   * Deletes an entity by its unique identifier.
   *
   * @param id - The unique identifier of the entity to delete
   * @returns Promise resolving to Result with void on success, NotFoundError if not found, or other RepositoryError on failure
   *
   * @example
   * ```typescript
   * const result = await repository.deleteById('entity-123');
   * if (result.isOk()) {
   *   console.log('Entity deleted successfully');
   * } else {
   *   const error = result.getError();
   *   if (error.type === 'NotFound') {
   *     console.log('Entity not found for deletion');
   *   } else {
   *     // Handle other errors
   *   }
   * }
   * ```
   */
  delete(id: string): Promise<Result<void, RepositoryErrorInterface>>;
}
