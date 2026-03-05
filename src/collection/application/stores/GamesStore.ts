import type { DeleteGameUseCaseInterface } from '@Collection/application/use-cases/DeleteGameUseCaseInterface';
import type { EditGameUseCaseInterface } from '@Collection/application/use-cases/EditGameUseCaseInterface';
import type { GetGameByIdUseCaseInterface } from '@Collection/application/use-cases/GetGameByIdUseCaseInterface';
import type { GetGamesUseCaseInterface } from '@Collection/application/use-cases/GetGamesUseCaseInterface';
import type { Game } from '@Collection/domain/entities/Game';
import { AbstractObserver } from '@Shared/application/stores/AbstractObserver';
import type { Result } from '@Shared/domain/result/Result';
import type { EditGameDTO } from '../dtos/EditGameDTO';
import type { ApplicationErrorInterface } from '../errors/ApplicationErrorInterface';
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
    private readonly editGameUseCase: EditGameUseCaseInterface,
    private readonly deleteGameUseCase: DeleteGameUseCaseInterface,
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
      this.gamesMap.set(id, { ...this.DEFAULT_LOADING_ENTRY });
      queueMicrotask(() => {
        this.fetchGameById(id);
      });
      return this.gamesMap.get(id) as GameMapEntryState;
    }

    if (entry.isLazy && !entry.isLoading) {
      this.gamesMap.set(id, { ...entry, isLoading: true });
      queueMicrotask(() => {
        this.fetchGameById(id);
      });
      return this.gamesMap.get(id) as GameMapEntryState;
    }

    return entry;
  }

  /**
   * Applies a partial update to an existing game.
   * Workflow: mark loading → execute use case → update map on success / rollback on error.
   * The Result is returned for imperative handling by the caller (e.g. show an error banner).
   */
  async editGame(dto: EditGameDTO): Promise<Result<Game, ApplicationErrorInterface>> {
    const previous = this.gamesMap.get(dto.id);
    this.setEntry(dto.id, previous?.data ?? null, { isLoading: true, commit: false });

    const result = await this.editGameUseCase.execute(dto);

    if (result.isOk()) {
      this.applyEditSuccess(result.unwrap());
    } else {
      this.rollbackEdit(dto.id, previous);
    }

    return result;
  }

  /**
   * Removes a game from the collection.
   * Workflow: execute use case → remove from map on success; no state change on error.
   * The Result is returned for imperative handling by the caller (e.g. show an error banner).
   */
  async deleteGame(id: string): Promise<Result<void, ApplicationErrorInterface>> {
    const result = await this.deleteGameUseCase.execute(id);

    if (result.isOk()) {
      this.gamesMap.delete(id);
      this.commit(true);
    }

    return result;
  }

  private async fetchGames(): Promise<void> {
    const result = await this.getGamesUseCase.execute();

    this.listIsLoading = false;

    if (result.isOk()) {
      result.unwrap().forEach(game => {
        const existing = this.gamesMap.get(game.getId());
        if (!existing || existing.isLazy) {
          this.setEntry(game.getId(), game, { isLazy: true });
        }
      });
      this.commit(true);

      return;
    }

    this.listHasError = true;
    this.listError = 'Unable to load games. Please try again.';
    this.commit(false);
  }

  private async fetchGameById(id: string): Promise<void> {
    const result = await this.getGameByIdUseCase.execute(id);

    if (result.isOk()) {
      this.setEntry(id, result.unwrap(), { commit: false });

      return;
    }

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
    this.commit(false);
  }

  /** Commits a successful edit: updates the map entry and keeps the list cache warm. */
  private applyEditSuccess(game: Game): void {
    this.setEntry(game.getId(), game);
    this.commit(true);
  }

  /** Restores the previous map entry when an edit fails. */
  private rollbackEdit(id: string, previous: GameMapEntryState | undefined): void {
    this.gamesMap.set(id, previous ?? { data: null, isLazy: false, isLoading: false, hasError: false, error: null });
    this.commit(false);
  }

  /**
   * Writes a clean (no-error) entry to the map.
   * Pass commit=true/false to also notify observers; omit to batch multiple writes before a manual commit.
   */
  private setEntry(
    id: string,
    data: Game | null,
    { isLoading = false, isLazy = false, commit }: { isLoading?: boolean; isLazy?: boolean; commit?: boolean } = {},
  ): void {
    this.gamesMap.set(id, { data, isLazy, isLoading, hasError: false, error: null });
    if (commit !== undefined) {
      this.commit(commit);
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
