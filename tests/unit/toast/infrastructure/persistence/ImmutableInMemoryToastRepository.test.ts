/* eslint-disable testing-library/await-async-queries -- repository.findById() is not a Testing Library query */
import { Toast } from '@Toast/domain/entities/Toast';
import { ImmutableInMemoryToastRepository } from '@Toast/infrastructure/persistence/ImmutableInMemoryToastRepository';
import { describe, expect, it } from 'vitest';

const createToast = (message = 'Hello', type: 'success' | 'info' | 'error' | 'warning' = 'info') => {
  const result = Toast.create({ id: globalThis.crypto.randomUUID(), message, type, duration: 500 });
  return result.unwrap();
};

describe('ImmutableInMemoryToastRepository', () => {
  describe('add', () => {
    it('should add a toast and include it in getAll()', () => {
      const repository = new ImmutableInMemoryToastRepository();
      const toast = createToast('Game saved', 'success');

      repository.add(toast);

      expect(repository.getAll().unwrap()).toHaveLength(1);
      expect(repository.getAll().unwrap()[0]).toBe(toast);
    });

    it('should support adding multiple toasts', () => {
      const repository = new ImmutableInMemoryToastRepository();

      repository.add(createToast('First', 'info'));
      repository.add(createToast('Second', 'warning'));
      repository.add(createToast('Third', 'error'));

      expect(repository.getAll().unwrap()).toHaveLength(3);
    });

    it('should update the cached reference after adding', () => {
      const repository = new ImmutableInMemoryToastRepository();
      const ref1 = repository.getAll().unwrap();

      repository.add(createToast());
      const ref2 = repository.getAll().unwrap();

      expect(ref1).not.toBe(ref2);
    });
  });

  describe('remove', () => {
    it('should remove an existing toast', () => {
      const repository = new ImmutableInMemoryToastRepository();
      const toast = createToast();

      repository.add(toast);
      repository.remove(toast.getId());

      expect(repository.getAll().unwrap()).toHaveLength(0);
    });

    it('should only remove the toast with the matching ID', () => {
      const repository = new ImmutableInMemoryToastRepository();
      const toast1 = createToast('First', 'info');
      const toast2 = createToast('Second', 'success');

      repository.add(toast1);
      repository.add(toast2);
      repository.remove(toast1.getId());

      const all = repository.getAll().unwrap();
      expect(all).toHaveLength(1);
      expect(all[0]).toBe(toast2);
    });

    it('should not throw when removing a non-existent ID', () => {
      const repository = new ImmutableInMemoryToastRepository();

      expect(() => repository.remove('non-existent')).not.toThrow();
    });

    it('should not alter the list when removing a non-existent ID', () => {
      const repository = new ImmutableInMemoryToastRepository();
      repository.add(createToast());

      repository.remove('non-existent');

      expect(repository.getAll().unwrap()).toHaveLength(1);
    });

    it('should update the cached reference after removing', () => {
      const repository = new ImmutableInMemoryToastRepository();
      const toast = createToast();
      repository.add(toast);

      const ref1 = repository.getAll().unwrap();
      repository.remove(toast.getId());
      const ref2 = repository.getAll().unwrap();

      expect(ref1).not.toBe(ref2);
    });

    it('should not update the reference when removing a non-existent ID', () => {
      const repository = new ImmutableInMemoryToastRepository();
      const ref1 = repository.getAll().unwrap();

      repository.remove('non-existent');
      const ref2 = repository.getAll().unwrap();

      expect(ref1).toBe(ref2);
    });
  });

  describe('findById', () => {
    it('should return the toast when it exists', () => {
      const repository = new ImmutableInMemoryToastRepository();
      const toast = createToast('Hello', 'info');
      repository.add(toast);

      expect(repository.findById(toast.getId()).unwrap()).toBe(toast);
    });

    it('should return undefined when no toast with that ID exists', () => {
      const repository = new ImmutableInMemoryToastRepository();

      expect(repository.findById('non-existent').unwrap()).toBeUndefined();
    });

    it('should return undefined after the toast has been removed', () => {
      const repository = new ImmutableInMemoryToastRepository();
      const toast = createToast();
      repository.add(toast);
      repository.remove(toast.getId());

      expect(repository.findById(toast.getId()).unwrap()).toBeUndefined();
    });

    it('should find the correct toast among multiple', () => {
      const repository = new ImmutableInMemoryToastRepository();
      const toast1 = createToast('First', 'info');
      const toast2 = createToast('Second', 'success');
      repository.add(toast1);
      repository.add(toast2);

      expect(repository.findById(toast1.getId()).unwrap()).toBe(toast1);
      expect(repository.findById(toast2.getId()).unwrap()).toBe(toast2);
    });
  });

  describe('getAll', () => {
    it('should return an empty array when the repository is empty', () => {
      const repository = new ImmutableInMemoryToastRepository();

      expect(repository.getAll().unwrap()).toStrictEqual([]);
    });

    it('should return a stable reference when no changes have occurred', () => {
      const repository = new ImmutableInMemoryToastRepository();
      repository.add(createToast());

      const ref1 = repository.getAll().unwrap();
      const ref2 = repository.getAll().unwrap();

      expect(ref1).toBe(ref2);
    });
  });
});
