import { EditGameDTO } from '@Collection/application/dtos/EditGameDTO';
import { NotFoundError } from '@Collection/application/errors/NotFoundError';
import { RepositoryError } from '@Collection/application/errors/RepositoryError';
import { ValidationError } from '@Collection/application/errors/ValidationError';
import { EditGameUseCase } from '@Collection/application/use-cases/EditGameUseCase';
import { Game } from '@Collection/domain/entities/Game';
import type { GameRepositoryInterface } from '@Collection/domain/repositories/GameRepositoryInterface';
import { Result } from '@Shared/domain/result/Result';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const createGame = (overrides: Partial<Parameters<typeof Game.create>[0]> = {}) =>
  Game.create({
    id: 'game-123',
    title: 'The Legend of Zelda',
    description: 'Classic adventure game',
    platform: 'Nintendo Switch',
    format: 'Physical',
    purchaseDate: new Date('2023-05-12'),
    status: 'Owned',
    ...overrides,
  }).unwrap();

describe('EditGameUseCase', () => {
  let editGameUseCase: EditGameUseCase;
  let mockGameRepository: GameRepositoryInterface;

  beforeEach(() => {
    mockGameRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      delete: vi.fn(),
    };

    editGameUseCase = new EditGameUseCase(mockGameRepository);
  });

  describe('execute', () => {
    it('should return the updated Game on a full update', async () => {
      const existingGame = createGame();
      vi.mocked(mockGameRepository.findById).mockResolvedValue(Result.ok(existingGame));
      vi.mocked(mockGameRepository.save).mockResolvedValue(Result.ok(undefined));

      const dto = new EditGameDTO(
        'game-123',
        'Updated Title',
        'Updated description',
        new Date('2024-01-01'),
        'Wishlist',
      );

      const result = await editGameUseCase.execute(dto);

      expect(result.isOk()).toBeTruthy();
      const updatedGame = result.unwrap();
      expect(updatedGame).toBeInstanceOf(Game);
      expect(updatedGame.getTitle()).toBe('Updated Title');
      expect(updatedGame.getDescription()).toBe('Updated description');
      expect(updatedGame.getStatus()).toBe('Wishlist');
      expect(mockGameRepository.findById).toHaveBeenCalledWith('game-123');
      expect(mockGameRepository.save).toHaveBeenCalledWith(updatedGame);
    });

    it('should update only the title when only title is provided', async () => {
      const existingGame = createGame();
      vi.mocked(mockGameRepository.findById).mockResolvedValue(Result.ok(existingGame));
      vi.mocked(mockGameRepository.save).mockResolvedValue(Result.ok(undefined));

      const dto = new EditGameDTO('game-123', 'New Title Only');

      const result = await editGameUseCase.execute(dto);

      expect(result.isOk()).toBeTruthy();
      const updatedGame = result.unwrap();
      expect(updatedGame.getTitle()).toBe('New Title Only');
      expect(updatedGame.getDescription()).toBe('Classic adventure game');
      expect(updatedGame.getStatus()).toBe('Owned');
    });

    it('should update only the status when only status is provided', async () => {
      const existingGame = createGame({ status: 'Wishlist' });
      vi.mocked(mockGameRepository.findById).mockResolvedValue(Result.ok(existingGame));
      vi.mocked(mockGameRepository.save).mockResolvedValue(Result.ok(undefined));

      const dto = new EditGameDTO('game-123', undefined, undefined, undefined, 'Owned');

      const result = await editGameUseCase.execute(dto);

      expect(result.isOk()).toBeTruthy();
      const updatedGame = result.unwrap();
      expect(updatedGame.getStatus()).toBe('Owned');
      expect(updatedGame.getTitle()).toBe('The Legend of Zelda');
    });

    it('should clear purchaseDate when purchaseDate is null', async () => {
      const existingGame = createGame({ purchaseDate: new Date('2023-05-12') });
      vi.mocked(mockGameRepository.findById).mockResolvedValue(Result.ok(existingGame));
      vi.mocked(mockGameRepository.save).mockResolvedValue(Result.ok(undefined));

      const dto = new EditGameDTO('game-123', undefined, undefined, null);

      const result = await editGameUseCase.execute(dto);

      expect(result.isOk()).toBeTruthy();
      expect(result.unwrap().getPurchaseDate()).toBeNull();
    });

    it('should not change purchaseDate when purchaseDate is undefined', async () => {
      const originalDate = new Date('2023-05-12');
      const existingGame = createGame({ purchaseDate: originalDate });
      vi.mocked(mockGameRepository.findById).mockResolvedValue(Result.ok(existingGame));
      vi.mocked(mockGameRepository.save).mockResolvedValue(Result.ok(undefined));

      const dto = new EditGameDTO('game-123', 'New Title');

      const result = await editGameUseCase.execute(dto);

      expect(result.isOk()).toBeTruthy();
      expect(result.unwrap().getPurchaseDate()).toStrictEqual(originalDate);
    });

    it('should return NotFoundError when the game does not exist', async () => {
      vi.mocked(mockGameRepository.findById).mockResolvedValue(
        Result.err({ entityId: 'game-123', message: "Game with id 'game-123' not found" }),
      );

      const dto = new EditGameDTO('game-123', 'Title');

      const result = await editGameUseCase.execute(dto);

      expect(result.isErr()).toBeTruthy();
      const error = result.getError() as NotFoundError;
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.type).toBe('NotFound');
      expect(error.entityId).toBe('game-123');
      expect(mockGameRepository.save).not.toHaveBeenCalled();
    });

    it('should return RepositoryError when findById fails with a generic error', async () => {
      vi.mocked(mockGameRepository.findById).mockResolvedValue(Result.err({ message: 'Database connection failed' }));

      const dto = new EditGameDTO('game-123', 'Title');

      const result = await editGameUseCase.execute(dto);

      expect(result.isErr()).toBeTruthy();
      const error = result.getError() as RepositoryError;
      expect(error).toBeInstanceOf(RepositoryError);
      expect(error.type).toBe('Repository');
      expect(error.message).toContain('Failed to retrieve game');
      expect(mockGameRepository.save).not.toHaveBeenCalled();
    });

    it('should return ValidationError when title is too long', async () => {
      const existingGame = createGame();
      vi.mocked(mockGameRepository.findById).mockResolvedValue(Result.ok(existingGame));

      const dto = new EditGameDTO('game-123', 'A'.repeat(201));

      const result = await editGameUseCase.execute(dto);

      expect(result.isErr()).toBeTruthy();
      const error = result.getError() as ValidationError;
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.type).toBe('Validation');
      expect(error.field).toBe('title');
      expect(mockGameRepository.save).not.toHaveBeenCalled();
    });

    it('should return ValidationError when status is invalid', async () => {
      const existingGame = createGame();
      vi.mocked(mockGameRepository.findById).mockResolvedValue(Result.ok(existingGame));

      const dto = new EditGameDTO('game-123', undefined, undefined, undefined, 'InvalidStatus');

      const result = await editGameUseCase.execute(dto);

      expect(result.isErr()).toBeTruthy();
      const error = result.getError() as ValidationError;
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.field).toBe('status');
      expect(mockGameRepository.save).not.toHaveBeenCalled();
    });

    it('should return RepositoryError when save fails', async () => {
      const existingGame = createGame();
      vi.mocked(mockGameRepository.findById).mockResolvedValue(Result.ok(existingGame));
      vi.mocked(mockGameRepository.save).mockResolvedValue(Result.err({ message: 'Database connection failed' }));

      const dto = new EditGameDTO('game-123', 'The Legend of Zelda');

      const result = await editGameUseCase.execute(dto);

      expect(result.isErr()).toBeTruthy();
      const error = result.getError() as RepositoryError;
      expect(error).toBeInstanceOf(RepositoryError);
      expect(error.type).toBe('Repository');
      expect(error.message).toContain('Failed to save game');
    });
  });
});
