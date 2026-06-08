import { GameSearch } from '@Collection/ui/components/GameSearch/GameSearch';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  setFilterCriteria: vi.fn(),
}));

const debounceTimers = new WeakMap<() => void, ReturnType<typeof setTimeout>>();

const debounceService = {
  debounce: vi.fn(<A extends unknown[]>(callback: (...args: A) => void, delay: number) => {
    return ((...args: A) => {
      const timeoutId = debounceTimers.get(callback as (...args: A) => void);

      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }

      const nextTimeoutId = setTimeout(() => {
        debounceTimers.delete(callback as (...args: A) => void);
        callback(...args);
      }, delay);

      debounceTimers.set(callback as (...args: A) => void, nextTimeoutId);
    }) as (...args: A) => void;
  }),
};

vi.mock('@Collection/ui/hooks/useGamesStore/useGamesStore', () => ({
  useGamesStore: () => ({
    setFilterCriteria: mocks.setFilterCriteria,
  }),
}));

vi.mock('@Shared/ui/hooks/useService/useService', () => ({
  useService: () => debounceService,
}));

describe('GameSearch', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('should reset the filter when the search input is cleared', async () => {
    vi.useFakeTimers();
    render(<GameSearch />);

    const input = screen.getByRole('searchbox', { name: /search games by title/i });

    fireEvent.change(input, { target: { value: 'Mario' } });
    await vi.advanceTimersByTimeAsync(300);
    expect(mocks.setFilterCriteria).toHaveBeenLastCalledWith(expect.anything());

    fireEvent.change(input, { target: { value: '' } });
    await vi.advanceTimersByTimeAsync(300);
    expect(mocks.setFilterCriteria).toHaveBeenLastCalledWith(null);
  });
});
