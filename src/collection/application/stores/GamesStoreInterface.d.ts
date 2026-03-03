import type { Game } from '@Collection/domain/entities/Game';
import type { AbstractObserverInterface } from '@Shared/application/stores/AbstractObserverInterface';
import type { Result } from '@Shared/domain/result/Result';
import type { EditGameDTO } from '../dtos/EditGameDTO';
import type { ApplicationErrorInterface } from '../errors/ApplicationErrorInterface';

/**
 * Snapshot returned by getGamesList() — stable reference for useSyncExternalStore.
 * Games in the list may be lazy (partial data from GetGamesUseCase).
 *
 * hasError=true → fetch failed, error contains the message
 */
export interface GamesListState {
  games: Game[];
  isLoading: boolean;
  hasError: boolean;
  error: string | null;
}

/**
 * Snapshot returned by getGame(id) — per-entry metadata for loading and error state.
 *
 * isLazy: true  → partial data loaded from the list (GetGamesUseCase)
 * isLazy: false → full data loaded from detail (GetGameByIdUseCase)
 *
 * hasError=true, error=null   → game not found (404)
 * hasError=true, error=string → generic fetch error
 */
export interface GameMapEntryState {
  data: Game | null;
  isLazy: boolean;
  isLoading: boolean;
  hasError: boolean;
  error: string | null;
}

/**
 * Interface for the observable games store.
 *
 * The store is the single source of truth via gamesMap.
 * Fetch methods are private — reads auto-trigger fetches when data is absent or lazy.
 */
export interface GamesStoreInterface extends AbstractObserverInterface {
  /**
   * Returns the current snapshot of the games list state.
   * Auto-triggers fetchGames on first call if no data has been loaded yet.
   * The reference is stable between commits — safe to use with useSyncExternalStore.
   */
  getGamesList(): GamesListState;

  /**
   * Returns the map entry for the requested game.
   * Auto-triggers fetchGameById if the entry is absent or lazy (partial data from list).
   * The entry reference is stable as long as the entry has not changed.
   *
   * @param id - The unique identifier of the game to retrieve
   */
  getGame(id: string): GameMapEntryState;

  /**
   * Applies a partial update to an existing game.
   * Only fields present in the DTO are updated; omitted fields are left unchanged.
   *
   * Synchronously marks the entry as loading and notifies observers, then
   * delegates to EditGameUseCase. On success, updates the map entry with the
   * returned Game and rebuilds the list snapshot. On failure, restores the
   * previous entry and returns the error so callers can handle it imperatively.
   *
   * @param dto - Partial update DTO containing the game id and the fields to update
   * @returns Promise resolving to Result with the updated Game on success
   */
  editGame(dto: EditGameDTO): Promise<Result<Game, ApplicationErrorInterface>>;
}
