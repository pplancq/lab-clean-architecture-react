import { Toast } from '@Toast/domain/entities/Toast';
import { describe, expect, it } from 'vitest';

describe('Toast', () => {
  describe('create', () => {
    it('should create a valid Toast with all provided values', () => {
      const result = Toast.create({
        id: 'toast-123',
        message: 'Game saved',
        type: 'success',
        duration: 3000,
      });

      expect(result.isOk()).toBeTruthy();

      const toast = result.unwrap();
      expect(toast.getId()).toBe('toast-123');
      expect(toast.getMessage()).toBe('Game saved');
      expect(toast.getType()).toBe('success');
      expect(toast.getDuration()).toBe(3000);
    });

    it.each(['success', 'error', 'info', 'warning'] as const)('should accept type "%s"', type => {
      const result = Toast.create({ id: 'id', message: 'msg', type, duration: 1000 });

      expect(result.isOk()).toBeTruthy();
      expect(result.unwrap().getType()).toBe(type);
    });

    it('should return error when id is empty', () => {
      const result = Toast.create({ id: '', message: 'msg', type: 'info', duration: 3000 });

      expect(result.isErr()).toBeTruthy();
      expect(result.getError().field).toBe('id');
    });

    it('should return error when message is empty', () => {
      const result = Toast.create({ id: 'id', message: '', type: 'info', duration: 3000 });

      expect(result.isErr()).toBeTruthy();
      expect(result.getError().field).toBe('message');
    });

    it('should return error for an invalid type', () => {
      const result = Toast.create({ id: 'id', message: 'msg', type: 'critical' as never, duration: 3000 });

      expect(result.isErr()).toBeTruthy();
      expect(result.getError().field).toBe('type');
    });

    it('should return error for a non-positive duration', () => {
      const result = Toast.create({ id: 'id', message: 'msg', type: 'info', duration: 0 });

      expect(result.isErr()).toBeTruthy();
      expect(result.getError().field).toBe('duration');
    });
  });
});
