import { ToastType } from '@Toast/domain/value-objects/ToastType';
import { describe, expect, it } from 'vitest';

describe('ToastType', () => {
  describe('create', () => {
    it.each(['success', 'error', 'info', 'warning'] as const)('should create a valid ToastType for "%s"', type => {
      const result = ToastType.create(type);

      expect(result.isOk()).toBeTruthy();
      expect(result.unwrap().getValue()).toBe(type);
    });

    it('should return error for invalid type', () => {
      const result = ToastType.create('invalid');

      expect(result.isErr()).toBeTruthy();
      expect(result.getError().field).toBe('type');
    });

    it('should return error for empty string', () => {
      const result = ToastType.create('');

      expect(result.isErr()).toBeTruthy();
      expect(result.getError().field).toBe('type');
    });

    it('should return error for case-sensitive mismatch', () => {
      const result = ToastType.create('SUCCESS');

      expect(result.isErr()).toBeTruthy();
    });
  });

  describe('getValue', () => {
    it('should return the type value', () => {
      const type = ToastType.create('success').unwrap();

      expect(type.getValue()).toBe('success');
    });
  });
});
