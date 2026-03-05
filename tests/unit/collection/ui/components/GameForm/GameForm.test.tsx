import { ServiceProvider } from '@App/providers/ServiceProvider/ServiceProvider';
import { AddGameDTO } from '@Collection/application/dtos/AddGameDTO';
import { EditGameDTO } from '@Collection/application/dtos/EditGameDTO';
import type { ApplicationErrorInterface } from '@Collection/application/errors/ApplicationErrorInterface';
import type { Game } from '@Collection/domain/entities/Game';
import { GameForm } from '@Collection/ui/components/GameForm/GameForm';
import { renderSuspense } from '@pplancq/svg-react/tests';
import { Result } from '@Shared/domain/result/Result';
import type { DateFormatterInterface } from '@Shared/domain/utils/DateFormatterInterface';
import { DateFormatter } from '@Shared/infrastructure/utils/DateFormatter';
import { SHARED_SERVICES } from '@Shared/serviceIdentifiers';
import { screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Container } from 'inversify';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

const createWrapper =
  (container: Container) =>
  // eslint-disable-next-line react/display-name
  ({ children }: { children: ReactNode }) => <ServiceProvider container={container}>{children}</ServiceProvider>;

const createContainer = () => {
  const container = new Container();
  container.bind<DateFormatterInterface>(SHARED_SERVICES.DateFormatter).toConstantValue(new DateFormatter());
  return container;
};

const renderGameForm = (onSubmitMock: (dto: AddGameDTO) => Promise<Result<Game, ApplicationErrorInterface>>) => {
  const container = createContainer();
  return renderSuspense(<GameForm onSubmit={onSubmitMock} />, {
    wrapper: createWrapper(container),
  });
};

const renderEditGameForm = (
  onSubmitMock: (dto: EditGameDTO) => Promise<Result<Game, ApplicationErrorInterface>>,
  options?: {
    onSuccess?: () => void;
    onCancel?: () => void;
    initialData?: Parameters<typeof GameForm>[0]['initialData'];
  },
) => {
  const container = createContainer();
  const initialData = options?.initialData ?? {
    title: 'The Legend of Zelda',
    platform: 'Nintendo Switch',
    format: 'Physical',
    purchaseDate: '2023-05-12',
    description: 'Classic adventure game',
    status: 'Owned',
  };
  return renderSuspense(
    <GameForm
      edit
      gameId="game-123"
      initialData={initialData}
      onSubmit={onSubmitMock}
      onSuccess={options?.onSuccess}
      onCancel={options?.onCancel}
    />,
    { wrapper: createWrapper(container) },
  );
};

const fillRequiredFields = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByRole('textbox', { name: /game title/i }), 'The Legend of Zelda');
  await user.selectOptions(screen.getByRole('combobox', { name: /platform/i }), 'Nintendo Switch');
};

