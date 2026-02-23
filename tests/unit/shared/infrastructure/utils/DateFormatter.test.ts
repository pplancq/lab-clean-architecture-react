import { DateFormatter } from '@Shared/infrastructure/utils/DateFormatter';
import { describe, expect, it } from 'vitest';

describe('DateFormatter', () => {
  const formatter = new DateFormatter();

  describe('toLocalDateString', () => {
    it('should format a date as YYYY-MM-DD using local timezone', () => {
      const date = new Date(2024, 2, 15); // March 15, 2024 — local midnight

      expect(formatter.toLocalDateString(date)).toBe('2024-03-15');
    });

    it('should pad month and day with leading zeros', () => {
      const date = new Date(2024, 0, 5); // January 5, 2024

      expect(formatter.toLocalDateString(date)).toBe('2024-01-05');
    });

    it('should handle end of year', () => {
      const date = new Date(2024, 11, 31); // December 31, 2024

      expect(formatter.toLocalDateString(date)).toBe('2024-12-31');
    });
  });

  describe('fromLocalDateString', () => {
    it('should parse a YYYY-MM-DD string to a local midnight Date', () => {
      const date = formatter.fromLocalDateString('2024-03-15');

      expect(date.getFullYear()).toBe(2024);
      expect(date.getMonth()).toBe(2); // March = 2
      expect(date.getDate()).toBe(15);
    });

    it('should set time to midnight in local timezone', () => {
      const date = formatter.fromLocalDateString('2024-03-15');

      expect(date.getHours()).toBe(0);
      expect(date.getMinutes()).toBe(0);
      expect(date.getSeconds()).toBe(0);
    });

    it('should correctly parse January dates', () => {
      const date = formatter.fromLocalDateString('2024-01-05');

      expect(date.getMonth()).toBe(0); // January = 0
      expect(date.getDate()).toBe(5);
    });
  });

  describe('round-trip', () => {
    it('should round-trip correctly: fromLocalDateString → toLocalDateString', () => {
      const original = '2024-06-20';
      const date = formatter.fromLocalDateString(original);

      expect(formatter.toLocalDateString(date)).toBe(original);
    });
  });
});
