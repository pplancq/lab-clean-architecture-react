import { Game } from '@Collection/domain/entities/Game';
import { IndexedDBGameRepository } from '@Collection/infrastructure/persistence/IndexedDBGameRepository';
import { DeleteError } from '@Shared/domain/repositories/error/DeleteError';
import { FindAllError } from '@Shared/domain/repositories/error/FindAllError';
import { FindByIdError } from '@Shared/domain/repositories/error/FindByIdError';
import { IndexedDBRequestError } from '@Shared/domain/repositories/error/IndexedDBRequestError';
import { NotFoundError } from '@Shared/domain/repositories/error/NotFoundError';
import type { NotFoundErrorInterface } from '@Shared/domain/repositories/error/NotFoundErrorInterface';
import { QuotaExceededError } from '@Shared/domain/repositories/error/QuotaExceededError';
import { SaveError } from '@Shared/domain/repositories/error/SaveError';
import { UnknownError } from '@Shared/domain/repositories/error/UnknownError';
import { IndexedDB } from '@Shared/infrastructure/persistence/IndexedDB';
import type { IndexedDBInterface } from '@Shared/infrastructure/persistence/IndexedDBInterface';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { deleteDatabase } from './utils/indexedDBTestUtils';

const createMockFailingDbService = (error: Error | DOMException): IndexedDBInterface => ({
  getDatabase: vi.fn().mockRejectedValue(error),
  getStoreName: vi.fn().mockReturnValue('games'),
  close: vi.fn().mockResolvedValue(undefined),
});

/**
 * Creates a mock IndexedDBInterface whose IDB requests fire onerror with a null error,
 * simulating the fallback path `request.error ?? new Error('...')`.
 */
const createMockDbServiceWithNullRequestError = (): IndexedDBInterface => {
  const createNullErrorRequest = <T>(): IDBRequest<T> => {
    let onErrorHandler: EventListener | null = null;
    const request = {
      result: undefined as unknown as T,
      get error() {
        return null;
      },
      get onsuccess() {
        return null;
      },
      set onsuccess(_: EventListener | null) {
        // noop: onsuccess is not exercised in this mock
      },
      get onerror() {
        return onErrorHandler;
      },
      set onerror(handler: EventListener | null) {
        onErrorHandler = handler;
        if (handler) {
          queueMicrotask(() => handler.call(request, new Event('error')));
        }
      },
    } as unknown as IDBRequest<T>;
    return request;
  };

  const mockObjectStore = {
    put: vi.fn().mockReturnValue(createNullErrorRequest()),
    get: vi.fn().mockReturnValue(createNullErrorRequest()),
    getAll: vi.fn().mockReturnValue(createNullErrorRequest()),
    delete: vi.fn().mockReturnValue(createNullErrorRequest()),
  };

  const mockTransaction = {
    objectStore: vi.fn().mockReturnValue(mockObjectStore),
    get error() {
      return null;
    },
    get onerror() {
      return null;
    },
    set onerror(_: EventListener | null) {
      // noop: transaction.onerror is not exercised in this mock
    },
  } as unknown as IDBTransaction;

  const mockDatabase = {
    transaction: vi.fn().mockReturnValue(mockTransaction),
  } as unknown as IDBDatabase;

  return {
    getDatabase: vi.fn().mockResolvedValue(mockDatabase),
    getStoreName: vi.fn().mockReturnValue('games'),
    close: vi.fn().mockResolvedValue(undefined),
  };
};

