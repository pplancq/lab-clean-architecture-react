import { NotFoundError } from '@Collection/application/errors/NotFoundError';
import { RepositoryError } from '@Collection/application/errors/RepositoryError';
import { DeleteGameUseCase } from '@Collection/application/use-cases/DeleteGameUseCase';
import type { GameRepositoryInterface } from '@Collection/domain/repositories/GameRepositoryInterface';
import { Result } from '@Shared/domain/result/Result';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('DeleteGameUseCase', () => {
  let deleteGameUseCase: DeleteGameUseCase;
  let mockGameRepository: GameRepositoryInterface;

  beforeEach(() => {
    mockGameRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      delete: vi.fn(),
    };

    deleteGameUseCase = new DeleteGameUseCase(mockGameRepository);
  });

  describe('execute', () => {
    it('should return ok when the game is successfully deleted', async () => {
      vi.mocked(mockGameRepository.delete).mockResolvedValue(Result.ok(undefined));

      const result = await deleteGameUseCase.execute('game-123');

      expect(result.isOk()).toBeTruthy();
      expect(mockGameRepository.delete).toHaveBeenCalledWith('game-123');
    });

    it('should return NotFoundError when repository signals entity not found', async () => {
      vi.mocked(mockGameRepository.delete).mockResolvedValue(
        Result.err({ entityId: 'game-123', message: "Game with id 'game-123' not found" }),
      );

      const result = await deleteGameUseCase.execute('game-123');

      expect(result.isErr()).toBeTruthy();
      const error = result.getError() as NotFoundError;
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.type).toBe('NotFound');
      expect(error.entityId).toBe('game-123');
    });

    it('should return RepositoryError when repository fails with a generic error', async () => {
      vi.mocked(mockGameRepository.delete).mockResolvedValue(Result.err({ message: 'Database connection failed' }));

      const result = await deleteGameUseCase.execute('game-123');

      expect(result.isErr()).toBeTruthy();
      const error = result.getError() as RepositoryError;
      expect(error).toBeInstanceOf(RepositoryError);
      expect(error.type).toBe('Repository');
      expect(error.message).toContain('Failed to delete game');
    });
  });
});
