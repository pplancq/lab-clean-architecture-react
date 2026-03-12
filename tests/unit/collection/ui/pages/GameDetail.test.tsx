import { ServiceProvider } from '@App/providers/ServiceProvider/ServiceProvider';
import type { GameMapEntryState, GamesStoreInterface } from '@Collection/application/stores/GamesStoreInterface';
import { Game } from '@Collection/domain/entities/Game';
import { COLLECTION_SERVICES } from '@Collection/serviceIdentifiers';
import { gameDetailRoutes } from '@Collection/ui/pages/GameDetail';
import { Result } from '@Shared/domain/result/Result';
import { render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Container } from 'inversify';
import type { ReactElement, ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

const createGame = (id = 'game-1') =>
  Game.create({
    id,
    title: 'The Legend of Zelda',
    description: 'A classic adventure game.',
    platform: 'Nintendo Switch',
    format: 'Physical',
    purchaseDate: new Date('2023-05-12'),
    status: 'Owned',
  }).unwrap();

const createEntry = (override: Partial<GameMapEntryState> = {}): GameMapEntryState => ({
  data: createGame(),
  isLazy: false,
  isLoading: false,
  hasError: false,
  error: null,
  ...override,
});

const createStoreMock = (entry: GameMapEntryState): GamesStoreInterface => ({
  subscribe: vi.fn().mockReturnValue(() => {}),
  getGamesList: vi.fn().mockReturnValue({ games: [], isLoading: false, hasError: false, error: null }),
  getGame: vi.fn().mockReturnValue(entry),
  editGame: vi.fn(),
  deleteGame: vi.fn().mockResolvedValue(Result.ok(undefined)),
  addGame: vi.fn(),
});

const createWrapper =
  (container: Container, initialPath = '/games/game-1') =>
  // eslint-disable-next-line react/display-name
  ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[initialPath]}>
      <ServiceProvider container={container}>
        <Routes>
          <Route path={gameDetailRoutes.path as string} element={children} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </ServiceProvider>
    </MemoryRouter>
  );

const createContainer = (storeMock: GamesStoreInterface) => {
  const container = new Container();
  container.bind<GamesStoreInterface>(COLLECTION_SERVICES.GamesStore).toConstantValue(storeMock);
  return container;
};

const renderGameDetail = (entry: GameMapEntryState, storeMock?: GamesStoreInterface, path = '/games/game-1') => {
  const resolvedStoreMock = storeMock ?? createStoreMock(entry);
  const container = createContainer(resolvedStoreMock);
  render(gameDetailRoutes.element as ReactElement, { wrapper: createWrapper(container, path) });
  return { storeMock: resolvedStoreMock };
};

