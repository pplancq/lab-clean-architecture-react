/* eslint-disable class-methods-use-this */
import type { Game } from '@Collection/domain/entities/Game';
import type { GameRepositoryInterface } from '@Collection/domain/repositories/GameRepositoryInterface';
import type { GameDTO } from '@Collection/infrastructure/persistence/dtos/GameDTO';
import { NotFoundError } from '@Shared/domain/repositories/error/NotFoundError';
import { QuotaExceededError } from '@Shared/domain/repositories/error/QuotaExceededError';
import type { RepositoryErrorInterface } from '@Shared/domain/repositories/error/RepositoryErrorInterface';
import { UnknownError } from '@Shared/domain/repositories/error/UnknownError';
import { Result } from '@Shared/domain/result/Result';
import type { IndexedDBInterface } from '@Shared/infrastructure/persistence/IndexedDBInterface';
import { GameMapper } from './mappers/GameMapper';

/**
 * IndexedDB implementation of the Game repository
 *
 * Provides persistent storage for Game entities using the browser's IndexedDB API.
 * All operations handle errors gracefully using the Result pattern.
 *
 * @example
 * ```typescript
 * const service = new IndexedDB('GameCollectionDB', 1, 'games');
 * const repository = new IndexedDBGameRepository(service);
 *
 * const game = Game.create({ ... }).unwrap();
 * const result = await repository.save(game);
 * if (result.isOk()) {
 *   console.log('Game saved successfully');
 * }
 * ```
 */
export class IndexedDBGameRepository implements GameRepositoryInterface {
  constructor(private readonly dbService: IndexedDBInterface) {}

  /**
   * Saves a game to IndexedDB
   *
   * @param game - The game entity to save
   * @returns Result with void on success, or RepositoryError on failure
   */
  async save(game: Game): Promise<Result<void, RepositoryErrorInterface>> {
    try {
      const db = await this.dbService.getDatabase();
      const dto = GameMapper.toDTO(game);

      const transaction = db.transaction(this.dbService.getStoreName(), 'readwrite');
      const store = transaction.objectStore(this.dbService.getStoreName());
      const request = store.put(dto);

      return await new Promise<Result<void, RepositoryErrorInterface>>((resolve, reject) => {
        request.onsuccess = () => {
          resolve(Result.ok(undefined));
        };

        request.onerror = () => {
          reject(request.error);
        };

        transaction.onerror = () => {
          reject(transaction.error);
        };
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Finds a game by its ID
   *
   * @param id - The game ID to search for
   * @returns Result with Game if found, NotFoundError if not found, or other RepositoryError on failure
   */
  async findById(id: string): Promise<Result<Game, RepositoryErrorInterface>> {
    try {
      const db = await this.dbService.getDatabase();
      const transaction = db.transaction(this.dbService.getStoreName(), 'readonly');
      const store = transaction.objectStore(this.dbService.getStoreName());

      return await new Promise<Result<Game, RepositoryErrorInterface>>((resolve, reject) => {
        const request = store.get(id);

        request.onsuccess = () => {
          const rawDto = request.result as GameDTO | undefined;

          if (!rawDto) {
            resolve(Result.err(new NotFoundError(id)));
            return;
          }

          const gameResult = GameMapper.toDomain(rawDto);
          if (gameResult.isErr()) {
            reject(
              new Error(
                `Failed to map DTO to domain: ${gameResult.getError().field} - ${gameResult.getError().message}`,
              ),
            );
            return;
          }

          resolve(Result.ok(gameResult.unwrap()));
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Retrieves all games from IndexedDB
   *
   * @returns Result with array of Games (empty if none exist), or RepositoryError on failure
   */
  async findAll(): Promise<Result<Game[], RepositoryErrorInterface>> {
    try {
      const db = await this.dbService.getDatabase();
      const transaction = db.transaction(this.dbService.getStoreName(), 'readonly');
      const store = transaction.objectStore(this.dbService.getStoreName());

      return await new Promise<Result<Game[], RepositoryErrorInterface>>((resolve, reject) => {
        const request = store.getAll();

        request.onsuccess = () => {
          const dtos = request.result as GameDTO[];
          const games: Game[] = [];

          dtos.forEach(dto => {
            const gameResult = GameMapper.toDomain(dto);
            if (gameResult.isErr()) {
              reject(
                new Error(
                  `Failed to map DTO to domain: ${gameResult.getError().field} - ${gameResult.getError().message}`,
                ),
              );
              return;
            }
            games.push(gameResult.unwrap());
          });

          resolve(Result.ok(games));
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Deletes a game from IndexedDB
   *
   * This operation is idempotent - deleting a non-existent game succeeds.
   *
   * @param id - The game ID to delete
   * @returns Result with void on success, or RepositoryError on failure
   */
  async delete(id: string): Promise<Result<void, RepositoryErrorInterface>> {
    try {
      const db = await this.dbService.getDatabase();
      const transaction = db.transaction(this.dbService.getStoreName(), 'readwrite');
      const store = transaction.objectStore(this.dbService.getStoreName());
      const request = store.delete(id);

      return await new Promise<Result<void, RepositoryErrorInterface>>((resolve, reject) => {
        request.onsuccess = () => {
          resolve(Result.ok(undefined));
        };

        request.onerror = () => {
          reject(request.error);
        };

        transaction.onerror = () => {
          reject(transaction.error);
        };
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Handles errors and converts them to RepositoryError
   *
   * @param error - The error to handle
   * @returns Result with appropriate RepositoryError
   */
  private handleError<T>(error: unknown): Result<T, RepositoryErrorInterface> {
    // Check for quota exceeded error
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      return Result.err(new QuotaExceededError());
    }

    // Convert other errors to UnknownError
    if (error instanceof Error) {
      return Result.err(new UnknownError(error));
    }

    return Result.err(new UnknownError(String(error)));
  }
}
