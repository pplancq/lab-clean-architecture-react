import { AddGameDTO } from '@Collection/application/dtos/AddGameDTO';
import { RepositoryError } from '@Collection/application/errors/RepositoryError';
import { ValidationError } from '@Collection/application/errors/ValidationError';
import { AddGameUseCase } from '@Collection/application/use-cases/AddGameUseCase';
import { Game } from '@Collection/domain/entities/Game';
import type { GameRepositoryInterface } from '@Collection/domain/repositories/GameRepositoryInterface';
import { Result } from '@Shared/domain/result/Result';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('AddGameUseCase', () => {
  let addGameUseCase: AddGameUseCase;
  let mockGameRepository: GameRepositoryInterface;

  beforeEach(() => {
    // Create a mock repository
    mockGameRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      delete: vi.fn(),
    };

    // Create use case with mocked repository
    addGameUseCase = new AddGameUseCase(mockGameRepository);
  });

  describe('execute', () => {
    it('should successfully add a valid game', async () => {
      // Arrange
      const dto = new AddGameDTO(
        'game-123',
        'The Legend of Zelda',
        'Classic adventure game',
        'Nintendo Switch',
        'Physical',
        new Date('2023-05-12'),
        'Owned',
      );

      vi.mocked(mockGameRepository.save).mockResolvedValue(Result.ok(undefined));

      // Act
      const result = await addGameUseCase.execute(dto);

      // Assert
      expect(result.isOk()).toBeTruthy();
      expect(mockGameRepository.save).toHaveBeenCalledTimes(1);

      // Verify that the repository was called with a Game entity
      const savedGame = vi.mocked(mockGameRepository.save).mock.calls[0]?.[0];
      expect(savedGame).toBeInstanceOf(Game);
      expect(savedGame?.getId()).toBe('game-123');
      expect(savedGame?.getTitle()).toBe('The Legend of Zelda');
    });

    it('should return validation error when domain validation fails (title too long)', async () => {
      // Arrange
      const longTitle = 'A'.repeat(201); // Exceeds 200 characters max
      const dto = new AddGameDTO(
        'game-123',
        longTitle,
        'Classic adventure game',
        'Nintendo Switch',
        'Physical',
        null,
        'Owned',
      );

      // Act
      const result = await addGameUseCase.execute(dto);

      // Assert
      expect(result.isErr()).toBeTruthy();
      const error = result.getError() as ValidationError;
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.type).toBe('Validation');
      expect(error.field).toBe('title');
      expect(mockGameRepository.save).not.toHaveBeenCalled();
    });

    it('should return validation error when domain validation fails (platform too long)', async () => {
      // Arrange
      const longPlatform = 'A'.repeat(101); // Exceeds 100 characters max
      const dto = new AddGameDTO(
        'game-123',
        'The Legend of Zelda',
        'Classic adventure game',
        longPlatform,
        'Physical',
        null,
        'Owned',
      );

      // Act
      const result = await addGameUseCase.execute(dto);

      // Assert
      expect(result.isErr()).toBeTruthy();
      const error = result.getError() as ValidationError;
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.field).toBe('platform');
      expect(mockGameRepository.save).not.toHaveBeenCalled();
    });

    it('should return validation error when domain validation fails (format too long)', async () => {
      // Arrange
      const longFormat = 'A'.repeat(51); // Exceeds 50 characters max
      const dto = new AddGameDTO(
        'game-123',
        'The Legend of Zelda',
        'Classic adventure game',
        'Nintendo Switch',
        longFormat,
        null,
        'Owned',
      );

      // Act
      const result = await addGameUseCase.execute(dto);

      // Assert
      expect(result.isErr()).toBeTruthy();
      const error = result.getError() as ValidationError;
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.field).toBe('format');
      expect(mockGameRepository.save).not.toHaveBeenCalled();
    });

    it('should return validation error when domain validation fails (invalid status)', async () => {
      // Arrange
      const dto = new AddGameDTO(
        'game-123',
        'The Legend of Zelda',
        'Classic adventure game',
        'Nintendo Switch',
        'Physical',
        null,
        'InvalidStatus', // Invalid status (not in enum)
      );

      // Act
      const result = await addGameUseCase.execute(dto);

      // Assert
      expect(result.isErr()).toBeTruthy();
      const error = result.getError() as ValidationError;
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.field).toBe('status');
      expect(mockGameRepository.save).not.toHaveBeenCalled();
    });

    it('should return repository error when save fails', async () => {
      // Arrange
      const dto = new AddGameDTO(
        'game-123',
        'The Legend of Zelda',
        'Classic adventure game',
        'Nintendo Switch',
        'Physical',
        null,
        'Owned',
      );

      const repositoryError = {
        message: 'Database connection failed',
        metadata: { code: 'DB_ERROR' },
      };

      vi.mocked(mockGameRepository.save).mockResolvedValue(Result.err(repositoryError));

      // Act
      const result = await addGameUseCase.execute(dto);

      // Assert
      expect(result.isErr()).toBeTruthy();
      const error = result.getError() as ValidationError;
      expect(error).toBeInstanceOf(RepositoryError);
      expect(error.type).toBe('Repository');
      expect(error.message).toContain('Failed to save game');
      expect(error.message).toContain('Database connection failed');
      expect(mockGameRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should handle purchase date correctly', async () => {
      // Arrange
      const purchaseDate = new Date('2023-05-12');
      const dto = new AddGameDTO(
        'game-123',
        'The Legend of Zelda',
        'Classic adventure game',
        'Nintendo Switch',
        'Physical',
        purchaseDate,
        'Owned',
      );

      vi.mocked(mockGameRepository.save).mockResolvedValue(Result.ok(undefined));

      // Act
      const result = await addGameUseCase.execute(dto);

      // Assert
      expect(result.isOk()).toBeTruthy();

      const savedGame = vi.mocked(mockGameRepository.save).mock.calls[0]?.[0];
      expect(savedGame?.getPurchaseDate()).toStrictEqual(purchaseDate);
    });

    it('should handle null purchase date (wishlist item)', async () => {
      // Arrange
      const dto = new AddGameDTO(
        'game-123',
        'The Legend of Zelda',
        'Classic adventure game',
        'Nintendo Switch',
        'Physical',
        null, // Null purchase date for wishlist
        'Wishlist',
      );

      vi.mocked(mockGameRepository.save).mockResolvedValue(Result.ok(undefined));

      // Act
      const result = await addGameUseCase.execute(dto);

      // Assert
      expect(result.isOk()).toBeTruthy();

      const savedGame = vi.mocked(mockGameRepository.save).mock.calls[0]?.[0];
      expect(savedGame?.getPurchaseDate()).toBeNull();
    });
  });
});
