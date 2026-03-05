import { GamesStore } from '@Collection/application/stores/GamesStore';
import type { GameMapEntryState } from '@Collection/application/stores/GamesStoreInterface';
import type { GetGameByIdUseCaseInterface } from '@Collection/application/use-cases/GetGameByIdUseCaseInterface';
import type { GetGamesUseCaseInterface } from '@Collection/application/use-cases/GetGamesUseCaseInterface';
import { Game } from '@Collection/domain/entities/Game';
import { Result } from '@Shared/domain/result/Result';
import { describe, expect, it, vi } from 'vitest';

// Drains all microtasks and pending promise continuations
const flushPromises = () =>
  new Promise<void>(resolve => {
    setTimeout(resolve, 0);
  });

const createGame = (id: string, title: string) =>
  Game.create({
    id,
    title,
    description: '',
    platform: 'Nintendo Switch',
    format: 'Physical',
    purchaseDate: null,
    status: 'Owned',
  }).unwrap();

const createGetGamesUseCaseMock = (result: Awaited<ReturnType<GetGamesUseCaseInterface['execute']>>) => ({
  execute: vi.fn().mockResolvedValue(result),
});

const createGetGameByIdUseCaseMock = (result: Awaited<ReturnType<GetGameByIdUseCaseInterface['execute']>>) => ({
  execute: vi.fn().mockResolvedValue(result),
});

const createNoopGetGameByIdUseCaseMock = () => ({
  execute: vi.fn().mockResolvedValue(Result.ok(createGame('noop', 'noop'))),
});

const createNoopEditGameUseCaseMock = () => ({
  execute: vi.fn().mockResolvedValue(Result.ok(createGame('noop', 'noop'))),
});

const createNoopDeleteGameUseCaseMock = () => ({
  execute: vi.fn().mockResolvedValue(Result.ok(undefined)),
});

const createNoopAddGameUseCaseMock = () => ({
  execute: vi.fn().mockResolvedValue(Result.ok(createGame('noop', 'noop'))),
});

const FULL_ENTRY = (game: Game): GameMapEntryState => ({
  data: game,
  isLazy: false,
  isLoading: false,
  hasError: false,
  error: null,
});

