import { describe, it, expect } from 'vitest';
import { GameId } from '@Collection/domain/value-objects/GameId';

describe('GameId', () => {
  describe('create', () => {
    it('should create a valid GameId', () => {
      const result = GameId.create('game-123');

      expect(result.isOk()).toBeTruthy();
      const gameId = result.unwrap();
      expect(gameId.getId()).toBe('game-123');
    });

    it('should trim whitespace from value', () => {
      const result = GameId.create('  game-123  ');

      expect(result.isOk()).toBeTruthy();
      const gameId = result.unwrap();
      expect(gameId.getId()).toBe('game-123');
    });

    it('should return error for empty string', () => {
      const result = GameId.create('');

      expect(result.isErr()).toBeTruthy();
      const error = result.getError();
      expect(error.field).toBe('gameId');
      expect(error.message).toBe('GameId cannot be empty');
    });

    it('should return error for whitespace-only string', () => {
      const result = GameId.create('   ');

      expect(result.isErr()).toBeTruthy();
      const error = result.getError();
      expect(error.field).toBe('gameId');
      expect(error.message).toBe('GameId cannot be empty');
    });
  });

  describe('getId', () => {
    it('should return the value', () => {
      const gameId = GameId.create('game-123').unwrap();

      expect(gameId.getId()).toBe('game-123');
    });
  });
});
