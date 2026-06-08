import { GameSearch } from '@Collection/ui/components/GameSearch/GameSearch';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  setFilterCriteria: vi.fn(),
}));

vi.mock('@Collection/ui/hooks/useGamesStore/useGamesStore', () => ({
  useGamesStore: () => ({
    setFilterCriteria: mocks.setFilterCriteria,
  }),
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
