import { FilterForm } from '@Collection/ui/components/FilterForm/FilterForm';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  setFilterCriteria: vi.fn(),
}));

vi.mock('@Collection/ui/hooks/useGamesStore/useGamesStore', () => ({
  useGamesStore: () => ({
    setFilterCriteria: mocks.setFilterCriteria,
  }),
}));

vi.mock('@Shared/ui/hooks/useService/useService', () => ({
  useService: () => ({
    debounce:
      <A extends unknown[]>(callback: (...args: A) => void) =>
      (...args: A) =>
        callback(...args),
  }),
}));

describe('FilterForm', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render a form with accessible name', () => {
    render(<FilterForm />);

    expect(screen.getByRole('form', { name: /filter games/i })).toBeInTheDocument();
  });

  it('should render the title search input', () => {
    render(<FilterForm />);

    expect(screen.getByRole('searchbox', { name: /search games by title/i })).toBeInTheDocument();
  });

  it('should render the platform filter checkboxes', () => {
    render(<FilterForm />);

    expect(screen.getByRole('group', { name: /filter by platform/i })).toBeInTheDocument();
  });

  it('should call setFilterCriteria with title criteria when typing in search', async () => {
    const user = userEvent.setup();
    render(<FilterForm />);

    const input = screen.getByRole('searchbox', { name: /search games by title/i });
    await user.type(input, 'Mario');

    expect(mocks.setFilterCriteria).toHaveBeenLastCalledWith(
      expect.objectContaining({ getTitleFilter: expect.any(Function) }),
    );
    const lastCall = mocks.setFilterCriteria.mock.calls.at(-1)?.[0];
    expect(lastCall.getTitleFilter()).toBe('Mario');
  });

  it('should call setFilterCriteria with null when search is cleared', async () => {
    const user = userEvent.setup();
    render(<FilterForm />);

    const input = screen.getByRole('searchbox', { name: /search games by title/i });
    await user.type(input, 'Mario');
    await user.clear(input);

    expect(mocks.setFilterCriteria).toHaveBeenLastCalledWith(null);
  });

  it('should call setFilterCriteria with platforms criteria when a platform is checked', async () => {
    const user = userEvent.setup();
    render(<FilterForm />);

    await user.click(screen.getByRole('checkbox', { name: 'PlayStation 5' }));

    expect(mocks.setFilterCriteria).toHaveBeenLastCalledWith(
      expect.objectContaining({ getPlatforms: expect.any(Function) }),
    );
    const lastCall = mocks.setFilterCriteria.mock.calls.at(-1)?.[0];
    expect(lastCall.getPlatforms()).toStrictEqual(['PlayStation 5']);
  });

  it('should call setFilterCriteria with null when platform is unchecked and title is empty', async () => {
    const user = userEvent.setup();
    render(<FilterForm />);

    const ps5 = screen.getByRole('checkbox', { name: 'PlayStation 5' });
    await user.click(ps5);
    await user.click(ps5);

    expect(mocks.setFilterCriteria).toHaveBeenLastCalledWith(null);
  });

  it('should combine title and platform in criteria when both are active', async () => {
    const user = userEvent.setup();
    render(<FilterForm />);

    const input = screen.getByRole('searchbox', { name: /search games by title/i });
    await user.type(input, 'Mario');
    await user.click(screen.getByRole('checkbox', { name: 'Nintendo Switch' }));

    const lastCall = mocks.setFilterCriteria.mock.calls.at(-1)?.[0];
    expect(lastCall.getTitleFilter()).toBe('Mario');
    expect(lastCall.getPlatforms()).toStrictEqual(['Nintendo Switch']);
  });
});
