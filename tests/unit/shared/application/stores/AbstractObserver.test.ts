import { AbstractObserver } from '@Shared/application/stores/AbstractObserver';
import { describe, expect, it, vi } from 'vitest';

class TestStore extends AbstractObserver {
  private value = 0;

  increment() {
    this.value += 1;
    this.notifyObservers();
  }

  getValue() {
    return this.value;
  }
}

describe('AbstractObserver', () => {
  describe('subscribe', () => {
    it('should call the observer when notifyObservers is triggered', () => {
      const store = new TestStore();
      const observer = vi.fn();
      store.subscribe(observer);

      store.increment();

      expect(observer).toHaveBeenCalledTimes(1);
    });

    it('should return an unsubscribe function that removes the observer', () => {
      const store = new TestStore();
      const observer = vi.fn();
      const unsubscribe = store.subscribe(observer);

      unsubscribe();
      store.increment();

      expect(observer).not.toHaveBeenCalled();
    });

    it('should only notify remaining observers after unsubscribe', () => {
      const store = new TestStore();
      const observer1 = vi.fn();
      const observer2 = vi.fn();
      const observer3 = vi.fn();
      const unsubscribe = store.subscribe(observer1);
      store.subscribe(observer2);
      store.subscribe(observer3);

      unsubscribe();
      store.increment();

      expect(observer1).not.toHaveBeenCalled();
      expect(observer2).toHaveBeenCalledTimes(1);
      expect(observer3).toHaveBeenCalledTimes(1);
    });

    it('should notify all subscribers on each change', () => {
      const store = new TestStore();
      const observer = vi.fn();
      store.subscribe(observer);

      store.increment();
      store.increment();

      expect(observer).toHaveBeenCalledTimes(2);
    });
  });
});
