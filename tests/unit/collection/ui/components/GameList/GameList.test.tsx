import { ServiceProvider } from '@App/providers/ServiceProvider/ServiceProvider';
import type { GamesListState, GamesStoreInterface } from '@Collection/application/stores/GamesStoreInterface';
import { Game } from '@Collection/domain/entities/Game';
import { COLLECTION_SERVICES } from '@Collection/serviceIdentifiers';
import { GameList } from '@Collection/ui/components/GameList/GameList';
import { render, screen, waitFor } from '@testing-library/react';
import { Container } from 'inversify';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

const createGame = (id: string, title: string, platform = 'Nintendo Switch', format = 'Physical') =>
  Game.create({
    id,
    title,
    description: '',
    platform,
    format,
    purchaseDate: null,
    status: 'Owned',
  }).unwrap();

const createStoreMock = (state: GamesListState): GamesStoreInterface => ({
  subscribe: vi.fn().mockReturnValue(() => {}),
  getGamesList: vi.fn().mockReturnValue(state),
  getGame: vi.fn().mockReturnValue({
    data: null,
    isLazy: false,
    isLoading: false,
    hasError: false,
    error: null,
  }),
  editGame: vi.fn(),
  deleteGame: vi.fn(),
  addGame: vi.fn(),
});

const createWrapper =
  (container: Container) =>
  // eslint-disable-next-line react/display-name
  ({ children }: { children: ReactNode }) => (
    <MemoryRouter>
      <ServiceProvider container={container}>{children}</ServiceProvider>
    </MemoryRouter>
  );

const createContainer = (storeMock: GamesStoreInterface) => {
  const container = new Container();
  container.bind<GamesStoreInterface>(COLLECTION_SERVICES.GamesStore).toConstantValue(storeMock);
  return container;
};

const renderGameList = (state: GamesListState) => {
  const storeMock = createStoreMock(state);
  const container = createContainer(storeMock);
  render(<GameList />, { wrapper: createWrapper(container) });
  return { storeMock };
};

describe('GameList', () => {
  describe('loading state', () => {
    it('should show a loading status while fetching', async () => {
      renderGameList({ games: [], isLoading: true, hasError: false, error: null });

      const status = screen.getByRole('status');
      expect(status).toBeInTheDocument();
      expect(status).toHaveTextContent(/loading/i);
    });
  });

  describe('empty state', () => {
    it('should show empty state message when no games exist', async () => {
      renderGameList({ games: [], isLoading: false, hasError: false, error: null });

      expect(screen.getByText('Add your first game!')).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('should show an error alert when store has an error', async () => {
      renderGameList({
        games: [],
        isLoading: false,
        hasError: true,
        error: 'Unable to load games. Please try again.',
      });

      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent(/unable to load games/i);
    });
  });

  describe('games list rendering', () => {
    it('should render a list with game cards when games exist', async () => {
      const games = [createGame('1', 'Zelda'), createGame('2', 'Mario')];
      renderGameList({ games, isLoading: false, hasError: false, error: null });

      await waitFor(() => {
        expect(screen.getByRole('list', { name: /game collection/i })).toBeInTheDocument();
        expect(screen.getAllByRole('article')).toHaveLength(2);
      });
    });

    it('should display game title, platform and format for each card', async () => {
      const games = [createGame('1', 'Zelda: Breath of the Wild', 'Nintendo Switch', 'Physical')];
      renderGameList({ games, isLoading: false, hasError: false, error: null });

      await waitFor(() => {
        expect(screen.getByText('Zelda: Breath of the Wild')).toBeInTheDocument();
        expect(screen.getByText('Nintendo Switch')).toBeInTheDocument();
        expect(screen.getByText('Physical')).toBeInTheDocument();
      });
    });

    it('should announce the game count for screen readers', async () => {
      const games = [createGame('1', 'Zelda'), createGame('2', 'Mario')];
      renderGameList({ games, isLoading: false, hasError: false, error: null });

      await waitFor(() => {
        expect(screen.getByText(/2 games in collection/i)).toBeInTheDocument();
      });
    });

    it('should use singular "game" when collection has one item', async () => {
      const games = [createGame('1', 'Zelda')];
      renderGameList({ games, isLoading: false, hasError: false, error: null });

      await waitFor(() => {
        expect(screen.getByText(/1 game in collection/i)).toBeInTheDocument();
      });
    });
  });

  describe('accessibility', () => {
    it('should have an accessible label on each game card link', async () => {
      const games = [createGame('1', 'Zelda', 'Nintendo Switch', 'Physical')];
      renderGameList({ games, isLoading: false, hasError: false, error: null });

      await waitFor(() => {
        expect(screen.getByRole('link', { name: /zelda/i })).toHaveAccessibleName();
      });
    });

    it('should have an accessible list label', async () => {
      const games = [createGame('1', 'Zelda')];
      renderGameList({ games, isLoading: false, hasError: false, error: null });

      await waitFor(() => {
        expect(screen.getByRole('list', { name: /game collection/i })).toHaveAccessibleName('Game collection');
      });
    });
  });
});
