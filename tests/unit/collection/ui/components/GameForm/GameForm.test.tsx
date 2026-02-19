import { ServiceProvider } from '@App/providers/ServiceProvider/ServiceProvider';
import { AddGameDTO } from '@Collection/application/dtos/AddGameDTO';
import type { AddGameUseCaseInterface } from '@Collection/application/use-cases/AddGameUseCaseInterface';
import { COLLECTION_SERVICES } from '@Collection/serviceIdentifiers';
import { GameForm } from '@Collection/ui/components/GameForm/GameForm';
import { renderSuspense } from '@pplancq/svg-react/tests';
import { Result } from '@Shared/domain/result/Result';
import { screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Container } from 'inversify';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

const createWrapper =
  (container: Container) =>
  // eslint-disable-next-line react/display-name
  ({ children }: { children: ReactNode }) => <ServiceProvider container={container}>{children}</ServiceProvider>;

const createContainer = (useCaseMock: AddGameUseCaseInterface) => {
  const container = new Container();
  container.bind<AddGameUseCaseInterface>(COLLECTION_SERVICES.AddGameUseCase).toConstantValue(useCaseMock);
  return container;
};

const renderGameForm = (useCaseMock: AddGameUseCaseInterface) => {
  const container = createContainer(useCaseMock);
  return renderSuspense(<GameForm />, { wrapper: createWrapper(container) });
};

const fillRequiredFields = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByRole('textbox', { name: /game title/i }), 'The Legend of Zelda');
  await user.selectOptions(screen.getByRole('combobox', { name: /platform/i }), 'Nintendo Switch');
};