describe('GameForm', () => {
  describe('rendering', () => {
    it('should render the form with an accessible label', async () => {
      await renderGameForm(vi.fn());

      expect(screen.getByRole('form', { name: /add game form/i })).toBeInTheDocument();
    });

    it('should render all form fields', async () => {
      await renderGameForm(vi.fn());

      expect(screen.getByRole('textbox', { name: /game title/i })).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: /platform/i })).toBeInTheDocument();
      expect(screen.getByRole('radiogroup', { name: /format/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /description/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add game/i })).toBeInTheDocument();
    });

    it('should pre-select Physical format by default', async () => {
      await renderGameForm(vi.fn());

      expect(screen.getByRole('radio', { name: 'Physical' })).toBeChecked();
      expect(screen.getByRole('radio', { name: 'Digital' })).not.toBeChecked();
    });

    it('should have today as default purchase date', async () => {
      await renderGameForm(vi.fn());

      const d = new Date();
      const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dateInput = screen.getByLabelText(/purchase date/i);
      expect(dateInput).toHaveValue(today);
    });
  });

  describe('accessibility', () => {
    it('should have ARIA labels on all form fields', async () => {
      await renderGameForm(vi.fn());

      expect(screen.getByRole('textbox', { name: /game title/i })).toHaveAccessibleName();
      expect(screen.getByRole('combobox', { name: /platform/i })).toHaveAccessibleName();
      expect(screen.getByRole('radiogroup', { name: /format/i })).toHaveAccessibleName();
      expect(screen.getByRole('textbox', { name: /description/i })).toHaveAccessibleName();
    });

    it('should mark title as required', async () => {
      await renderGameForm(vi.fn());

      expect(screen.getByRole('textbox', { name: /game title/i })).toBeRequired();
    });

    it('should mark platform as required', async () => {
      await renderGameForm(vi.fn());

      expect(screen.getByRole('combobox', { name: /platform/i })).toBeRequired();
    });
  });

  describe('validation', () => {
    it('should display an error when title is submitted empty', async () => {
      const user = userEvent.setup();
      await renderGameForm(vi.fn());

      await user.click(screen.getByRole('button', { name: /add game/i }));

      await waitFor(() => {
        expect(screen.getByText('Game title cannot be empty')).toBeInTheDocument();
      });
    });

    it('should display an error when platform is not selected', async () => {
      const user = userEvent.setup();
      await renderGameForm(vi.fn());

      await user.type(screen.getByRole('textbox', { name: /game title/i }), 'Some Game');
      await user.click(screen.getByRole('button', { name: /add game/i }));

      await waitFor(() => {
        expect(screen.getByText('Platform name is required')).toBeInTheDocument();
      });
    });

    it('should associate validation errors with their fields via aria-errormessage', async () => {
      const user = userEvent.setup();
      await renderGameForm(vi.fn());

      await user.click(screen.getByRole('button', { name: /add game/i }));

      await waitFor(() => {
        const titleInput = screen.getByRole('textbox', { name: /game title/i });
        expect(titleInput).toHaveAccessibleErrorMessage('Game title cannot be empty');
      });
    });

    it('should not call onSubmit when the form is invalid', async () => {
      const user = userEvent.setup();
      const onSubmitMock = vi.fn();
      await renderGameForm(onSubmitMock);

      await user.click(screen.getByRole('button', { name: /add game/i }));

      expect(onSubmitMock).not.toHaveBeenCalled();
    });
  });

  describe('submission', () => {
    it('should call onSubmit with an AddGameDTO on valid submit', async () => {
      const user = userEvent.setup();
      const onSubmitMock = vi.fn().mockResolvedValue(Result.ok(undefined));
      await renderGameForm(onSubmitMock);

      await fillRequiredFields(user);
      await user.click(screen.getByRole('button', { name: /add game/i }));

      await waitFor(() => {
        expect(onSubmitMock).toHaveBeenCalledOnce();
      });
      expect(onSubmitMock).toHaveBeenCalledWith(expect.any(AddGameDTO));
    });

    it('should pass the correct values to onSubmit', async () => {
      const user = userEvent.setup();
      const onSubmitMock = vi.fn().mockResolvedValue(Result.ok(undefined));
      await renderGameForm(onSubmitMock);

      await user.type(screen.getByRole('textbox', { name: /game title/i }), 'Zelda');
      await user.selectOptions(screen.getByRole('combobox', { name: /platform/i }), 'Nintendo Switch');
      await user.click(screen.getByRole('radio', { name: 'Digital' }));

      await user.click(screen.getByRole('button', { name: /add game/i }));

      await waitFor(() => {
        const dto: AddGameDTO = onSubmitMock.mock.calls[0][0];
        expect(dto.title).toBe('Zelda');
        expect(dto.platform).toBe('Nintendo Switch');
        expect(dto.format).toBe('Digital');
        expect(dto.status).toBe('Owned');
      });
    });

    it('should display a success message after successful submission', async () => {
      const user = userEvent.setup();
      const onSubmitMock = vi.fn().mockResolvedValue(Result.ok(undefined));
      await renderGameForm(onSubmitMock);

      await fillRequiredFields(user);
      await user.click(screen.getByRole('button', { name: /add game/i }));

      await waitFor(() => {
        expect(screen.getByText('Game added successfully')).toBeInTheDocument();
      });
    });

    it('should reset the form after successful submission', async () => {
      const user = userEvent.setup();
      const onSubmitMock = vi.fn().mockResolvedValue(Result.ok(undefined));
      await renderGameForm(onSubmitMock);

      await fillRequiredFields(user);
      await user.click(screen.getByRole('button', { name: /add game/i }));

      await waitFor(() => {
        expect(screen.getByRole('textbox', { name: /game title/i })).toHaveValue('');
      });
    });

    it('should display an error message when onSubmit fails', async () => {
      const user = userEvent.setup();
      const onSubmitMock = vi
        .fn()
        .mockResolvedValue(
          Result.err({ type: 'Repository', message: 'Storage quota exceeded', name: 'RepositoryError' }),
        );
      await renderGameForm(onSubmitMock);

      await fillRequiredFields(user);
      await user.click(screen.getByRole('button', { name: /add game/i }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText('Unable to add game')).toBeInTheDocument();
      });
    });
  });

  describe('edit mode', () => {
    describe('rendering', () => {
      it('should render the form with an accessible edit label', async () => {
        await renderEditGameForm(vi.fn());

        expect(screen.getByRole('form', { name: /edit game form/i })).toBeInTheDocument();
      });

      it('should pre-populate all fields from initialData', async () => {
        await renderEditGameForm(vi.fn());

        expect(screen.getByRole('textbox', { name: /game title/i })).toHaveValue('The Legend of Zelda');
        expect(screen.getByRole('combobox', { name: /status/i })).toHaveValue('Owned');
      });

      it('should not render platform and format fields in edit mode', async () => {
        await renderEditGameForm(vi.fn());

        expect(screen.queryByRole('combobox', { name: /platform/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('radiogroup', { name: /format/i })).not.toBeInTheDocument();
      });

      it('should render Save changes button instead of Add game', async () => {
        await renderEditGameForm(vi.fn());

        expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /add game/i })).not.toBeInTheDocument();
      });

      it('should render the Cancel button', async () => {
        await renderEditGameForm(vi.fn());

        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
      });

      it('should render the status field', async () => {
        await renderEditGameForm(vi.fn());

        expect(screen.getByRole('combobox', { name: /status/i })).toBeInTheDocument();
      });
    });

    describe('accessibility', () => {
      it('should have accessible labels on all edit mode fields including status', async () => {
        await renderEditGameForm(vi.fn());

        expect(screen.getByRole('combobox', { name: /status/i })).toHaveAccessibleName();
        expect(screen.getByRole('button', { name: /cancel/i })).toHaveAccessibleName();
      });
    });

    describe('cancel interaction', () => {
      it('should call onCancel when cancel button is clicked', async () => {
        const user = userEvent.setup();
        const onCancelMock = vi.fn();
        await renderEditGameForm(vi.fn(), { onCancel: onCancelMock });

        await user.click(screen.getByRole('button', { name: /cancel/i }));

        expect(onCancelMock).toHaveBeenCalledOnce();
      });
    });

    describe('submission', () => {
      it('should call onSubmit with an EditGameDTO on valid submit', async () => {
        const user = userEvent.setup();
        const onSubmitMock = vi.fn().mockResolvedValue(Result.ok(undefined));
        const onSuccessMock = vi.fn();
        await renderEditGameForm(onSubmitMock, { onSuccess: onSuccessMock });

        await user.click(screen.getByRole('button', { name: /save changes/i }));

        await waitFor(() => {
          expect(onSubmitMock).toHaveBeenCalledOnce();
        });
        expect(onSubmitMock).toHaveBeenCalledWith(expect.any(EditGameDTO));
      });

      it('should call onSuccess after a successful edit', async () => {
        const user = userEvent.setup();
        const onSubmitMock = vi.fn().mockResolvedValue(Result.ok(undefined));
        const onSuccessMock = vi.fn();
        await renderEditGameForm(onSubmitMock, { onSuccess: onSuccessMock });

        await user.click(screen.getByRole('button', { name: /save changes/i }));

        await waitFor(() => {
          expect(onSuccessMock).toHaveBeenCalledOnce();
        });
      });

      it('should show "Unable to update game" error title on failure', async () => {
        const user = userEvent.setup();
        const onSubmitMock = vi
          .fn()
          .mockResolvedValue(Result.err({ type: 'Repository', message: 'Storage error', name: 'RepositoryError' }));
        await renderEditGameForm(onSubmitMock);

        await user.click(screen.getByRole('button', { name: /save changes/i }));

        await waitFor(() => {
          expect(screen.getByRole('alert')).toBeInTheDocument();
          expect(screen.getByText('Unable to update game')).toBeInTheDocument();
        });
      });
    });
  });
});
