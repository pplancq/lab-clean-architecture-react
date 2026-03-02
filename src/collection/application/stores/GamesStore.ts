import type { GetGameByIdUseCaseInterface } from '@Collection/application/use-cases/GetGameByIdUseCaseInterface';
import type { GetGamesUseCaseInterface } from '@Collection/application/use-cases/GetGamesUseCaseInterface';
import type { Game } from '@Collection/domain/entities/Game';
import { AbstractObserver } from '@Shared/application/stores/AbstractObserver';
import type { GameMapEntryState, GamesListState, GamesStoreInterface } from './GamesStoreInterface';

/**
 * Observable store for the games collection.
 *
 * gamesMap is the single source of truth. Each entry carries its own metadata
 * (isLazy, isLoading, hasError, error) so components need only subscribe
 * to getGamesList() or getGame(id) — no explicit fetch calls required.
 *
 * Fetch methods are private and triggered automatically via queueMicrotask so
 * they run after the current render cycle without blocking the snapshot getter.
 *
 * Register as a singleton in the DI container so all components share state.
 */
export class GamesStore extends AbstractObserver implements GamesStoreInterface {
  private readonly DEFAULT_LOADING_ENTRY: GameMapEntryState = {
    data: null,
    isLazy: false,
    isLoading: true,
    hasError: false,
    error: null,
  };

  private readonly gamesMap: Map<string, GameMapEntryState> = new Map();

  private hasFetchedList: boolean = false;

  private listIsLoading: boolean = false;

  private listHasError: boolean = false;

  private listError: string | null = null;

  private listSnapshot: GamesListState = { games: [], isLoading: false, hasError: false, error: null };

  constructor(
    private readonly getGamesUseCase: GetGamesUseCaseInterface,
    private readonly getGameByIdUseCase: GetGameByIdUseCaseInterface,
  ) {
    super();
  }

  /**
   * Returns the list snapshot. Auto-triggers fetchGames on the first call.
   * Setting listIsLoading synchronously prevents duplicate scheduling from concurrent calls.
   */
  getGamesList(): GamesListState {
    if (!this.hasFetchedList) {
      this.hasFetchedList = true;
      this.listIsLoading = true;
      this.listSnapshot = { games: [], isLoading: true, hasError: false, error: null };
      queueMicrotask(() => {
        this.fetchGames();
      });
    }
    return this.listSnapshot;
  }

  /**
   * Returns the map entry for the given id.
   * Creates a loading entry and schedules fetchGameById if absent.
   * Schedules an upgrade if the existing entry is lazy (partial data from list).
   * Setting isLoading synchronously prevents duplicate scheduling.
   */
  getGame(id: string): GameMapEntryState {
    const entry = this.gamesMap.get(id);

    if (!entry) {
      const loadingEntry: GameMapEntryState = { ...this.DEFAULT_LOADING_ENTRY };
      this.gamesMap.set(id, { ...this.DEFAULT_LOADING_ENTRY });
      queueMicrotask(() => {
        this.fetchGameById(id);
      });
      return loadingEntry;
    }

    if (entry.isLazy && !entry.isLoading) {
      const upgradingEntry: GameMapEntryState = { ...entry, isLoading: true };
      this.gamesMap.set(id, upgradingEntry);
      queueMicrotask(() => {
        this.fetchGameById(id);
      });
      return upgradingEntry;
    }

    return entry;
  }

  private async fetchGames(): Promise<void> {
    const result = await this.getGamesUseCase.execute();

    this.listIsLoading = false;

    if (result.isOk()) {
      result.unwrap().forEach(game => {
        const existing = this.gamesMap.get(game.getId());
        if (!existing || existing.isLazy) {
          this.gamesMap.set(game.getId(), {
            data: game,
            isLazy: true,
            isLoading: false,
            hasError: false,
            error: null,
          });
        }
      });
      this.commit(true);
    } else {
      this.listHasError = true;
      this.listError = 'Unable to load games. Please try again.';
      this.commit(false);
    }
  }

  private async fetchGameById(id: string): Promise<void> {
    const result = await this.getGameByIdUseCase.execute(id);

    if (result.isOk()) {
      const game = result.unwrap();
      this.gamesMap.set(game.getId(), {
        data: game,
        isLazy: false,
        isLoading: false,
        hasError: false,
        error: null,
      });
      this.commit(false);
    } else {
      const appError = result.getError();
      const errorMessage = appError.type === 'NotFound' ? null : 'Unable to load game. Please try again.';
      const existing = this.gamesMap.get(id);
      this.gamesMap.set(id, {
        data: existing?.data ?? null,
        isLazy: false,
        isLoading: false,
        hasError: true,
        error: errorMessage,
      });
      this.notifyObservers();
    }
  }

  /**
   * Rebuilds the list snapshot and notifies observers.
   * Pass gamesChanged=true only when gamesMap was actually modified so that
   * selectors on `games` skip re-renders for unrelated state changes.
   */
  private commit(gamesChanged: boolean): void {
    this.listSnapshot = {
      games: gamesChanged
        ? Array.from(this.gamesMap.values())
            .filter(e => e.data !== null && !e.hasError)
            .map(e => e.data as Game)
        : this.listSnapshot.games,
      isLoading: this.listIsLoading,
      hasError: this.listHasError,
      error: this.listError,
    };
    this.notifyObservers();
  }
}
