import { ToastMessage } from '@Toast/domain/value-objects/ToastMessage';
import { describe, expect, it } from 'vitest';

describe('ToastMessage', () => {
  describe('create', () => {
    it('should create a valid ToastMessage', () => {
      const result = ToastMessage.create('Hello World');

      expect(result.isOk()).toBeTruthy();
      expect(result.unwrap().getValue()).toBe('Hello World');
    });

    it('should trim whitespace from value', () => {
      const result = ToastMessage.create('  Hello World  ');

      expect(result.isOk()).toBeTruthy();
      expect(result.unwrap().getValue()).toBe('Hello World');
    });

    it('should return error for empty string', () => {
      const result = ToastMessage.create('');

      expect(result.isErr()).toBeTruthy();
      expect(result.getError().field).toBe('message');
      expect(result.getError().message).toBe('message cannot be empty');
    });

    it('should return error for whitespace-only string', () => {
      const result = ToastMessage.create('   ');

      expect(result.isErr()).toBeTruthy();
      expect(result.getError().field).toBe('message');
    });
  });

  describe('getValue', () => {
    it('should return the trimmed message value', () => {
      const message = ToastMessage.create('Saved!').unwrap();

      expect(message.getValue()).toBe('Saved!');
    });
  });
});