describe('GamesStore', () => {
  describe('getGamesList', () => {
    it('should return isLoading true on first call and auto-trigger fetch', async () => {
      const useCaseMock = createGetGamesUseCaseMock(Result.ok([]));
      const store = new GamesStore(
        createNoopAddGameUseCaseMock(),
        useCaseMock,
        createNoopGetGameByIdUseCaseMock(),
        createNoopEditGameUseCaseMock(),
        createNoopDeleteGameUseCaseMock(),
      );

      expect(store.getGamesList()).toStrictEqual({ games: [], isLoading: true, hasError: false, error: null });

      await flushPromises();
      expect(useCaseMock.execute).toHaveBeenCalledTimes(1);
    });

    it('should set games on success', async () => {
      const games = [createGame('1', 'Zelda'), createGame('2', 'Mario')];
      const store = new GamesStore(
        createNoopAddGameUseCaseMock(),
        createGetGamesUseCaseMock(Result.ok(games)),
        createNoopGetGameByIdUseCaseMock(),
        createNoopEditGameUseCaseMock(),
        createNoopDeleteGameUseCaseMock(),
      );

      store.getGamesList();
      await flushPromises();

      expect(store.getGamesList()).toStrictEqual({ games, isLoading: false, hasError: false, error: null });
    });

    it('should set error on use case failure', async () => {
      const store = new GamesStore(
        createNoopAddGameUseCaseMock(),
        createGetGamesUseCaseMock(Result.err({ type: 'Repository', message: 'DB error', metadata: {} })),
        createNoopGetGameByIdUseCaseMock(),
        createNoopEditGameUseCaseMock(),
        createNoopDeleteGameUseCaseMock(),
      );

      store.getGamesList();
      await flushPromises();

      expect(store.getGamesList()).toStrictEqual({
        games: [],
        isLoading: false,
        hasError: true,
        error: 'Unable to load games. Please try again.',
      });
    });

    it('should not trigger fetch again after first call', async () => {
      const useCaseMock = createGetGamesUseCaseMock(Result.ok([]));
      const store = new GamesStore(
        createNoopAddGameUseCaseMock(),
        useCaseMock,
        createNoopGetGameByIdUseCaseMock(),
        createNoopEditGameUseCaseMock(),
        createNoopDeleteGameUseCaseMock(),
      );

      store.getGamesList();
      store.getGamesList();
      store.getGamesList();
      await flushPromises();

      expect(useCaseMock.execute).toHaveBeenCalledTimes(1);
    });

    it('should preserve games array reference while loading', () => {
      const store = new GamesStore(
        createNoopAddGameUseCaseMock(),
        createGetGamesUseCaseMock(Result.ok([])),
        createNoopGetGameByIdUseCaseMock(),
        createNoopEditGameUseCaseMock(),
        createNoopDeleteGameUseCaseMock(),
      );

      const first = store.getGamesList();
      const second = store.getGamesList();

      expect(first.games).toBe(second.games);
    });

    it('should return a stable snapshot reference when state has not changed', () => {
      const store = new GamesStore(
        createNoopAddGameUseCaseMock(),
        createGetGamesUseCaseMock(Result.ok([])),
        createNoopGetGameByIdUseCaseMock(),
        createNoopEditGameUseCaseMock(),
        createNoopDeleteGameUseCaseMock(),
      );

      const snapshot1 = store.getGamesList();
      const snapshot2 = store.getGamesList();

      expect(snapshot1).toBe(snapshot2);
    });

    it('should notify observers when fetch completes', async () => {
      const games = [createGame('1', 'Zelda')];
      const store = new GamesStore(
        createNoopAddGameUseCaseMock(),
        createGetGamesUseCaseMock(Result.ok(games)),
        createNoopGetGameByIdUseCaseMock(),
        createNoopEditGameUseCaseMock(),
        createNoopDeleteGameUseCaseMock(),
      );
      const observer = vi.fn();
      store.subscribe(observer);

      store.getGamesList();
      await flushPromises();

      expect(observer).toHaveBeenCalledTimes(1);
    });
  });

  describe('getGame', () => {
    it('should return a loading entry on first call for an unknown id', () => {
      const store = new GamesStore(
        createNoopAddGameUseCaseMock(),
        createGetGamesUseCaseMock(Result.ok([])),
        createNoopGetGameByIdUseCaseMock(),
        createNoopEditGameUseCaseMock(),
        createNoopDeleteGameUseCaseMock(),
      );

      expect(store.getGame('unknown')).toStrictEqual({
        data: null,
        isLazy: false,
        isLoading: true,
        hasError: false,
        error: null,
      });
    });

    it('should auto-trigger fetchGameById and return full entry on success', async () => {
      const game = createGame('game-1', 'Zelda');
      const store = new GamesStore(
        createNoopAddGameUseCaseMock(),
        createGetGamesUseCaseMock(Result.ok([])),
        createGetGameByIdUseCaseMock(Result.ok(game)),
        createNoopEditGameUseCaseMock(),
        createNoopDeleteGameUseCaseMock(),
      );

      store.getGame('game-1');
      await flushPromises();

      expect(store.getGame('game-1')).toStrictEqual(FULL_ENTRY(game));
    });

    it('should set hasError with null error on NotFound', async () => {
      const store = new GamesStore(
        createNoopAddGameUseCaseMock(),
        createGetGamesUseCaseMock(Result.ok([])),
        createGetGameByIdUseCaseMock(
          Result.err({ type: 'NotFound', message: 'Not found', entityId: 'game-99', metadata: {} }),
        ),
        createNoopEditGameUseCaseMock(),
        createNoopDeleteGameUseCaseMock(),
      );

      store.getGame('game-99');
      await flushPromises();

      expect(store.getGame('game-99')).toStrictEqual({
        data: null,
        isLazy: false,
        isLoading: false,
        hasError: true,
        error: null,
      });
    });

    it('should set hasError with error message on generic failure', async () => {
      const store = new GamesStore(
        createNoopAddGameUseCaseMock(),
        createGetGamesUseCaseMock(Result.ok([])),
        createGetGameByIdUseCaseMock(Result.err({ type: 'Repository', message: 'DB error', metadata: {} })),
        createNoopEditGameUseCaseMock(),
        createNoopDeleteGameUseCaseMock(),
      );

      store.getGame('game-1');
      await flushPromises();

      expect(store.getGame('game-1')).toStrictEqual({
        data: null,
        isLazy: false,
        isLoading: false,
        hasError: true,
        error: 'Unable to load game. Please try again.',
      });
    });

    it('should upgrade a lazy entry from the list to full data', async () => {
      const game = createGame('game-1', 'Zelda');
      const getGameByIdMock = createGetGameByIdUseCaseMock(Result.ok(game));
      const store = new GamesStore(
        createNoopAddGameUseCaseMock(),
        createGetGamesUseCaseMock(Result.ok([game])),
        getGameByIdMock,
        createNoopEditGameUseCaseMock(),
        createNoopDeleteGameUseCaseMock(),
      );

      store.getGamesList();
      await flushPromises(); // list loaded — game-1 is now isLazy: true

      const lazyEntry = store.getGame('game-1');
      expect(lazyEntry.isLazy).toBeTruthy();
      expect(lazyEntry.isLoading).toBeTruthy();

      await flushPromises(); // full game loaded

      expect(store.getGame('game-1')).toStrictEqual(FULL_ENTRY(game));
      expect(getGameByIdMock.execute).toHaveBeenCalledWith('game-1');
    });

    it('should not re-fetch if entry is already full', async () => {
      const game = createGame('game-1', 'Zelda');
      const getGameByIdMock = createGetGameByIdUseCaseMock(Result.ok(game));
      const store = new GamesStore(
        createNoopAddGameUseCaseMock(),
        createGetGamesUseCaseMock(Result.ok([])),
        getGameByIdMock,
        createNoopEditGameUseCaseMock(),
        createNoopDeleteGameUseCaseMock(),
      );

      store.getGame('game-1');
      await flushPromises();

      store.getGame('game-1');
      store.getGame('game-1');
      await flushPromises();

      expect(getGameByIdMock.execute).toHaveBeenCalledTimes(1);
    });

    it('should not duplicate fetch if called multiple times before fetch completes', async () => {
      let resolve!: (value: Result<Game, never>) => void;
      const getGameByIdMock = {
        execute: vi.fn().mockReturnValue(
          new Promise<Result<Game, never>>(res => {
            resolve = res;
          }),
        ),
      };
      const store = new GamesStore(
        createNoopAddGameUseCaseMock(),
        createGetGamesUseCaseMock(Result.ok([])),
        getGameByIdMock,
        createNoopEditGameUseCaseMock(),
        createNoopDeleteGameUseCaseMock(),
      );

      store.getGame('game-1'); // schedules microtask, isLoading: true
      store.getGame('game-1'); // isLoading: true → no new microtask

      await new Promise<void>(r => {
        queueMicrotask(r);
      }); // drain scheduled microtask

      expect(getGameByIdMock.execute).toHaveBeenCalledTimes(1);

      resolve(Result.ok(createGame('game-1', 'Zelda')));
      await flushPromises();
    });

    it('should return a stable entry reference when state has not changed', async () => {
      const game = createGame('game-1', 'Zelda');
      const store = new GamesStore(
        createNoopAddGameUseCaseMock(),
        createGetGamesUseCaseMock(Result.ok([])),
        createGetGameByIdUseCaseMock(Result.ok(game)),
        createNoopEditGameUseCaseMock(),
        createNoopDeleteGameUseCaseMock(),
      );

      store.getGame('game-1');
      await flushPromises();

      expect(store.getGame('game-1')).toBe(store.getGame('game-1'));
    });

    it('should notify observers when game is loaded', async () => {
      const game = createGame('game-1', 'Zelda');
      const store = new GamesStore(
        createNoopAddGameUseCaseMock(),
        createGetGamesUseCaseMock(Result.ok([])),
        createGetGameByIdUseCaseMock(Result.ok(game)),
        createNoopEditGameUseCaseMock(),
        createNoopDeleteGameUseCaseMock(),
      );
      const observer = vi.fn();
      store.subscribe(observer);

      store.getGame('game-1');
      await flushPromises();

      expect(observer).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteGame', () => {
    it('should remove the game from the map and rebuild the list on success', async () => {
      const game = createGame('game-1', 'Zelda');
      const deleteUseCaseMock = { execute: vi.fn().mockResolvedValue(Result.ok(undefined)) };
      const store = new GamesStore(
        createNoopAddGameUseCaseMock(),
        createGetGamesUseCaseMock(Result.ok([game])),
        createNoopGetGameByIdUseCaseMock(),
        createNoopEditGameUseCaseMock(),
        deleteUseCaseMock,
      );

      store.getGamesList();
      await flushPromises();

      expect(store.getGamesList().games).toHaveLength(1);

      const result = await store.deleteGame('game-1');

      expect(result.isOk()).toBeTruthy();
      expect(deleteUseCaseMock.execute).toHaveBeenCalledWith('game-1');
      expect(store.getGamesList().games).toHaveLength(0);
    });

    it('should not modify the map and return the error on failure', async () => {
      const game = createGame('game-1', 'Zelda');
      const deleteUseCaseMock = {
        execute: vi.fn().mockResolvedValue(Result.err({ type: 'Repository', message: 'DB error', metadata: {} })),
      };
      const store = new GamesStore(
        createNoopAddGameUseCaseMock(),
        createGetGamesUseCaseMock(Result.ok([game])),
        createNoopGetGameByIdUseCaseMock(),
        createNoopEditGameUseCaseMock(),
        deleteUseCaseMock,
      );

      store.getGamesList();
      await flushPromises();

      const result = await store.deleteGame('game-1');

      expect(result.isErr()).toBeTruthy();
      expect(store.getGamesList().games).toHaveLength(1);
    });

    it('should not notify observers on failure', async () => {
      const game = createGame('game-1', 'Zelda');
      const deleteUseCaseMock = {
        execute: vi.fn().mockResolvedValue(Result.err({ type: 'Repository', message: 'DB error', metadata: {} })),
      };
      const store = new GamesStore(
        createNoopAddGameUseCaseMock(),
        createGetGamesUseCaseMock(Result.ok([game])),
        createNoopGetGameByIdUseCaseMock(),
        createNoopEditGameUseCaseMock(),
        deleteUseCaseMock,
      );
      const observer = vi.fn();
      store.subscribe(observer);

      await store.deleteGame('game-1');

      expect(observer).not.toHaveBeenCalled();
    });

    it('should notify observers on success', async () => {
      const game = createGame('game-1', 'Zelda');
      const store = new GamesStore(
        createNoopAddGameUseCaseMock(),
        createGetGamesUseCaseMock(Result.ok([game])),
        createNoopGetGameByIdUseCaseMock(),
        createNoopEditGameUseCaseMock(),
        { execute: vi.fn().mockResolvedValue(Result.ok(undefined)) },
      );
      const observer = vi.fn();
      store.subscribe(observer);

      await store.deleteGame('game-1');

      expect(observer).toHaveBeenCalledWith();
    });
  });

  describe('addGame', () => {
    it('should add the game to the map and rebuild the list on success', async () => {
      const addedGame = createGame('game-1', 'Zelda');
      const addUseCaseMock = { execute: vi.fn().mockResolvedValue(Result.ok(addedGame)) };
      const store = new GamesStore(
        addUseCaseMock,
        createGetGamesUseCaseMock(Result.ok([])),
        createNoopGetGameByIdUseCaseMock(),
        createNoopEditGameUseCaseMock(),
        createNoopDeleteGameUseCaseMock(),
      );

      store.getGamesList();
      await flushPromises();

      expect(store.getGamesList().games).toHaveLength(0);

      const result = await store.addGame({
        id: 'game-1',
        title: 'Zelda',
        description: '',
        platform: 'Nintendo Switch',
        format: 'Physical',
        purchaseDate: null,
        status: 'owned',
      });

      expect(result.isOk()).toBeTruthy();
      expect(store.getGamesList().games).toHaveLength(1);
    });

    it('should not modify the map and return the error on failure', async () => {
      const addUseCaseMock = {
        execute: vi.fn().mockResolvedValue(Result.err({ type: 'Repository', message: 'DB error', metadata: {} })),
      };
      const store = new GamesStore(
        addUseCaseMock,
        createGetGamesUseCaseMock(Result.ok([])),
        createNoopGetGameByIdUseCaseMock(),
        createNoopEditGameUseCaseMock(),
        createNoopDeleteGameUseCaseMock(),
      );

      store.getGamesList();
      await flushPromises();

      const result = await store.addGame({
        id: 'game-1',
        title: 'Zelda',
        description: '',
        platform: 'Nintendo Switch',
        format: 'Physical',
        purchaseDate: null,
        status: 'owned',
      });

      expect(result.isErr()).toBeTruthy();
      expect(store.getGamesList().games).toHaveLength(0);
    });

    it('should not notify observers on failure', async () => {
      const addUseCaseMock = {
        execute: vi.fn().mockResolvedValue(Result.err({ type: 'Repository', message: 'DB error', metadata: {} })),
      };
      const store = new GamesStore(
        addUseCaseMock,
        createGetGamesUseCaseMock(Result.ok([])),
        createNoopGetGameByIdUseCaseMock(),
        createNoopEditGameUseCaseMock(),
        createNoopDeleteGameUseCaseMock(),
      );
      const observer = vi.fn();
      store.subscribe(observer);

      await store.addGame({
        id: 'game-1',
        title: 'Zelda',
        description: '',
        platform: 'Nintendo Switch',
        format: 'Physical',
        purchaseDate: null,
        status: 'owned',
      });

      expect(observer).not.toHaveBeenCalled();
    });

    it('should notify observers on success', async () => {
      const addedGame = createGame('game-1', 'Zelda');
      const store = new GamesStore(
        { execute: vi.fn().mockResolvedValue(Result.ok(addedGame)) },
        createGetGamesUseCaseMock(Result.ok([])),
        createNoopGetGameByIdUseCaseMock(),
        createNoopEditGameUseCaseMock(),
        createNoopDeleteGameUseCaseMock(),
      );
      const observer = vi.fn();
      store.subscribe(observer);

      await store.addGame({
        id: 'game-1',
        title: 'Zelda',
        description: '',
        platform: 'Nintendo Switch',
        format: 'Physical',
        purchaseDate: null,
        status: 'owned',
      });

      expect(observer).toHaveBeenCalledWith();
    });
  });
});
