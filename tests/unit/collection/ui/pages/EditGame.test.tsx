import { ServiceProvider } from '@App/providers/ServiceProvider/ServiceProvider';
import type { GameMapEntryState, GamesStoreInterface } from '@Collection/application/stores/GamesStoreInterface';
import type { AddGameUseCaseInterface } from '@Collection/application/use-cases/AddGameUseCaseInterface';
import { Game } from '@Collection/domain/entities/Game';
import { COLLECTION_SERVICES } from '@Collection/serviceIdentifiers';
import { editGameRoutes } from '@Collection/ui/pages/EditGame';
import { Result } from '@Shared/domain/result/Result';
import type { DateFormatterInterface } from '@Shared/domain/utils/DateFormatterInterface';
import { DateFormatter } from '@Shared/infrastructure/utils/DateFormatter';
import { SHARED_SERVICES } from '@Shared/serviceIdentifiers';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Container } from 'inversify';
import type { ReactElement, ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it, type Mock, vi } from 'vitest';

const createGame = (overrides: Partial<Parameters<typeof Game.create>[0]> = {}) =>
  Game.create({
    id: 'game-1',
    title: 'The Legend of Zelda',
    description: 'A classic adventure game.',
    platform: 'Nintendo Switch',
    format: 'Physical',
    purchaseDate: new Date('2023-05-12'),
    status: 'Owned',
    ...overrides,
  }).unwrap();

const createEntry = (override: Partial<GameMapEntryState> = {}): GameMapEntryState => ({
  data: createGame(),
  isLazy: false,
  isLoading: false,
  hasError: false,
  error: null,
  ...override,
});

const createStoreMock = (
  entry: GameMapEntryState,
  editGameMock = vi.fn().mockResolvedValue(Result.ok(createGame())),
): GamesStoreInterface => ({
  subscribe: vi.fn().mockReturnValue(() => {}),
  getGamesList: vi.fn().mockReturnValue({ games: [], isLoading: false, hasError: false, error: null }),
  getGame: vi.fn().mockReturnValue(entry),
  editGame: editGameMock,
  addGame: vi.fn(),
  deleteGame: vi.fn(),
});

const createWrapper =
  (container: Container, initialPath = '/games/game-1/edit') =>
  // eslint-disable-next-line react/display-name
  ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[initialPath]}>
      <ServiceProvider container={container}>
        <Routes>
          <Route path={editGameRoutes.path as string} element={children} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </ServiceProvider>
    </MemoryRouter>
  );

const createContainer = (storeMock: GamesStoreInterface) => {
  const container = new Container();
  container.bind<GamesStoreInterface>(COLLECTION_SERVICES.GamesStore).toConstantValue(storeMock);
  container.bind<AddGameUseCaseInterface>(COLLECTION_SERVICES.AddGameUseCase).toConstantValue({ execute: vi.fn() });
  container.bind<DateFormatterInterface>(SHARED_SERVICES.DateFormatter).toConstantValue(new DateFormatter());
  return container;
};

const renderEditGame = (entry: GameMapEntryState, editGameMock?: Mock) => {
  const storeMock = createStoreMock(entry, editGameMock ?? vi.fn().mockResolvedValue(Result.ok(createGame())));
  const container = createContainer(storeMock);
  render(editGameRoutes.element as ReactElement, {
    wrapper: createWrapper(container),
  });
  return { storeMock };
};

describe('EditGame', () => {
  describe('loading state', () => {
    it('should show a loading status while fetching', () => {
      renderEditGame(createEntry({ data: null, isLoading: true }));

      expect(screen.getByRole('status')).toHaveTextContent(/loading/i);
    });
  });

  describe('not found state', () => {
    it('should show an accessible alert and back link when game is not found', () => {
      renderEditGame(createEntry({ data: null, hasError: true, error: null }));

      expect(screen.getByRole('alert')).toHaveTextContent(/not found/i);
      expect(screen.getByRole('link', { name: /back to collection/i })).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('should show an accessible alert on generic error', () => {
      renderEditGame(createEntry({ data: null, hasError: true, error: 'Unable to load game. Please try again.' }));

      expect(screen.getByRole('alert')).toHaveTextContent(/unable to load game/i);
    });
  });

  describe('form rendering', () => {
    it('should render the edit game form with accessible label', async () => {
      renderEditGame(createEntry());

      await waitFor(() => {
        expect(screen.getByRole('form', { name: /edit game form/i })).toBeInTheDocument();
      });
    });

    it('should pre-populate the title field with the game title', async () => {
      renderEditGame(createEntry());

      await waitFor(() => {
        expect(screen.getByRole('textbox', { name: /game title/i })).toHaveValue('The Legend of Zelda');
      });
    });

    it('should not render platform and format fields in edit mode', async () => {
      renderEditGame(createEntry());

      await waitFor(() => {
        expect(screen.queryByRole('combobox', { name: /platform/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('radiogroup', { name: /format/i })).not.toBeInTheDocument();
      });
    });

    it('should pre-populate the status field', async () => {
      renderEditGame(createEntry());

      await waitFor(() => {
        expect(screen.getByRole('combobox', { name: /status/i })).toHaveValue('Owned');
      });
    });

    it('should render the Save changes button', async () => {
      renderEditGame(createEntry());

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
      });
    });

    it('should render the Cancel button', async () => {
      renderEditGame(createEntry());

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
      });
    });
  });

  describe('accessibility', () => {
    it('should have a main landmark', async () => {
      renderEditGame(createEntry());

      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument();
      });
    });

    it('should have accessible labels on all form fields', async () => {
      renderEditGame(createEntry());

      await waitFor(() => {
        expect(screen.getByRole('textbox', { name: /game title/i })).toHaveAccessibleName();
        expect(screen.getByRole('combobox', { name: /status/i })).toHaveAccessibleName();
      });
    });

    it('should mark title as required', async () => {
      renderEditGame(createEntry());

      await waitFor(() => {
        expect(screen.getByRole('textbox', { name: /game title/i })).toBeRequired();
      });
    });
  });

  describe('submission', () => {
    it('should call store.editGame on valid submit', async () => {
      const user = userEvent.setup();
      const editGameMock = vi.fn().mockResolvedValue(Result.ok(createGame()));
      renderEditGame(createEntry(), editGameMock);

      await user.click(screen.getByRole('button', { name: /save changes/i }));

      await waitFor(() => {
        expect(editGameMock).toHaveBeenCalledOnce();
      });
    });
  });

  describe('cancel navigation', () => {
    it('should render cancel button with accessible name', async () => {
      renderEditGame(createEntry());

      await waitFor(() => {
        const cancelBtn = screen.getByRole('button', { name: /cancel/i });
        expect(cancelBtn).toHaveAccessibleName('Cancel');
      });
    });
  });

  describe('store interaction', () => {
    it('should call getGame with the route id', async () => {
      const { storeMock } = renderEditGame(createEntry());

      await waitFor(() => {
        expect(storeMock.getGame).toHaveBeenCalledWith('game-1');
      });
    });
  });
});
