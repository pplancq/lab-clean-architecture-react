import type { DebounceServiceInterface } from '@Shared/domain/utils/DebounceServiceInterface';

type TimeoutId = ReturnType<typeof setTimeout>;

export class TimeoutDebounceService implements DebounceServiceInterface {
  private readonly timers = new WeakMap<object, TimeoutId>();

  debounce<A extends unknown[]>(callback: (...args: A) => void, delay: number): (...args: A) => void {
    return ((...args: A) => {
      const previousTimeoutId = this.timers.get(callback as object);

      if (previousTimeoutId !== undefined) {
        clearTimeout(previousTimeoutId);
      }

      const timeoutId = setTimeout(() => {
        this.timers.delete(callback as object);
        callback(...args);
      }, delay);

      this.timers.set(callback as object, timeoutId);
    }) as (...args: A) => void;
  }
}
