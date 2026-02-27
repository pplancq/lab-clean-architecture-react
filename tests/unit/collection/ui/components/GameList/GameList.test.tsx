import { ServiceProvider } from '@App/providers/ServiceProvider/ServiceProvider';
import type { GamesListState, GamesStoreInterface } from '@Collection/application/stores/GamesStoreInterface';
import { Game } from '@Collection/domain/entities/Game';
import { COLLECTION_SERVICES } from '@Collection/serviceIdentifiers';
import { GameList } from '@Collection/ui/components/GameList/GameList';
import { renderSuspense } from '@pplancq/svg-react/tests';
import { screen, waitFor } from '@testing-library/react';
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
  fetchGames: vi.fn(),
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

const renderGameList = async (state: GamesListState) => {
  const storeMock = createStoreMock(state);
  const container = createContainer(storeMock);
  await renderSuspense(<GameList />, { wrapper: createWrapper(container) });
  return { storeMock };
};

describe('GameList', () => {
  describe('store interaction', () => {
    it('should call fetchGames on mount', async () => {
      const { storeMock } = await renderGameList({ games: [], isLoading: false, error: null });

      expect(storeMock.fetchGames).toHaveBeenCalledTimes(1);
    });
  });

  describe('loading state', () => {
    it('should show a loading status while fetching', async () => {
      await renderGameList({ games: [], isLoading: true, error: null });

      const status = screen.getByRole('status');
      expect(status).toBeInTheDocument();
      expect(status).toHaveTextContent(/loading/i);
    });
  });

  describe('empty state', () => {
    it('should show empty state message when no games exist', async () => {
      await renderGameList({ games: [], isLoading: false, error: null });

      expect(screen.getByText('Add your first game!')).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('should show an error alert when store has an error', async () => {
      await renderGameList({ games: [], isLoading: false, error: 'Unable to load games. Please try again.' });

      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent(/unable to load games/i);
    });
  });

  describe('games list rendering', () => {
    it('should render a list with game cards when games exist', async () => {
      const games = [createGame('1', 'Zelda'), createGame('2', 'Mario')];
      await renderGameList({ games, isLoading: false, error: null });

      await waitFor(() => {
        expect(screen.getByRole('list', { name: /game collection/i })).toBeInTheDocument();
        expect(screen.getAllByRole('article')).toHaveLength(2);
      });
    });

    it('should display game title, platform and format for each card', async () => {
      const games = [createGame('1', 'Zelda: Breath of the Wild', 'Nintendo Switch', 'Physical')];
      await renderGameList({ games, isLoading: false, error: null });

      await waitFor(() => {
        expect(screen.getByText('Zelda: Breath of the Wild')).toBeInTheDocument();
        expect(screen.getByText('Nintendo Switch')).toBeInTheDocument();
        expect(screen.getByText('Physical')).toBeInTheDocument();
      });
    });

    it('should announce the game count for screen readers', async () => {
      const games = [createGame('1', 'Zelda'), createGame('2', 'Mario')];
      await renderGameList({ games, isLoading: false, error: null });

      await waitFor(() => {
        expect(screen.getByText(/2 games in collection/i)).toBeInTheDocument();
      });
    });

    it('should use singular "game" when collection has one item', async () => {
      const games = [createGame('1', 'Zelda')];
      await renderGameList({ games, isLoading: false, error: null });

      await waitFor(() => {
        expect(screen.getByText(/1 game in collection/i)).toBeInTheDocument();
      });
    });
  });

  describe('accessibility', () => {
    it('should have an accessible label on each game card link', async () => {
      const games = [createGame('1', 'Zelda', 'Nintendo Switch', 'Physical')];
      await renderGameList({ games, isLoading: false, error: null });

      await waitFor(() => {
        expect(screen.getByRole('link', { name: /zelda/i })).toHaveAccessibleName();
      });
    });

    it('should have an accessible list label', async () => {
      const games = [createGame('1', 'Zelda')];
      await renderGameList({ games, isLoading: false, error: null });

      await waitFor(() => {
        expect(screen.getByRole('list', { name: /game collection/i })).toHaveAccessibleName('Game collection');
      });
    });
  });
});
