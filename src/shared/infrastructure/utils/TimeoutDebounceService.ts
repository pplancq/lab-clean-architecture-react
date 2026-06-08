import type { DebounceServiceInterface } from '@Shared/domain/utils/DebounceServiceInterface';

type TimeoutId = ReturnType<typeof setTimeout>;

export class TimeoutDebounceService implements DebounceServiceInterface {
  private readonly timers = new WeakMap<(...args: unknown[]) => void, TimeoutId>();

  debounce<A extends unknown[]>(callback: (...args: A) => void, delay: number): (...args: A) => void {
    return ((...args: A) => {
      const previousTimeoutId = this.timers.get(callback as (...args: unknown[]) => void);

      if (previousTimeoutId !== undefined) {
        clearTimeout(previousTimeoutId);
      }

      const timeoutId = setTimeout(() => {
        this.timers.delete(callback as (...args: unknown[]) => void);
        callback(...args);
      }, delay);

      this.timers.set(callback as (...args: unknown[]) => void, timeoutId);
    }) as (...args: A) => void;
  }
}
