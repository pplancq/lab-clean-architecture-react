import type { Game } from '@Collection/domain/entities/Game';
import type { AbstractObserverInterface } from '@Shared/application/stores/AbstractObserverInterface';

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
}
