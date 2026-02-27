import type { AbstractObserverInterface, VoidFunction } from './AbstractObserverInterface';

/**
 * Abstract base class implementing the Observer (pub/sub) pattern.
 *
 * Provides subscribe/unsubscribe and protected notifyObservers().
 * State management is intentionally NOT part of this class — it is the
 * responsibility of each concrete store.
 *
 * @example
 * ```typescript
 * class CounterStore extends AbstractObserver implements CounterStoreInterface {
 *   private count = 0;
 *   increment() { this.count++; this.notifyObservers(); }
 *   getCount() { return this.count; }
 * }
 * ```
 */
export abstract class AbstractObserver implements AbstractObserverInterface {
  private readonly observers: Set<VoidFunction> = new Set();

  subscribe(observer: VoidFunction): VoidFunction {
    this.observers.add(observer);

    return () => {
      this.observers.delete(observer);
    };
  }

  protected notifyObservers(): void {
    this.observers.forEach(observer => observer());
  }
}
