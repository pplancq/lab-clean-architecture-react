import { ServiceProvider } from '@App/providers/ServiceProvider/ServiceProvider';
import type { GetGamesUseCaseInterface } from '@Collection/application/use-cases/GetGamesUseCaseInterface';
import { Game } from '@Collection/domain/entities/Game';
import { COLLECTION_SERVICES } from '@Collection/serviceIdentifiers';
import { GameList } from '@Collection/ui/components/GameList/GameList';
import { renderSuspense } from '@pplancq/svg-react/tests';
import { Result } from '@Shared/domain/result/Result';
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

const createWrapper =
  (container: Container) =>
  // eslint-disable-next-line react/display-name
  ({ children }: { children: ReactNode }) => (
    <MemoryRouter>
      <ServiceProvider container={container}>{children}</ServiceProvider>
    </MemoryRouter>
  );

const createContainer = (useCaseMock: GetGamesUseCaseInterface) => {
  const container = new Container();
  container.bind<GetGamesUseCaseInterface>(COLLECTION_SERVICES.GetGamesUseCase).toConstantValue(useCaseMock);
  return container;
};

const renderGameList = (useCaseMock: GetGamesUseCaseInterface) => {
  const container = createContainer(useCaseMock);
  return renderSuspense(<GameList />, { wrapper: createWrapper(container) });
};

describe('GameList', () => {
  describe('loading state', () => {
    it('should show a loading status while fetching', async () => {
      const useCaseMock = { execute: vi.fn().mockReturnValue(new Promise(() => {})) };
      await renderGameList(useCaseMock);

      const status = screen.getByRole('status');
      expect(status).toBeInTheDocument();
      expect(status).toHaveTextContent(/loading/i);
    });
  });

  describe('empty state', () => {
    it('should show empty state message when no games exist', async () => {
      const useCaseMock = { execute: vi.fn().mockResolvedValue(Result.ok([])) };
      await renderGameList(useCaseMock);

      await waitFor(() => {
        expect(screen.getByText('Add your first game!')).toBeInTheDocument();
      });
    });
  });

  describe('error state', () => {
    it('should show an error alert when use case fails', async () => {
      const useCaseMock = {
        execute: vi.fn().mockResolvedValue(Result.err({ type: 'Repository', message: 'DB error', metadata: {} })),
      };
      await renderGameList(useCaseMock);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
      expect(screen.getByRole('alert')).toHaveTextContent(/unable to load games/i);
    });
  });

  describe('games list rendering', () => {
    it('should render a list with game cards when games exist', async () => {
      const games = [createGame('1', 'Zelda'), createGame('2', 'Mario')];
      const useCaseMock = { execute: vi.fn().mockResolvedValue(Result.ok(games)) };
      await renderGameList(useCaseMock);

      await waitFor(() => {
        expect(screen.getByRole('list', { name: /game collection/i })).toBeInTheDocument();
        expect(screen.getAllByRole('article')).toHaveLength(2);
      });
    });

    it('should display game title, platform and format for each card', async () => {
      const games = [createGame('1', 'Zelda: Breath of the Wild', 'Nintendo Switch', 'Physical')];
      const useCaseMock = { execute: vi.fn().mockResolvedValue(Result.ok(games)) };
      await renderGameList(useCaseMock);

      await waitFor(() => {
        expect(screen.getByText('Zelda: Breath of the Wild')).toBeInTheDocument();
        expect(screen.getByText('Nintendo Switch')).toBeInTheDocument();
        expect(screen.getByText('Physical')).toBeInTheDocument();
      });
    });

    it('should announce the game count for screen readers', async () => {
      const games = [createGame('1', 'Zelda'), createGame('2', 'Mario')];
      const useCaseMock = { execute: vi.fn().mockResolvedValue(Result.ok(games)) };
      await renderGameList(useCaseMock);

      await waitFor(() => {
        expect(screen.getByText(/2 games in collection/i)).toBeInTheDocument();
      });
    });

    it('should use singular "game" when collection has one item', async () => {
      const games = [createGame('1', 'Zelda')];
      const useCaseMock = { execute: vi.fn().mockResolvedValue(Result.ok(games)) };
      await renderGameList(useCaseMock);

      await waitFor(() => {
        expect(screen.getByText(/1 game in collection/i)).toBeInTheDocument();
      });
    });
  });

  describe('accessibility', () => {
    it('should have an accessible label on each game card link', async () => {
      const games = [createGame('1', 'Zelda', 'Nintendo Switch', 'Physical')];
      const useCaseMock = { execute: vi.fn().mockResolvedValue(Result.ok(games)) };
      await renderGameList(useCaseMock);

      await waitFor(() => {
        expect(screen.getByRole('link', { name: /zelda/i })).toHaveAccessibleName();
      });
    });

    it('should have an accessible list label', async () => {
      const games = [createGame('1', 'Zelda')];
      const useCaseMock = { execute: vi.fn().mockResolvedValue(Result.ok(games)) };
      await renderGameList(useCaseMock);

      await waitFor(() => {
        expect(screen.getByRole('list', { name: /game collection/i })).toHaveAccessibleName('Game collection');
      });
    });
  });
});
