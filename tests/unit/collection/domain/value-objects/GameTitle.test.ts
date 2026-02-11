import { describe, it, expect } from 'vitest';
import { GameTitle } from '@Collection/domain/value-objects/GameTitle';

describe('GameTitle', () => {
  describe('create', () => {
    it('should create a valid GameTitle', () => {
      const result = GameTitle.create('The Legend of Zelda');

      expect(result.isOk()).toBeTruthy();
      const title = result.unwrap();
      expect(title.getTitle()).toBe('The Legend of Zelda');
    });

    it('should trim whitespace from value', () => {
      const result = GameTitle.create('  The Legend of Zelda  ');

      expect(result.isOk()).toBeTruthy();
      const title = result.unwrap();
      expect(title.getTitle()).toBe('The Legend of Zelda');
    });

    it('should return error for empty string', () => {
      const result = GameTitle.create('');

      expect(result.isErr()).toBeTruthy();
      const error = result.getError();
      expect(error.field).toBe('title');
      expect(error.message).toBe('Game title cannot be empty');
    });

    it('should return error for whitespace-only string', () => {
      const result = GameTitle.create('   ');

      expect(result.isErr()).toBeTruthy();
      const error = result.getError();
      expect(error.field).toBe('title');
      expect(error.message).toBe('Game title cannot be empty');
    });

    it('should return error for title exceeding 200 characters', () => {
      const longTitle = 'a'.repeat(201);
      const result = GameTitle.create(longTitle);

      expect(result.isErr()).toBeTruthy();
      const error = result.getError();
      expect(error.field).toBe('title');
      expect(error.message).toBe('Game title cannot exceed 200 characters');
    });

    it('should accept title with exactly 200 characters', () => {
      const maxTitle = 'a'.repeat(200);
      const result = GameTitle.create(maxTitle);

      expect(result.isOk()).toBeTruthy();
    });
  });

  describe('getTitle', () => {
    it('should return the value', () => {
      const title = GameTitle.create('The Legend of Zelda').unwrap();

      expect(title.getTitle()).toBe('The Legend of Zelda');
    });
  });
});
