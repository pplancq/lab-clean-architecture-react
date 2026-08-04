import { GameSearch } from '@Collection/ui/components/GameSearch/GameSearch';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { FormProvider, useForm } from 'react-hook-form';
import type { PropsWithChildren } from 'react';

const FormWrapper = ({ children }: PropsWithChildren) => {
  const methods = useForm({ defaultValues: { title: '', platforms: [] } });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('GameSearch', () => {
  it('should render a search input with accessible label and name', () => {
    render(<GameSearch />, { wrapper: FormWrapper });

    const input = screen.getByRole('searchbox', { name: /search games by title/i });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAccessibleName('Search games by title');
  });

  it('should render placeholder text', () => {
    render(<GameSearch />, { wrapper: FormWrapper });

    expect(screen.getByPlaceholderText(/search by title/i)).toBeInTheDocument();
  });

  it('should register the title field and accept user input', async () => {
    const user = userEvent.setup();
    render(<GameSearch />, { wrapper: FormWrapper });

    const input = screen.getByRole('searchbox', { name: /search games by title/i });
    await user.type(input, 'Mario');

    expect(input).toHaveValue('Mario');
  });

  it('should be of type search', () => {
    render(<GameSearch />, { wrapper: FormWrapper });

    const input = screen.getByRole('searchbox', { name: /search games by title/i });
    expect(input).toHaveAttribute('type', 'search');
  });
});
