import type { AddGameUseCaseInterface } from '@Collection/application/use-cases/AddGameUseCaseInterface';
import type { DeleteGameUseCaseInterface } from '@Collection/application/use-cases/DeleteGameUseCaseInterface';
import type { EditGameUseCaseInterface } from '@Collection/application/use-cases/EditGameUseCaseInterface';
import type { GetGameByIdUseCaseInterface } from '@Collection/application/use-cases/GetGameByIdUseCaseInterface';
import type { GetGamesUseCaseInterface } from '@Collection/application/use-cases/GetGamesUseCaseInterface';
import type { Game } from '@Collection/domain/entities/Game';
import { AbstractObserver } from '@Shared/application/stores/AbstractObserver';
import type { NotificationServiceInterface } from '@Shared/domain/notifications/NotificationServiceInterface';
import type { Result } from '@Shared/domain/result/Result';
import type { AddGameDTO } from '../dtos/AddGameDTO';
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
  private static readonly ADD_SUCCESS_MESSAGE = 'Game added successfully';

  private static readonly EDIT_SUCCESS_MESSAGE = 'Game updated successfully';

  private static readonly DELETE_SUCCESS_MESSAGE = 'Game deleted successfully';

  private static readonly OPERATION_ERROR_MESSAGES: Record<string, string> = {
    Repository: 'An error occurred while saving the game. Please try again.',
    Validation: 'Please check your input and try again.',
    NotFound: 'Game not found. It may have been deleted.',
  };

  private static readonly DEFAULT_OPERATION_ERROR_MESSAGE = 'An unexpected error occurred. Please try again.';

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

  /**
   * Object Calisthenics allows a maximum of 2 instance variables, but this
   * constructor intentionally exceeds that limit. Grouping the 5 use cases
   * behind a facade would add an indirection layer without real benefit at
   * this scale. Should the number of dependencies grow further, introducing
   * a GameUseCasesFacade would then be the right refactoring step.
   */
  constructor(
    private readonly addGameUseCase: AddGameUseCaseInterface,
    private readonly getGamesUseCase: GetGamesUseCaseInterface,
    private readonly getGameByIdUseCase: GetGameByIdUseCaseInterface,
    private readonly editGameUseCase: EditGameUseCaseInterface,
    private readonly deleteGameUseCase: DeleteGameUseCaseInterface,
    private readonly notificationService: NotificationServiceInterface,
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
   * Sends a success or error notification via NotificationService.
   */
  async editGame(dto: EditGameDTO): Promise<Result<Game, ApplicationErrorInterface>> {
    const previous = this.gamesMap.get(dto.id);
    this.setEntry(dto.id, previous?.data ?? null, { isLoading: true, commit: false });

    const result = await this.editGameUseCase.execute(dto);

    if (result.isOk()) {
      const game = result.unwrap();
      this.setEntry(game.getId(), game, { commit: true });
      this.notificationService.success(GamesStore.EDIT_SUCCESS_MESSAGE);
    } else {
      this.rollbackEdit(dto.id, previous);
      const errorMessage =
        GamesStore.OPERATION_ERROR_MESSAGES[result.getError().type] ?? GamesStore.DEFAULT_OPERATION_ERROR_MESSAGE;
      this.notificationService.error(errorMessage);
    }

    return result;
  }

  /**
   * Adds a new game to the collection.
   * Workflow: execute use case → add to map on success; no state change on error.
   * Sends a success or error notification via NotificationService.
   */
  async addGame(dto: AddGameDTO): Promise<Result<Game, ApplicationErrorInterface>> {
    const result = await this.addGameUseCase.execute(dto);
    if (result.isOk()) {
      const game = result.unwrap();
      this.setEntry(game.getId(), game, { commit: true });
      this.notificationService.success(GamesStore.ADD_SUCCESS_MESSAGE);
    } else {
      const errorMessage =
        GamesStore.OPERATION_ERROR_MESSAGES[result.getError().type] ?? GamesStore.DEFAULT_OPERATION_ERROR_MESSAGE;
      this.notificationService.error(errorMessage);
    }
    return result;
  }

  /**
   * Workflow: execute use case → remove from map on success; no state change on error.
   * Sends a success or error notification via NotificationService.
   */
  async deleteGame(id: string): Promise<Result<void, ApplicationErrorInterface>> {
    const result = await this.deleteGameUseCase.execute(id);

    if (result.isOk()) {
      this.gamesMap.delete(id);
      this.commit(true);
      this.notificationService.success(GamesStore.DELETE_SUCCESS_MESSAGE);
    } else {
      const errorMessage =
        GamesStore.OPERATION_ERROR_MESSAGES[result.getError().type] ?? GamesStore.DEFAULT_OPERATION_ERROR_MESSAGE;
      this.notificationService.error(errorMessage);
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
