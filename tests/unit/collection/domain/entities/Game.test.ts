import { describe, it, expect } from 'vitest';
import { Game } from '@Collection/domain/entities/Game';

describe('Game', () => {
  describe('create', () => {
    it('should create a valid Game from primitives', () => {
      const result = Game.create({
        id: 'game-123',
        title: 'The Legend of Zelda: Breath of the Wild',
        description: 'An epic adventure in the kingdom of Hyrule',
        platform: 'Nintendo Switch',
        format: 'Physical',
        purchaseDate: new Date('2024-01-15'),
        status: 'Owned',
      });

      expect(result.isOk()).toBeTruthy();
      const game = result.unwrap();
      expect(game.getTitle()).toBe('The Legend of Zelda: Breath of the Wild');
      expect(game.getDescription()).toBe('An epic adventure in the kingdom of Hyrule');
      expect(game.getPlatform()).toBe('Nintendo Switch');
      expect(game.getFormat()).toBe('Physical');
      expect(game.getStatus()).toBe('Owned');
    });

    it('should create a Game with null purchase date', () => {
      const result = Game.create({
        id: 'game-123',
        title: 'Elden Ring',
        description: 'An action RPG set in the Lands Between',
        platform: 'PlayStation 5',
        format: 'Digital',
        purchaseDate: null,
        status: 'Wishlist',
      });

      expect(result.isOk()).toBeTruthy();
      const game = result.unwrap();
      expect(game.getPurchaseDate()).toBeNull();
    });

    it('should create a Game with empty description', () => {
      const result = Game.create({
        id: 'game-123',
        title: 'Hades',
        description: '',
        platform: 'PC',
        format: 'Digital',
        purchaseDate: new Date(),
        status: 'Owned',
      });

      expect(result.isOk()).toBeTruthy();
      const game = result.unwrap();
      expect(game.getDescription()).toBe('');
    });

    it('should return error for empty title', () => {
      const result = Game.create({
        id: 'game-123',
        title: '',
        description: 'Description',
        platform: 'Xbox Series X',
        format: 'Physical',
        purchaseDate: new Date(),
        status: 'Owned',
      });

      expect(result.isErr()).toBeTruthy();
      const error = result.getError();
      expect(error.field).toBe('title');
      expect(error.message).toBe('Game title cannot be empty');
    });

    it('should return error for title exceeding 200 characters', () => {
      const longTitle = 'a'.repeat(201);
      const result = Game.create({
        id: 'game-123',
        title: longTitle,
        description: 'Description',
        platform: 'PlayStation 5',
        format: 'Physical',
        purchaseDate: new Date(),
        status: 'Owned',
      });

      expect(result.isErr()).toBeTruthy();
      const error = result.getError();
      expect(error.field).toBe('title');
      expect(error.message).toBe('Game title cannot exceed 200 characters');
    });

    it('should return error for description exceeding 1000 characters', () => {
      const longDescription = 'a'.repeat(1001);
      const result = Game.create({
        id: 'game-123',
        title: 'Valid Title',
        description: longDescription,
        platform: 'Nintendo Switch',
        format: 'Physical',
        purchaseDate: new Date(),
        status: 'Owned',
      });

      expect(result.isErr()).toBeTruthy();
      const error = result.getError();
      expect(error.field).toBe('description');
      expect(error.message).toBe('Game description cannot exceed 1000 characters');
    });

    it('should return error for empty platform', () => {
      const result = Game.create({
        id: 'game-123',
        title: 'Valid Title',
        description: 'Description',
        platform: '',
        format: 'Physical',
        purchaseDate: new Date(),
        status: 'Owned',
      });

      expect(result.isErr()).toBeTruthy();
      const error = result.getError();
      expect(error.field).toBe('platform');
      expect(error.message).toBe('Platform name is required');
    });

    it('should return error for empty format', () => {
      const result = Game.create({
        id: 'game-123',
        title: 'Valid Title',
        description: 'Description',
        platform: 'PC',
        format: '',
        purchaseDate: new Date(),
        status: 'Owned',
      });

      expect(result.isErr()).toBeTruthy();
      const error = result.getError();
      expect(error.field).toBe('format');
      expect(error.message).toBe('Format name is required');
    });

    it('should return error for invalid status', () => {
      const result = Game.create({
        id: 'game-123',
        title: 'Valid Title',
        description: 'Description',
        platform: 'Xbox Series X',
        format: 'Physical',
        purchaseDate: new Date(),
        status: 'InvalidStatus',
      });

      expect(result.isErr()).toBeTruthy();
      const error = result.getError();
      expect(error.field).toBe('status');
    });
  });

  describe('getters', () => {
    it('should return all properties through getters', () => {
      const purchaseDate = new Date('2024-01-15');
      const game = Game.create({
        id: 'game-123',
        title: 'God of War Ragnarök',
        description: 'The epic sequel to God of War',
        platform: 'PlayStation 5',
        format: 'Physical',
        purchaseDate,
        status: 'Owned',
      }).unwrap();

      expect(game.getId()).toBe('game-123');
      expect(game.getTitle()).toBe('God of War Ragnarök');
      expect(game.getDescription()).toBe('The epic sequel to God of War');
      expect(game.getPlatform()).toBe('PlayStation 5');
      expect(game.getFormat()).toBe('Physical');
      expect(game.getPurchaseDate()).toBe(purchaseDate);
      expect(game.getStatus()).toBe('Owned');
    });
  });

  describe('updateTitle', () => {
    it('should update title with valid value', () => {
      const game = Game.create({
        id: 'game-123',
        title: 'Original Title',
        description: 'Description',
        platform: 'PC',
        format: 'Digital',
        purchaseDate: new Date(),
        status: 'Owned',
      }).unwrap();

      const updateResult = game.updateTitle('New Title');

      expect(updateResult.isOk()).toBeTruthy();
      expect(game.getTitle()).toBe('New Title');
    });

    it('should return error for empty title', () => {
      const game = Game.create({
        id: 'game-123',
        title: 'Original Title',
        description: 'Description',
        platform: 'Steam Deck',
        format: 'Digital',
        purchaseDate: new Date(),
        status: 'Owned',
      }).unwrap();

      const updateResult = game.updateTitle('');

      expect(updateResult.isErr()).toBeTruthy();
      expect(game.getTitle()).toBe('Original Title');
    });

    it('should return error for title exceeding 200 characters', () => {
      const game = Game.create({
        id: 'game-123',
        title: 'Original Title',
        description: 'Description',
        platform: 'Xbox Series S',
        format: 'Digital',
        purchaseDate: new Date(),
        status: 'Owned',
      }).unwrap();

      const longTitle = 'a'.repeat(201);
      const updateResult = game.updateTitle(longTitle);

      expect(updateResult.isErr()).toBeTruthy();
      expect(game.getTitle()).toBe('Original Title');
    });
  });

  describe('updateDescription', () => {
    it('should update description with valid value', () => {
      const game = Game.create({
        id: 'game-123',
        title: 'Title',
        description: 'Original Description',
        platform: 'Nintendo Switch OLED',
        format: 'Physical',
        purchaseDate: new Date(),
        status: 'Owned',
      }).unwrap();

      const updateResult = game.updateDescription('New Description');

      expect(updateResult.isOk()).toBeTruthy();
      expect(game.getDescription()).toBe('New Description');
    });

    it('should return error for description exceeding 1000 characters', () => {
      const game = Game.create({
        id: 'game-123',
        title: 'Title',
        description: 'Original Description',
        platform: 'PlayStation 4',
        format: 'Physical',
        purchaseDate: new Date(),
        status: 'Owned',
      }).unwrap();

      const longDescription = 'a'.repeat(1001);
      const updateResult = game.updateDescription(longDescription);

      expect(updateResult.isErr()).toBeTruthy();
      expect(game.getDescription()).toBe('Original Description');
    });
  });

  describe('updatePurchaseDate', () => {
    it('should update purchase date', () => {
      const game = Game.create({
        id: 'game-123',
        title: 'Title',
        description: 'Description',
        platform: 'Xbox One',
        format: 'Physical',
        purchaseDate: new Date('2024-01-15'),
        status: 'Owned',
      }).unwrap();

      const newDate = new Date('2024-02-20');
      game.updatePurchaseDate(newDate);

      expect(game.getPurchaseDate()).toBe(newDate);
    });

    it('should allow setting purchase date to null', () => {
      const game = Game.create({
        id: 'game-123',
        title: 'Title',
        description: 'Description',
        platform: 'PlayStation Vita',
        format: 'Physical',
        purchaseDate: new Date('2024-01-15'),
        status: 'Owned',
      }).unwrap();

      game.updatePurchaseDate(null);

      expect(game.getPurchaseDate()).toBeNull();
    });
  });

  describe('updateStatus', () => {
    it('should update status', () => {
      const game = Game.create({
        id: 'game-123',
        title: 'Title',
        description: 'Description',
        platform: 'PC',
        format: 'Digital',
        purchaseDate: new Date(),
        status: 'Owned',
      }).unwrap();

      const result = game.updateStatus('Wishlist');

      expect(result.isOk()).toBeTruthy();
      expect(game.getStatus()).toBe('Wishlist');
    });

    it('should return error for invalid status', () => {
      const game = Game.create({
        id: 'game-123',
        title: 'Title',
        description: 'Description',
        platform: 'PC',
        format: 'Digital',
        purchaseDate: new Date(),
        status: 'Owned',
      }).unwrap();

      const result = game.updateStatus('InvalidStatus');

      expect(result.isErr()).toBeTruthy();
      expect(result.getError().field).toBe('status');
    });
  });

  describe('isPurchasedAfter', () => {
    it('should return true if game was purchased after date', () => {
      const game = Game.create({
        id: 'game-123',
        title: 'Title',
        description: 'Description',
        platform: 'Nintendo 3DS',
        format: 'Physical',
        purchaseDate: new Date('2024-03-15'),
        status: 'Owned',
      }).unwrap();

      expect(game.isPurchasedAfter(new Date('2024-01-01'))).toBeTruthy();
    });

    it('should return false if game was purchased before date', () => {
      const game = Game.create({
        id: 'game-123',
        title: 'Title',
        description: 'Description',
        platform: 'Wii U',
        format: 'Physical',
        purchaseDate: new Date('2024-01-15'),
        status: 'Owned',
      }).unwrap();

      expect(game.isPurchasedAfter(new Date('2024-03-01'))).toBeFalsy();
    });

    it('should return false if purchase date is null', () => {
      const game = Game.create({
        id: 'game-123',
        title: 'Title',
        description: 'Description',
        platform: 'Steam Deck',
        format: 'Digital',
        purchaseDate: null,
        status: 'Wishlist',
      }).unwrap();

      expect(game.isPurchasedAfter(new Date('2024-01-01'))).toBeFalsy();
    });
  });

  describe('isInWishlist', () => {
    it('should return true for wishlist status', () => {
      const game = Game.create({
        id: 'game-123',
        title: 'Title',
        description: 'Description',
        platform: 'PlayStation 5',
        format: 'Digital',
        purchaseDate: null,
        status: 'Wishlist',
      }).unwrap();

      expect(game.isInWishlist()).toBeTruthy();
    });

    it('should return false for non-wishlist status', () => {
      const game = Game.create({
        id: 'game-123',
        title: 'Title',
        description: 'Description',
        platform: 'Xbox Series X',
        format: 'Physical',
        purchaseDate: new Date(),
        status: 'Owned',
      }).unwrap();

      expect(game.isInWishlist()).toBeFalsy();
    });
  });

  describe('isOwned', () => {
    it('should return true for owned status', () => {
      const game = Game.create({
        id: 'game-123',
        title: 'Title',
        description: 'Description',
        platform: 'Nintendo Switch',
        format: 'Physical',
        purchaseDate: new Date(),
        status: 'Owned',
      }).unwrap();

      expect(game.isOwned()).toBeTruthy();
    });

    it('should return false for non-owned status', () => {
      const game = Game.create({
        id: 'game-123',
        title: 'Title',
        description: 'Description',
        platform: 'PC',
        format: 'Digital',
        purchaseDate: null,
        status: 'Wishlist',
      }).unwrap();

      expect(game.isOwned()).toBeFalsy();
    });
  });
});
