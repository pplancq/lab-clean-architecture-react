import { RepositoryError } from '@Collection/application/errors/RepositoryError';
import { GetGamesUseCase } from '@Collection/application/use-cases/GetGamesUseCase';
import { Game } from '@Collection/domain/entities/Game';
import type { GameRepositoryInterface } from '@Collection/domain/repositories/GameRepositoryInterface';
import { Result } from '@Shared/domain/result/Result';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const createValidGame = (id = 'game-1') =>
  Game.create({
    id,
    title: 'The Legend of Zelda',
    description: 'Classic adventure',
    platform: 'Nintendo Switch',
    format: 'Physical',
    purchaseDate: new Date('2023-05-12'),
    status: 'Owned',
  }).unwrap();

describe('GetGamesUseCase', () => {
  let getGamesUseCase: GetGamesUseCase;
  let mockGameRepository: GameRepositoryInterface;

  beforeEach(() => {
    mockGameRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      delete: vi.fn(),
    };

    getGamesUseCase = new GetGamesUseCase(mockGameRepository);
  });

  describe('execute', () => {
    it('should return all games when repository succeeds', async () => {
      const games = [createValidGame('game-1'), createValidGame('game-2')];
      vi.mocked(mockGameRepository.findAll).mockResolvedValue(Result.ok(games));

      const result = await getGamesUseCase.execute();

      expect(result.isOk()).toBeTruthy();
      expect(result.unwrap()).toStrictEqual(games);
      expect(result.unwrap()).toHaveLength(2);
      expect(mockGameRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when collection is empty', async () => {
      vi.mocked(mockGameRepository.findAll).mockResolvedValue(Result.ok([]));

      const result = await getGamesUseCase.execute();

      expect(result.isOk()).toBeTruthy();
      expect(result.unwrap()).toStrictEqual([]);
    });

    it('should return a RepositoryError when repository fails', async () => {
      const repoError = { message: 'IndexedDB unavailable', type: 'Unknown', metadata: {} };
      vi.mocked(mockGameRepository.findAll).mockResolvedValue(Result.err(repoError));

      const result = await getGamesUseCase.execute();

      expect(result.isErr()).toBeTruthy();
      const error = result.getError() as RepositoryError;
      expect(error).toBeInstanceOf(RepositoryError);
      expect(error.type).toBe('Repository');
      expect(error.message).toContain('Failed to retrieve games');
      expect(error.message).toContain('IndexedDB unavailable');
    });

    it('should not call repository more than once', async () => {
      vi.mocked(mockGameRepository.findAll).mockResolvedValue(Result.ok([]));

      await getGamesUseCase.execute();

      expect(mockGameRepository.findAll).toHaveBeenCalledTimes(1);
      expect(mockGameRepository.save).not.toHaveBeenCalled();
      expect(mockGameRepository.findById).not.toHaveBeenCalled();
      expect(mockGameRepository.delete).not.toHaveBeenCalled();
    });
  });
});