describe('GameForm', () => {
  describe('rendering', () => {
    it('should render the form with an accessible label', async () => {
      const useCaseMock = { execute: vi.fn() };
      await renderGameForm(useCaseMock);

      expect(screen.getByRole('form', { name: /add game form/i })).toBeInTheDocument();
    });

    it('should render all form fields', async () => {
      const useCaseMock = { execute: vi.fn() };
      await renderGameForm(useCaseMock);

      expect(screen.getByRole('textbox', { name: /game title/i })).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: /platform/i })).toBeInTheDocument();
      expect(screen.getByRole('radiogroup', { name: /format/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /description/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add game/i })).toBeInTheDocument();
    });

    it('should pre-select Physical format by default', async () => {
      const useCaseMock = { execute: vi.fn() };
      await renderGameForm(useCaseMock);

      expect(screen.getByRole('radio', { name: 'Physical' })).toBeChecked();
      expect(screen.getByRole('radio', { name: 'Digital' })).not.toBeChecked();
    });

    it('should have today as default purchase date', async () => {
      const useCaseMock = { execute: vi.fn() };
      await renderGameForm(useCaseMock);

      const today = new Date().toISOString().split('T')[0];
      const dateInput = screen.getByLabelText(/purchase date/i);
      expect(dateInput).toHaveValue(today);
    });
  });

  describe('accessibility', () => {
    it('should have ARIA labels on all form fields', async () => {
      const useCaseMock = { execute: vi.fn() };
      await renderGameForm(useCaseMock);

      expect(screen.getByRole('textbox', { name: /game title/i })).toHaveAccessibleName();
      expect(screen.getByRole('combobox', { name: /platform/i })).toHaveAccessibleName();
      expect(screen.getByRole('radiogroup', { name: /format/i })).toHaveAccessibleName();
      expect(screen.getByRole('textbox', { name: /description/i })).toHaveAccessibleName();
    });

    it('should mark title as required', async () => {
      const useCaseMock = { execute: vi.fn() };
      await renderGameForm(useCaseMock);

      expect(screen.getByRole('textbox', { name: /game title/i })).toBeRequired();
    });

    it('should mark platform as required', async () => {
      const useCaseMock = { execute: vi.fn() };
      await renderGameForm(useCaseMock);

      expect(screen.getByRole('combobox', { name: /platform/i })).toBeRequired();
    });
  });

  describe('validation', () => {
    it('should display an error when title is submitted empty', async () => {
      const user = userEvent.setup();
      const useCaseMock = { execute: vi.fn() };
      await renderGameForm(useCaseMock);

      await user.click(screen.getByRole('button', { name: /add game/i }));

      await waitFor(() => {
        expect(screen.getByText('Game title cannot be empty')).toBeInTheDocument();
      });
    });

    it('should display an error when platform is not selected', async () => {
      const user = userEvent.setup();
      const useCaseMock = { execute: vi.fn() };
      await renderGameForm(useCaseMock);

      await user.type(screen.getByRole('textbox', { name: /game title/i }), 'Some Game');
      await user.click(screen.getByRole('button', { name: /add game/i }));

      await waitFor(() => {
        expect(screen.getByText('Platform name is required')).toBeInTheDocument();
      });
    });

    it('should associate validation errors with their fields via aria-errormessage', async () => {
      const user = userEvent.setup();
      const useCaseMock = { execute: vi.fn() };
      await renderGameForm(useCaseMock);

      await user.click(screen.getByRole('button', { name: /add game/i }));

      await waitFor(() => {
        const titleInput = screen.getByRole('textbox', { name: /game title/i });
        expect(titleInput).toHaveAccessibleErrorMessage('Game title cannot be empty');
      });
    });

    it('should not call the use case when the form is invalid', async () => {
      const user = userEvent.setup();
      const executeMock = vi.fn();
      await renderGameForm({ execute: executeMock });

      await user.click(screen.getByRole('button', { name: /add game/i }));

      expect(executeMock).not.toHaveBeenCalled();
    });
  });

  describe('submission', () => {
    it('should call the use case with an AddGameDTO on valid submit', async () => {
      const user = userEvent.setup();
      const executeMock = vi.fn().mockResolvedValue(Result.ok(undefined));
      await renderGameForm({ execute: executeMock });

      await fillRequiredFields(user);
      await user.click(screen.getByRole('button', { name: /add game/i }));

      await waitFor(() => {
        expect(executeMock).toHaveBeenCalledOnce();
      });
      expect(executeMock).toHaveBeenCalledWith(expect.any(AddGameDTO));
    });

    it('should pass the correct values to the use case', async () => {
      const user = userEvent.setup();
      const executeMock = vi.fn().mockResolvedValue(Result.ok(undefined));
      await renderGameForm({ execute: executeMock });

      await user.type(screen.getByRole('textbox', { name: /game title/i }), 'Zelda');
      await user.selectOptions(screen.getByRole('combobox', { name: /platform/i }), 'Nintendo Switch');
      await user.click(screen.getByRole('radio', { name: 'Digital' }));

      await user.click(screen.getByRole('button', { name: /add game/i }));

      await waitFor(() => {
        const dto: AddGameDTO = executeMock.mock.calls[0][0];
        expect(dto.title).toBe('Zelda');
        expect(dto.platform).toBe('Nintendo Switch');
        expect(dto.format).toBe('Digital');
        expect(dto.status).toBe('Owned');
      });
    });

    it('should display a success message after successful submission', async () => {
      const user = userEvent.setup();
      const executeMock = vi.fn().mockResolvedValue(Result.ok(undefined));
      await renderGameForm({ execute: executeMock });

      await fillRequiredFields(user);
      await user.click(screen.getByRole('button', { name: /add game/i }));

      await waitFor(() => {
        expect(screen.getByText('Game added successfully')).toBeInTheDocument();
      });
    });

    it('should reset the form after successful submission', async () => {
      const user = userEvent.setup();
      const executeMock = vi.fn().mockResolvedValue(Result.ok(undefined));
      await renderGameForm({ execute: executeMock });

      await fillRequiredFields(user);
      await user.click(screen.getByRole('button', { name: /add game/i }));

      await waitFor(() => {
        expect(screen.getByRole('textbox', { name: /game title/i })).toHaveValue('');
      });
    });

    it('should display an error message when the use case fails', async () => {
      const user = userEvent.setup();
      const executeMock = vi
        .fn()
        .mockResolvedValue(
          Result.err({ type: 'Repository', message: 'Storage quota exceeded', name: 'RepositoryError' }),
        );
      await renderGameForm({ execute: executeMock });

      await fillRequiredFields(user);
      await user.click(screen.getByRole('button', { name: /add game/i }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText('Unable to add game')).toBeInTheDocument();
      });
    });
  });
});
