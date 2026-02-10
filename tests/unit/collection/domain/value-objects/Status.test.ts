import { describe, it, expect } from 'vitest';
import { Status, StatusType } from '@Collection/domain/value-objects/Status';

describe('Status', () => {
  describe('create', () => {
    it('should create a valid Status from string', () => {
      const result = Status.create('Owned');

      expect(result.isOk()).toBeTruthy();
      const status = result.unwrap();
      expect(status.getStatus()).toBe(StatusType.OWNED);
    });

    it('should be case-insensitive', () => {
      const result = Status.create('wishlist');

      expect(result.isOk()).toBeTruthy();
      const status = result.unwrap();
      expect(status.getStatus()).toBe(StatusType.WISHLIST);
    });

    it('should create Status for all valid types', () => {
      const validStatuses = ['Owned', 'Wishlist', 'Sold', 'Loaned'];

      validStatuses.forEach(statusName => {
        const result = Status.create(statusName);
        expect(result.isOk()).toBeTruthy();
      });
    });

    it('should return error for invalid status', () => {
      const result = Status.create('InvalidStatus');

      expect(result.isErr()).toBeTruthy();
      const error = result.getError();
      expect(error.field).toBe('status');
      expect(error.message).toContain('Invalid status');
      expect(error.message).toContain('Owned');
    });
  });

  describe('createFromEnum', () => {
    it('should create Status from enum value', () => {
      const status = Status.createFromEnum(StatusType.OWNED);

      expect(status.getStatus()).toBe(StatusType.OWNED);
    });
  });

  describe('getStatus', () => {
    it('should return the status type', () => {
      const status = Status.create('Sold').unwrap();

      expect(status.getStatus()).toBe(StatusType.SOLD);
    });
  });
});
