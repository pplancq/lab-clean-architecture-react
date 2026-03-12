import { ToastId } from '@Toast/domain/value-objects/ToastId';
import { describe, expect, it } from 'vitest';

describe('ToastId', () => {
  describe('create', () => {
    it('should create a valid ToastId', () => {
      const result = ToastId.create('toast-123');

      expect(result.isOk()).toBeTruthy();
      expect(result.unwrap().getValue()).toBe('toast-123');
    });

    it('should trim whitespace from value', () => {
      const result = ToastId.create('  toast-123  ');

      expect(result.isOk()).toBeTruthy();
      expect(result.unwrap().getValue()).toBe('toast-123');
    });

    it('should return error for empty string', () => {
      const result = ToastId.create('');

      expect(result.isErr()).toBeTruthy();
      expect(result.getError().field).toBe('id');
      expect(result.getError().message).toBe('id cannot be empty');
    });

    it('should return error for whitespace-only string', () => {
      const result = ToastId.create('   ');

      expect(result.isErr()).toBeTruthy();
      expect(result.getError().field).toBe('id');
    });
  });

  describe('getValue', () => {
    it('should return the trimmed ID value', () => {
      const id = ToastId.create('toast-abc').unwrap();

      expect(id.getValue()).toBe('toast-abc');
    });
  });
});