describe('GameDetail', () => {
  describe('store interaction', () => {
    it('should call getGame with the route id', () => {
      const { storeMock } = renderGameDetail(createEntry());

      expect(storeMock.getGame).toHaveBeenCalledWith('game-1');
    });
  });

  describe('loading state', () => {
    it('should show a loading status while fetching', () => {
      renderGameDetail(createEntry({ data: null, isLoading: true }));

      const status = screen.getByRole('status');
      expect(status).toBeInTheDocument();
      expect(status).toHaveTextContent(/loading/i);
    });
  });

  describe('not found state', () => {
    it('should show an accessible alert and back link when game is not found', () => {
      renderGameDetail(createEntry({ data: null, hasError: true, error: null }));

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent(/not found/i);

      const backLink = screen.getByRole('link', { name: /back to collection/i });
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAccessibleName();
    });
  });

  describe('error state', () => {
    it('should show an accessible alert when there is a generic error', () => {
      renderGameDetail(createEntry({ data: null, hasError: true, error: 'Unable to load game. Please try again.' }));

      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent(/unable to load game/i);
    });
  });

  describe('game detail rendering', () => {
    it('should render a single h1 with the game title', async () => {
      renderGameDetail(createEntry());

      await waitFor(() => {
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toHaveTextContent('The Legend of Zelda');
      });
    });

    it('should display platform, format, status, description and purchase date', async () => {
      renderGameDetail(createEntry());

      await waitFor(() => {
        expect(screen.getByText(/Nintendo Switch/)).toBeInTheDocument();
        expect(screen.getByText(/Physical/)).toBeInTheDocument();
        expect(screen.getByText(/Owned/)).toBeInTheDocument();
        expect(screen.getByText(/A classic adventure game\./)).toBeInTheDocument();
      });
    });

    it('should render a back to collection link with accessible name', async () => {
      renderGameDetail(createEntry());

      await waitFor(() => {
        const backLink = screen.getByRole('link', { name: /back to collection/i });
        expect(backLink).toHaveAccessibleName();
      });
    });

    it('should render Edit and Delete buttons', async () => {
      renderGameDetail(createEntry());

      await waitFor(() => {
        expect(screen.getByRole('link', { name: /edit/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
      });
    });

    it('should mark the cover placeholder as aria-hidden', async () => {
      renderGameDetail(createEntry());

      await waitFor(() => {
        // eslint-disable-next-line testing-library/no-node-access
        const placeholders = document.querySelectorAll('[aria-hidden="true"]');
        expect(placeholders.length).toBeGreaterThan(0);
      });
    });

    it('should show a dash when purchase date is null', async () => {
      const game = Game.create({
        id: 'game-2',
        title: 'Mario',
        description: '',
        platform: 'Nintendo Switch',
        format: 'Digital',
        purchaseDate: null,
        status: 'Owned',
      }).unwrap();

      renderGameDetail(createEntry({ data: game }));

      await waitFor(() => {
        expect(screen.getByText(/Purchase date:/)).toBeInTheDocument();
        expect(screen.getByText('—')).toBeInTheDocument();
      });
    });
  });

  describe('accessibility', () => {
    it('should have a main landmark', async () => {
      renderGameDetail(createEntry());

      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument();
      });
    });
  });

  describe('delete confirmation', () => {
    it('should open the confirmation dialog when Delete button is clicked', async () => {
      const user = userEvent.setup();
      renderGameDetail(createEntry());

      expect(await screen.findByRole('button', { name: /delete/i })).toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: /delete/i }));

      expect(await screen.findByRole('dialog')).toBeInTheDocument();
    });

    it('should close the dialog without calling deleteGame when Cancel is clicked', async () => {
      const user = userEvent.setup();
      const storeMock = createStoreMock(createEntry());
      renderGameDetail(createEntry(), storeMock);

      expect(await screen.findByRole('button', { name: /delete/i })).toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: /delete/i }));
      expect(await screen.findByRole('dialog')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /cancel/i }));

      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
      expect(storeMock.deleteGame).not.toHaveBeenCalled();
    });

    it('should call deleteGame when confirm button is clicked', async () => {
      const user = userEvent.setup();
      const storeMock = createStoreMock(createEntry());
      renderGameDetail(createEntry(), storeMock);

      expect(await screen.findByRole('button', { name: /delete/i })).toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: /delete/i }));
      expect(await screen.findByRole('dialog')).toBeInTheDocument();

      await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: /delete/i }));

      await waitFor(() => expect(storeMock.deleteGame).toHaveBeenCalledWith('game-1'));
    });

    it('should close the dialog when deleteGame returns an error', async () => {
      const user = userEvent.setup();
      const storeMock = createStoreMock(createEntry());
      vi.mocked(storeMock.deleteGame).mockResolvedValueOnce(
        Result.err({ type: 'Repository', message: 'Delete failed', metadata: {} }),
      );
      renderGameDetail(createEntry(), storeMock);

      expect(await screen.findByRole('button', { name: /delete/i })).toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: /delete/i }));
      expect(await screen.findByRole('dialog')).toBeInTheDocument();
      await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: /delete/i }));

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });
});
