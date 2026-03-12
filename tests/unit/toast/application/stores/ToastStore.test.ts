import type { IdGeneratorInterface } from '@Shared/domain/utils/IdGeneratorInterface';
import { ToastStore } from '@Toast/application/stores/ToastStore';
import { AddToastUseCase } from '@Toast/application/use-cases/AddToastUseCase';
import { GetToastsUseCase } from '@Toast/application/use-cases/GetToastsUseCase';
import { RemoveToastUseCase } from '@Toast/application/use-cases/RemoveToastUseCase';
import { ImmutableInMemoryToastRepository } from '@Toast/infrastructure/persistence/ImmutableInMemoryToastRepository';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

class SequentialIdGenerator implements IdGeneratorInterface {
  private count = 0;

  generate(): string {
    this.count += 1;
    return `test-id-${this.count}`;
  }
}

const createStore = () => {
  const repository = new ImmutableInMemoryToastRepository();
  return new ToastStore(
    new AddToastUseCase(repository, new SequentialIdGenerator()),
    new RemoveToastUseCase(repository),
    new GetToastsUseCase(repository),
  );
};

describe('ToastStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('addToast', () => {
    it('should add a toast and make it retrievable via getAllToasts', () => {
      const store = createStore();
      store.addToast('Game saved', 'success');

      const toasts = store.getAllToasts();
      expect(toasts).toHaveLength(1);
      expect(toasts[0].getMessage()).toBe('Game saved');
      expect(toasts[0].getType()).toBe('success');
      expect(toasts[0].getDuration()).toBe(3000);
    });

    it('should use the default 3000ms duration', () => {
      const store = createStore();
      store.addToast('Hello', 'info');

      expect(store.getAllToasts()[0].getDuration()).toBe(3000);
    });

    it('should use a custom duration when provided', () => {
      const store = createStore();
      store.addToast('Error!', 'error', 5000);

      expect(store.getAllToasts()[0].getDuration()).toBe(5000);
    });

    it('should support adding multiple toasts', () => {
      const store = createStore();
      store.addToast('First', 'success');
      store.addToast('Second', 'info');
      store.addToast('Third', 'warning');

      expect(store.getAllToasts()).toHaveLength(3);
    });

    it('should notify subscribers when a toast is added', () => {
      const store = createStore();
      const listener = vi.fn();
      store.subscribe(listener);

      store.addToast('Hello', 'success');

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should silently ignore an invalid toast (no notification)', () => {
      const store = createStore();
      const listener = vi.fn();
      store.subscribe(listener);

      store.addToast('', 'success');

      expect(store.getAllToasts()).toHaveLength(0);
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('removeToast', () => {
    it('should remove an existing toast', () => {
      const store = createStore();
      store.addToast('Hello', 'info');

      const id = store.getAllToasts()[0].getId();
      store.removeToast(id);

      expect(store.getAllToasts()).toHaveLength(0);
    });

    it('should notify subscribers when a toast is removed', () => {
      const store = createStore();
      store.addToast('Hello', 'info');

      const listener = vi.fn();
      store.subscribe(listener);

      const id = store.getAllToasts()[0].getId();
      store.removeToast(id);

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should silently ignore an empty ID (no notification)', () => {
      const store = createStore();
      store.addToast('Hello', 'success');

      const listener = vi.fn();
      store.subscribe(listener);

      store.removeToast('');

      expect(store.getAllToasts()).toHaveLength(1);
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('auto-dismiss', () => {
    it('should auto-remove a toast after its duration', () => {
      const store = createStore();
      store.addToast('Temporary', 'info', 3000);

      expect(store.getAllToasts()).toHaveLength(1);

      vi.advanceTimersByTime(3000);

      expect(store.getAllToasts()).toHaveLength(0);
    });

    it('should not remove a toast before its duration elapses', () => {
      const store = createStore();
      store.addToast('Temporary', 'info', 3000);

      vi.advanceTimersByTime(2999);

      expect(store.getAllToasts()).toHaveLength(1);
    });

    it('should notify subscribers on auto-dismiss', () => {
      const store = createStore();
      store.addToast('Temporary', 'success', 1000);

      const listener = vi.fn();
      store.subscribe(listener);

      vi.advanceTimersByTime(1000);

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should not double-notify when manually removing before timer fires', () => {
      const store = createStore();
      store.addToast('Temporary', 'success', 3000);

      const id = store.getAllToasts()[0].getId();

      const listener = vi.fn();
      store.subscribe(listener);

      store.removeToast(id);
      vi.advanceTimersByTime(3000);

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should auto-dismiss toasts with different durations independently', () => {
      const store = createStore();
      store.addToast('Short', 'info', 1000);
      store.addToast('Long', 'success', 5000);

      vi.advanceTimersByTime(1000);
      expect(store.getAllToasts()).toHaveLength(1);

      vi.advanceTimersByTime(4000);
      expect(store.getAllToasts()).toHaveLength(0);
    });
  });

  describe('subscribe', () => {
    it('should return an unsubscribe function that stops notifications', () => {
      const store = createStore();
      const listener = vi.fn();
      const unsubscribe = store.subscribe(listener);

      unsubscribe();
      store.addToast('Hello', 'info');

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('getAllToasts', () => {
    it('should return an empty array when the store is empty', () => {
      const store = createStore();

      expect(store.getAllToasts()).toStrictEqual([]);
    });

    it('should return a stable reference that only changes on add/remove', () => {
      const store = createStore();
      const ref1 = store.getAllToasts();

      store.addToast('Hello', 'success');
      const ref2 = store.getAllToasts();

      expect(ref1).not.toBe(ref2);
      expect(ref1).toHaveLength(0);
      expect(ref2).toHaveLength(1);
    });

    it('should return the same reference on consecutive reads without changes', () => {
      const store = createStore();
      store.addToast('Hello', 'success');

      const ref1 = store.getAllToasts();
      const ref2 = store.getAllToasts();

      expect(ref1).toBe(ref2);
    });
  });
});
