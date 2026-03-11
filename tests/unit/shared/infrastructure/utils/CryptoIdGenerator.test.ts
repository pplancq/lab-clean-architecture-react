import { CryptoIdGenerator } from '@Shared/infrastructure/utils/CryptoIdGenerator';
import { describe, expect, it } from 'vitest';

describe('CryptoIdGenerator', () => {
  const generator = new CryptoIdGenerator();

  describe('generate', () => {
    it('should return a non-empty string', () => {
      const id = generator.generate();

      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    it('should return a valid UUID v4 format', () => {
      const id = generator.generate();
      const uuidV4Pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

      expect(id).toMatch(uuidV4Pattern);
    });

    it('should generate unique values on consecutive calls', () => {
      const id1 = generator.generate();
      const id2 = generator.generate();
      const id3 = generator.generate();

      expect(id1).not.toBe(id2);
      expect(id2).not.toBe(id3);
      expect(id1).not.toBe(id3);
    });
  });
});