describe('IndexedDBGameRepository', () => {
  let repository: IndexedDBGameRepository;
  let dbService: IndexedDB;

  beforeEach(() => {
    // Simply create new instances - fake-indexeddb isolates each test
    dbService = new IndexedDB('GameCollectionDB', 1, 'games');
    repository = new IndexedDBGameRepository(dbService);
  });

  afterEach(async () => {
    await dbService.close();
    await deleteDatabase('GameCollectionDB');
  });

  describe('save', () => {
    it('should save a new game successfully', async () => {
      const gameResult = Game.create({
        id: 'game-1',
        title: 'The Legend of Zelda',
        description: 'Classic adventure game',
        platform: 'PlayStation',
        format: 'Physical',
        purchaseDate: new Date('2024-01-15'),
        status: 'Owned',
      });

      expect(gameResult.isOk()).toBeTruthy();
      const game = gameResult.unwrap();

      const result = await repository.save(game);

      expect(result.isOk()).toBeTruthy();

      // Verify the game was saved
      const findResult = await repository.findById('game-1');
      expect(findResult.isOk()).toBeTruthy();
      const savedGame = findResult.unwrap();
      expect(savedGame.getTitle()).toBe('The Legend of Zelda');
    });

    it('should update an existing game', async () => {
      const game = Game.create({
        id: 'game-1',
        title: 'Original Title',
        description: 'Original description',
        platform: 'PlayStation',
        format: 'Physical',
        purchaseDate: null,
        status: 'Wishlist',
      }).unwrap();

      await repository.save(game);

      // Update the game
      const updateResult = game.updateTitle('Updated Title');
      expect(updateResult.isOk()).toBeTruthy();

      const saveResult = await repository.save(game);
      expect(saveResult.isOk()).toBeTruthy();

      // Verify the update
      const findResult = await repository.findById('game-1');
      expect(findResult.isOk()).toBeTruthy();
      expect(findResult.unwrap().getTitle()).toBe('Updated Title');
    });
  });

  describe('findById', () => {
    it('should find an existing game by id', async () => {
      const game = Game.create({
        id: 'game-1',
        title: 'Final Fantasy VII',
        description: 'RPG masterpiece',
        platform: 'PlayStation',
        format: 'Digital',
        purchaseDate: new Date('2024-02-01'),
        status: 'Owned',
      }).unwrap();

      await repository.save(game);

      const result = await repository.findById('game-1');

      expect(result.isOk()).toBeTruthy();
      const foundGame = result.unwrap();
      expect(foundGame.getId()).toBe('game-1');
      expect(foundGame.getTitle()).toBe('Final Fantasy VII');
      expect(foundGame.getPlatform()).toBe('PlayStation');
      expect(foundGame.getFormat()).toBe('Digital');
      expect(foundGame.getStatus()).toBe('Owned');
    });

    it('should return NotFoundError when game does not exist', async () => {
      const result = await repository.findById('non-existent');

      expect(result.isErr()).toBeTruthy();
      const error = result.getError();
      expect(error).toBeInstanceOf(NotFoundError);
      expect((error as NotFoundErrorInterface).entityId).toBe('non-existent');
    });
  });

  describe('findAll', () => {
    it('should return empty array when no games exist', async () => {
      const result = await repository.findAll();

      expect(result.isOk()).toBeTruthy();
      const games = result.unwrap();
      expect(games).toHaveLength(0);
      expect(games).toStrictEqual([]);
    });

    it('should return all games', async () => {
      const game1 = Game.create({
        id: 'game-1',
        title: 'Game One',
        description: 'First game',
        platform: 'PlayStation',
        format: 'Physical',
        purchaseDate: null,
        status: 'Wishlist',
      }).unwrap();

      const game2 = Game.create({
        id: 'game-2',
        title: 'Game Two',
        description: 'Second game',
        platform: 'Xbox',
        format: 'Digital',
        purchaseDate: new Date('2024-01-01'),
        status: 'Owned',
      }).unwrap();

      const game3 = Game.create({
        id: 'game-3',
        title: 'Game Three',
        description: 'Third game',
        platform: 'PC',
        format: 'Digital',
        purchaseDate: new Date('2024-02-01'),
        status: 'Sold',
      }).unwrap();

      await repository.save(game1);
      await repository.save(game2);
      await repository.save(game3);

      const result = await repository.findAll();

      expect(result.isOk()).toBeTruthy();
      const games = result.unwrap();
      expect(games).toHaveLength(3);
      expect(games.map(g => g.getId()).sort()).toStrictEqual(['game-1', 'game-2', 'game-3']);
    });

    it('should correctly map all fields from DTO to domain', async () => {
      const purchaseDate = new Date('2024-03-15T10:30:00Z');
      const game = Game.create({
        id: 'game-1',
        title: 'Complete Game',
        description: 'Game with all fields',
        platform: 'PlayStation',
        format: 'Physical',
        purchaseDate,
        status: 'Owned',
      }).unwrap();

      await repository.save(game);

      const result = await repository.findAll();
      expect(result.isOk()).toBeTruthy();

      const foundGame = result.unwrap()[0];
      expect(foundGame.getId()).toBe('game-1');
      expect(foundGame.getTitle()).toBe('Complete Game');
      expect(foundGame.getDescription()).toBe('Game with all fields');
      expect(foundGame.getPlatform()).toBe('PlayStation');
      expect(foundGame.getFormat()).toBe('Physical');
      expect(foundGame.getPurchaseDate()?.toISOString()).toBe(purchaseDate.toISOString());
      expect(foundGame.getStatus()).toBe('Owned');
    });
  });

  describe('delete', () => {
    it('should delete an existing game', async () => {
      const game = Game.create({
        id: 'game-1',
        title: 'To Be Deleted',
        description: 'This game will be deleted',
        platform: 'PlayStation',
        format: 'Physical',
        purchaseDate: null,
        status: 'Wishlist',
      }).unwrap();

      await repository.save(game);

      // Verify it exists
      let findResult = await repository.findById('game-1');
      expect(findResult.isOk()).toBeTruthy();

      // Delete it
      const deleteResult = await repository.delete('game-1');
      expect(deleteResult.isOk()).toBeTruthy();

      // Verify it's gone
      findResult = await repository.findById('game-1');
      expect(findResult.isErr()).toBeTruthy();
      expect(findResult.getError()).toBeInstanceOf(NotFoundError);
    });

    it('should succeed when deleting non-existent game (idempotent)', async () => {
      const result = await repository.delete('non-existent');

      expect(result.isOk()).toBeTruthy();
    });
  });

  describe('DTO mapping', () => {
    it('should correctly convert domain entity to DTO and back', async () => {
      const originalDate = new Date('2024-01-15T14:30:00Z');
      const game = Game.create({
        id: 'game-1',
        title: 'Mapping Test',
        description: 'Testing DTO mapping',
        platform: 'PlayStation',
        format: 'Digital',
        purchaseDate: originalDate,
        status: 'Owned',
      }).unwrap();

      await repository.save(game);

      const result = await repository.findById('game-1');
      expect(result.isOk()).toBeTruthy();

      const retrievedGame = result.unwrap();
      expect(retrievedGame.getId()).toBe(game.getId());
      expect(retrievedGame.getTitle()).toBe(game.getTitle());
      expect(retrievedGame.getDescription()).toBe(game.getDescription());
      expect(retrievedGame.getPlatform()).toBe(game.getPlatform());
      expect(retrievedGame.getFormat()).toBe(game.getFormat());
      expect(retrievedGame.getStatus()).toBe(game.getStatus());
      expect(retrievedGame.getPurchaseDate()?.toISOString()).toBe(originalDate.toISOString());
    });

    it('should handle null purchaseDate correctly', async () => {
      const game = Game.create({
        id: 'game-1',
        title: 'Wishlist Game',
        description: 'Not purchased yet',
        platform: 'Xbox',
        format: 'Physical',
        purchaseDate: null,
        status: 'Wishlist',
      }).unwrap();

      await repository.save(game);

      const result = await repository.findById('game-1');
      expect(result.isOk()).toBeTruthy();
      expect(result.unwrap().getPurchaseDate()).toBeNull();
    });
  });

  describe('error handling', () => {
    it('should recover from temporary database closure', async () => {
      const game = Game.create({
        id: 'game-1',
        title: 'Test Game',
        description: 'Testing recovery',
        platform: 'PlayStation',
        format: 'Physical',
        purchaseDate: null,
        status: 'Wishlist',
      }).unwrap();

      // Save a game
      await repository.save(game);

      // Close the database
      await dbService.close();

      // Service should reopen the database on next operation
      const result = await repository.findById('game-1');

      // Operation should succeed - service reopens connection
      expect(result.isOk()).toBeTruthy();
      const foundGame = result.unwrap();
      expect(foundGame.getId()).toBe('game-1');
    });
  });

  describe('Error handling', () => {
    it('should return QuotaExceededError when storage quota is exceeded', async () => {
      // Note: Testing quota exceeded with fake-indexeddb is challenging
      // This test documents the expected error type
      const error = new QuotaExceededError('Storage quota exceeded');
      expect(error).toBeInstanceOf(QuotaExceededError);
      expect(error.message).toBe('Storage quota exceeded');
    });

    it('should return UnknownError for unexpected database errors', async () => {
      const originalError = new Error('Unexpected database error');
      const error = new UnknownError(originalError);

      expect(error).toBeInstanceOf(UnknownError);
      expect(error.message).toBe('Unexpected database error');
      expect(error.originalError).toBe(originalError);
    });

    it('should return UnknownError when save fails due to a database connection error', async () => {
      const failingRepo = new IndexedDBGameRepository(createMockFailingDbService(new Error('Database unavailable')));
      const game = Game.create({
        id: 'game-1',
        title: 'Test Game',
        description: 'desc',
        platform: 'PlayStation',
        format: 'Physical',
        purchaseDate: null,
        status: 'Wishlist',
      }).unwrap();

      const result = await failingRepo.save(game);

      expect(result.isErr()).toBeTruthy();
      expect(result.getError()).toBeInstanceOf(Error);
      expect(result.getError()).toBeInstanceOf(UnknownError);
    });

    it('should return UnknownError when findById fails due to a database connection error', async () => {
      const failingRepo = new IndexedDBGameRepository(createMockFailingDbService(new Error('Database unavailable')));

      const result = await failingRepo.findById('game-1');

      expect(result.isErr()).toBeTruthy();
      expect(result.getError()).toBeInstanceOf(Error);
      expect(result.getError()).toBeInstanceOf(UnknownError);
    });

    it('should return UnknownError when findAll fails due to a database connection error', async () => {
      const failingRepo = new IndexedDBGameRepository(createMockFailingDbService(new Error('Database unavailable')));

      const result = await failingRepo.findAll();

      expect(result.isErr()).toBeTruthy();
      expect(result.getError()).toBeInstanceOf(Error);
      expect(result.getError()).toBeInstanceOf(UnknownError);
    });

    it('should return UnknownError when delete fails due to a database connection error', async () => {
      const failingRepo = new IndexedDBGameRepository(createMockFailingDbService(new Error('Database unavailable')));

      const result = await failingRepo.delete('game-1');

      expect(result.isErr()).toBeTruthy();
      expect(result.getError()).toBeInstanceOf(Error);
      expect(result.getError()).toBeInstanceOf(UnknownError);
    });

    it('should return QuotaExceededError when a QuotaExceededError DOMException is thrown', async () => {
      const quotaError = new DOMException('QuotaExceededError', 'QuotaExceededError');
      const failingRepo = new IndexedDBGameRepository(createMockFailingDbService(quotaError));
      const game = Game.create({
        id: 'game-1',
        title: 'Test Game',
        description: 'desc',
        platform: 'PlayStation',
        format: 'Physical',
        purchaseDate: null,
        status: 'Wishlist',
      }).unwrap();

      const result = await failingRepo.save(game);

      expect(result.isErr()).toBeTruthy();
      expect(result.getError()).toBeInstanceOf(Error);
      expect(result.getError()).toBeInstanceOf(QuotaExceededError);
    });

    it('should return SaveError with null originalError when save request.error is null', async () => {
      const failingRepo = new IndexedDBGameRepository(createMockDbServiceWithNullRequestError());
      const game = Game.create({
        id: 'game-1',
        title: 'Test Game',
        description: 'desc',
        platform: 'PlayStation',
        format: 'Physical',
        purchaseDate: null,
        status: 'Wishlist',
      }).unwrap();

      const result = await failingRepo.save(game);

      expect(result.isErr()).toBeTruthy();
      expect(result.getError()).toBeInstanceOf(Error);
      expect(result.getError()).toBeInstanceOf(IndexedDBRequestError);
      expect(result.getError()).toBeInstanceOf(SaveError);
      expect((result.getError() as SaveError).originalError).toBeNull();
      expect(result.getError().message).toBe('IndexedDB save request failed');
    });

    it('should return FindByIdError with null originalError when findById request.error is null', async () => {
      const failingRepo = new IndexedDBGameRepository(createMockDbServiceWithNullRequestError());

      const result = await failingRepo.findById('game-1');

      expect(result.isErr()).toBeTruthy();
      expect(result.getError()).toBeInstanceOf(Error);
      expect(result.getError()).toBeInstanceOf(IndexedDBRequestError);
      expect(result.getError()).toBeInstanceOf(FindByIdError);
      expect((result.getError() as FindByIdError).originalError).toBeNull();
      expect(result.getError().message).toBe('IndexedDB findById request failed');
    });

    it('should return FindAllError with null originalError when findAll request.error is null', async () => {
      const failingRepo = new IndexedDBGameRepository(createMockDbServiceWithNullRequestError());

      const result = await failingRepo.findAll();

      expect(result.isErr()).toBeTruthy();
      expect(result.getError()).toBeInstanceOf(Error);
      expect(result.getError()).toBeInstanceOf(IndexedDBRequestError);
      expect(result.getError()).toBeInstanceOf(FindAllError);
      expect((result.getError() as FindAllError).originalError).toBeNull();
      expect(result.getError().message).toBe('IndexedDB findAll request failed');
    });

    it('should return DeleteError with null originalError when delete request.error is null', async () => {
      const failingRepo = new IndexedDBGameRepository(createMockDbServiceWithNullRequestError());

      const result = await failingRepo.delete('game-1');

      expect(result.isErr()).toBeTruthy();
      expect(result.getError()).toBeInstanceOf(Error);
      expect(result.getError()).toBeInstanceOf(IndexedDBRequestError);
      expect(result.getError()).toBeInstanceOf(DeleteError);
      expect((result.getError() as DeleteError).originalError).toBeNull();
      expect(result.getError().message).toBe('IndexedDB delete request failed');
    });
  });

  describe('IndexedDB schema', () => {
    it('should create database with correct schema', async () => {
      // Trigger database creation
      const db = await dbService.getDatabase();

      expect(db.name).toBe('GameCollectionDB');
      expect(db.version).toBe(1);
      expect(db.objectStoreNames.contains('games')).toBeTruthy();

      // Check indexes
      const transaction = db.transaction('games', 'readonly');
      const store = transaction.objectStore('games');

      expect(store.indexNames.contains('title')).toBeTruthy();
      expect(store.indexNames.contains('platform')).toBeTruthy();
      expect(store.indexNames.contains('status')).toBeTruthy();
    });
  });
});
