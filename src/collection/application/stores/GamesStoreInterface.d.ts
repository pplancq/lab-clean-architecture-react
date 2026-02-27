import type { Game } from '@Collection/domain/entities/Game';
import type { AbstractObserverInterface } from '@Shared/application/stores/AbstractObserverInterface';

/**
 * Snapshot returned by getGamesList() — stable reference for useSyncExternalStore
 */
export interface GamesListState {
  games: Game[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Interface for the observable games store.
 *
 * Extends the observer pattern with domain-specific read (getGamesList)
 * and fetch (fetchGames) methods.
 */
export interface GamesStoreInterface extends AbstractObserverInterface {
  /**
   * Returns the current snapshot of the games list state.
   * The reference is stable between commits — safe to use with useSyncExternalStore.
   */
  getGamesList(): GamesListState;

  /**
   * Fetches all games from the use case and updates the store state.
   * No-op if a fetch is already in progress.
   */
  fetchGames(): Promise<void>;
}
