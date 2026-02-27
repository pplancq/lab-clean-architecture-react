import { GamesStore } from '@Collection/application/stores/GamesStore';
import type { GetGamesUseCaseInterface } from '@Collection/application/use-cases/GetGamesUseCaseInterface';
import { Game } from '@Collection/domain/entities/Game';
import { Result } from '@Shared/domain/result/Result';
import { describe, expect, it, vi } from 'vitest';

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

const createUseCaseMock = (result: Awaited<ReturnType<GetGamesUseCaseInterface['execute']>>) => ({
  execute: vi.fn().mockResolvedValue(result),
});

describe('GamesStore', () => {
  describe('initial state', () => {
    it('should start with empty games list, not loading and no error', () => {
      const store = new GamesStore(createUseCaseMock(Result.ok([])));

      expect(store.getGamesList()).toStrictEqual({ games: [], isLoading: false, error: null });
    });
  });

  describe('fetchGames', () => {
    it('should set isLoading true while fetching', async () => {
      let resolveLoad!: (value: Result<Game[], never>) => void;
      const useCaseMock = {
        execute: vi.fn().mockReturnValue(
          new Promise<Result<Game[], never>>(res => {
            resolveLoad = res;
          }),
        ),
      };
      const store = new GamesStore(useCaseMock);

      const fetchPromise = store.fetchGames();
      expect(store.getGamesList().isLoading).toBeTruthy();

      resolveLoad(Result.ok([]));
      await fetchPromise;
    });

    it('should set games on success', async () => {
      const games = [createGame('1', 'Zelda'), createGame('2', 'Mario')];
      const store = new GamesStore(createUseCaseMock(Result.ok(games)));

      await store.fetchGames();

      expect(store.getGamesList()).toStrictEqual({ games, isLoading: false, error: null });
    });

    it('should set error on use case failure', async () => {
      const store = new GamesStore(
        createUseCaseMock(Result.err({ type: 'Repository', message: 'DB error', metadata: {} })),
      );

      await store.fetchGames();

      expect(store.getGamesList()).toStrictEqual({
        games: [],
        isLoading: false,
        error: 'Unable to load games. Please try again.',
      });
    });

    it('should not call use case again if already loading', async () => {
      let resolve!: (value: Result<Game[], never>) => void;
      const useCaseMock = {
        execute: vi.fn().mockReturnValue(
          new Promise<Result<Game[], never>>(res => {
            resolve = res;
          }),
        ),
      };
      const store = new GamesStore(useCaseMock);

      const first = store.fetchGames();
      const second = store.fetchGames();

      expect(useCaseMock.execute).toHaveBeenCalledTimes(1);

      resolve(Result.ok([]));
      await Promise.all([first, second]);
    });

    it('should notify observers when state changes', async () => {
      const games = [createGame('1', 'Zelda')];
      const store = new GamesStore(createUseCaseMock(Result.ok(games)));
      const observer = vi.fn();
      store.subscribe(observer);

      await store.fetchGames();

      // Called twice: once for isLoading=true (commit), once for games loaded (commit)
      expect(observer).toHaveBeenCalledTimes(2);
    });

    it('should preserve the games array reference when only isLoading changes', async () => {
      let resolve!: (value: Result<Game[], never>) => void;
      const useCaseMock = {
        execute: vi.fn().mockReturnValue(
          new Promise<Result<Game[], never>>(res => {
            resolve = res;
          }),
        ),
      };
      const store = new GamesStore(useCaseMock);
      const initialGamesRef = store.getGamesList().games;

      const fetchPromise = store.fetchGames();
      // While loading, games reference must not change
      expect(store.getGamesList().games).toBe(initialGamesRef);

      resolve(Result.ok([]));
      await fetchPromise;
    });

    it('should return a stable snapshot reference between commits', async () => {
      const store = new GamesStore(createUseCaseMock(Result.ok([])));

      const snapshot1 = store.getGamesList();
      const snapshot2 = store.getGamesList();

      expect(snapshot1).toBe(snapshot2);
    });
  });
});
