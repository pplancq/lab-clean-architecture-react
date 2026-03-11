import { ToastDuration } from '@Toast/domain/value-objects/ToastDuration';
import { describe, expect, it } from 'vitest';

describe('ToastDuration', () => {
  describe('create', () => {
    it('should create a valid ToastDuration', () => {
      const result = ToastDuration.create(3000);

      expect(result.isOk()).toBeTruthy();
      expect(result.unwrap().getValue()).toBe(3000);
    });

    it('should accept a duration of 1ms (minimum)', () => {
      const result = ToastDuration.create(1);

      expect(result.isOk()).toBeTruthy();
      expect(result.unwrap().getValue()).toBe(1);
    });

    it('should return error for zero duration', () => {
      const result = ToastDuration.create(0);

      expect(result.isErr()).toBeTruthy();
      expect(result.getError().field).toBe('duration');
      expect(result.getError().message).toBe('duration must be a positive number');
    });

    it('should return error for negative duration', () => {
      const result = ToastDuration.create(-1000);

      expect(result.isErr()).toBeTruthy();
      expect(result.getError().field).toBe('duration');
    });
  });

  describe('getValue', () => {
    it('should return the duration value', () => {
      const duration = ToastDuration.create(5000).unwrap();

      expect(duration.getValue()).toBe(5000);
    });
  });
});
