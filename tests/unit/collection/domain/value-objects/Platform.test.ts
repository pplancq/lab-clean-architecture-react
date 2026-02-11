import { describe, it, expect } from 'vitest';
import { Platform } from '@Collection/domain/value-objects/Platform';

describe('Platform', () => {
  describe('create', () => {
    it('should create a valid Platform', () => {
      const result = Platform.create('PlayStation 5');

      expect(result.isOk()).toBeTruthy();
      const platform = result.unwrap();
      expect(platform.getPlatform()).toBe('PlayStation 5');
    });

    it('should create Platform with different gaming systems', () => {
      const platforms = [
        'PlayStation 5',
        'Xbox Series X',
        'Nintendo Switch OLED',
        'PC',
        'Steam Deck',
        'PlayStation Vita',
      ];

      platforms.forEach(name => {
        const result = Platform.create(name);
        expect(result.isOk()).toBeTruthy();
        expect(result.unwrap().getPlatform()).toBe(name);
      });
    });

    it('should trim platform name', () => {
      const result = Platform.create('  PlayStation 5  ');

      expect(result.isOk()).toBeTruthy();
      expect(result.unwrap().getPlatform()).toBe('PlayStation 5');
    });

    it('should return error for empty platform', () => {
      const result = Platform.create('');

      expect(result.isErr()).toBeTruthy();
      const error = result.getError();
      expect(error.field).toBe('platform');
      expect(error.message).toBe('Platform name is required');
    });

    it('should return error for whitespace-only platform', () => {
      const result = Platform.create('   ');

      expect(result.isErr()).toBeTruthy();
      const error = result.getError();
      expect(error.field).toBe('platform');
      expect(error.message).toBe('Platform name is required');
    });

    it('should return error for platform name exceeding 100 characters', () => {
      const longName = 'a'.repeat(101);
      const result = Platform.create(longName);

      expect(result.isErr()).toBeTruthy();
      const error = result.getError();
      expect(error.field).toBe('platform');
      expect(error.message).toBe('Platform name cannot exceed 100 characters');
    });

    it('should accept platform name with exactly 100 characters', () => {
      const maxName = 'a'.repeat(100);
      const result = Platform.create(maxName);

      expect(result.isOk()).toBeTruthy();
    });
  });
});
