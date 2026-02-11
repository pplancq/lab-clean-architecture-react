import { describe, it, expect } from 'vitest';
import { GameDescription } from '@Collection/domain/value-objects/GameDescription';

describe('GameDescription', () => {
  describe('create', () => {
    it('should create a valid GameDescription', () => {
      const result = GameDescription.create('A classic adventure game');

      expect(result.isOk()).toBeTruthy();
      const description = result.unwrap();
      expect(description.getDescription()).toBe('A classic adventure game');
    });

    it('should accept empty string', () => {
      const result = GameDescription.create('');

      expect(result.isOk()).toBeTruthy();
      const description = result.unwrap();
      expect(description.getDescription()).toBe('');
    });

    it('should return error for description exceeding 1000 characters', () => {
      const longDescription = 'a'.repeat(1001);
      const result = GameDescription.create(longDescription);

      expect(result.isErr()).toBeTruthy();
      const error = result.getError();
      expect(error.field).toBe('description');
      expect(error.message).toBe('Game description cannot exceed 1000 characters');
    });

    it('should accept description with exactly 1000 characters', () => {
      const maxDescription = 'a'.repeat(1000);
      const result = GameDescription.create(maxDescription);

      expect(result.isOk()).toBeTruthy();
    });
  });

  describe('getDescription', () => {
    it('should return the value', () => {
      const description = GameDescription.create('A classic adventure game').unwrap();

      expect(description.getDescription()).toBe('A classic adventure game');
    });
  });
});
