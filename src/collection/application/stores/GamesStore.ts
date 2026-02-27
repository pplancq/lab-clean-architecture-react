import type { GetGamesUseCaseInterface } from '@Collection/application/use-cases/GetGamesUseCaseInterface';
import type { Game } from '@Collection/domain/entities/Game';
import { AbstractObserver } from '@Shared/application/stores/AbstractObserver';
import type { GamesListState, GamesStoreInterface } from './GamesStoreInterface';

/**
 * Observable store for the games collection.
 *
 * Owns its state as individual private attributes (Map + primitives).
 * The Map allows O(1) lookups for future fetchGameById(id).
 * A stable snapshot is rebuilt on each commit() and cached until the next change.
 *
 * Register as a singleton in the DI container so all components share state.
 */
export class GamesStore extends AbstractObserver implements GamesStoreInterface {
  private readonly gamesMap: Map<string, Game> = new Map();

  private isLoading: boolean = false;

  private error: string | null = null;

  private snapshot: GamesListState = { games: [], isLoading: false, error: null };

  constructor(private readonly getGamesUseCase: GetGamesUseCaseInterface) {
    super();
  }

  getGamesList(): GamesListState {
    return this.snapshot;
  }

  async fetchGames(): Promise<void> {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.gamesMap.clear();
    this.error = null;
    this.commit(false); // games array reference unchanged — only isLoading changed

    const result = await this.getGamesUseCase.execute();

    this.isLoading = false;
    if (result.isOk()) {
      result.unwrap().forEach(game => this.gamesMap.set(game.getId(), game));
      this.commit(true); // games changed — new array reference needed
    } else {
      this.error = 'Unable to load games. Please try again.';
      this.commit(false); // games still empty — keep stable reference
    }
  }

  /**
   * Rebuilds the snapshot and notifies observers.
   * Pass gamesChanged=true only when gamesMap was actually modified,
   * so that selectors on `games` skip re-renders for unrelated state changes.
   */
  private commit(gamesChanged: boolean): void {
    this.snapshot = {
      games: gamesChanged ? Array.from(this.gamesMap.values()) : this.snapshot.games,
      isLoading: this.isLoading,
      error: this.error,
    };
    this.notifyObservers();
  }
}
