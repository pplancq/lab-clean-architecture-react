import { NotFoundError } from '@Collection/application/errors/NotFoundError';
import { RepositoryError } from '@Collection/application/errors/RepositoryError';
import { GetGameByIdUseCase } from '@Collection/application/use-cases/GetGameByIdUseCase';
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

describe('GetGameByIdUseCase', () => {
  let getGameByIdUseCase: GetGameByIdUseCase;
  let mockGameRepository: GameRepositoryInterface;

  beforeEach(() => {
    mockGameRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      delete: vi.fn(),
    };

    getGameByIdUseCase = new GetGameByIdUseCase(mockGameRepository);
  });

  describe('execute', () => {
    it('should return the game when repository succeeds', async () => {
      const game = createValidGame('game-1');
      vi.mocked(mockGameRepository.findById).mockResolvedValue(Result.ok(game));

      const result = await getGameByIdUseCase.execute('game-1');

      expect(result.isOk()).toBeTruthy();
      expect(result.unwrap()).toStrictEqual(game);
      expect(mockGameRepository.findById).toHaveBeenCalledWith('game-1');
    });

    it('should return a NotFoundApplicationError when the game does not exist', async () => {
      vi.mocked(mockGameRepository.findById).mockResolvedValue(
        Result.err({ entityId: 'game-99', message: "Entity with id 'game-99' not found", metadata: {} }),
      );

      const result = await getGameByIdUseCase.execute('game-99');

      expect(result.isErr()).toBeTruthy();
      const error = result.getError() as NotFoundError;
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.type).toBe('NotFound');
      expect(error.entityId).toBe('game-99');
    });

    it('should return a RepositoryError when the repository fails with a generic error', async () => {
      vi.mocked(mockGameRepository.findById).mockResolvedValue(
        Result.err({ message: 'IndexedDB unavailable', type: 'Unknown', metadata: {} }),
      );

      const result = await getGameByIdUseCase.execute('game-1');

      expect(result.isErr()).toBeTruthy();
      const error = result.getError() as RepositoryError;
      expect(error).toBeInstanceOf(RepositoryError);
      expect(error.type).toBe('Repository');
      expect(error.message).toContain('Failed to retrieve game');
    });

    it('should only call findById and not other repository methods', async () => {
      vi.mocked(mockGameRepository.findById).mockResolvedValue(Result.ok(createValidGame()));

      await getGameByIdUseCase.execute('game-1');

      expect(mockGameRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockGameRepository.save).not.toHaveBeenCalled();
      expect(mockGameRepository.findAll).not.toHaveBeenCalled();
      expect(mockGameRepository.delete).not.toHaveBeenCalled();
    });
  });
});
