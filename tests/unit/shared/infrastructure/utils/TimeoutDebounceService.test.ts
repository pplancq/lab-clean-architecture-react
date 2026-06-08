import { TimeoutDebounceService } from '@Shared/infrastructure/utils/TimeoutDebounceService';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('TimeoutDebounceService', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('should debounce the same callback by replacing the pending timer', async () => {
    vi.useFakeTimers();

    const service = new TimeoutDebounceService();
    const callback = vi.fn();
    const debouncedCallback = service.debounce(callback, 100);

    debouncedCallback();
    await vi.advanceTimersByTimeAsync(50);
    debouncedCallback();

    await vi.advanceTimersByTimeAsync(99);
    expect(callback).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
