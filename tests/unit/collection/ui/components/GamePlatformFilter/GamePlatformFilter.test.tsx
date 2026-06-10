import { GamePlatformFilter } from '@Collection/ui/components/GamePlatformFilter/GamePlatformFilter';
import { PLATFORMS } from '@Collection/ui/constants/platforms';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import type { PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';

const FormWrapper = ({ children }: PropsWithChildren) => {
  const methods = useForm({ defaultValues: { title: '', platforms: [] as string[] } });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('GamePlatformFilter', () => {
  it('should render a fieldset with accessible legend', () => {
    render(<GamePlatformFilter />, { wrapper: FormWrapper });

    expect(screen.getByRole('group', { name: /filter by platform/i })).toBeInTheDocument();
  });

  it('should render a checkbox for each platform', () => {
    render(<GamePlatformFilter />, { wrapper: FormWrapper });

    PLATFORMS.forEach(platform => {
      expect(screen.getByRole('checkbox', { name: platform })).toBeInTheDocument();
    });
  });

  it('should render checkboxes unchecked by default', () => {
    render(<GamePlatformFilter />, { wrapper: FormWrapper });

    PLATFORMS.forEach(platform => {
      expect(screen.getByRole('checkbox', { name: platform })).not.toBeChecked();
    });
  });

  it('should check a platform checkbox when clicked', async () => {
    const user = userEvent.setup();
    render(<GamePlatformFilter />, { wrapper: FormWrapper });

    const checkbox = screen.getByRole('checkbox', { name: 'PlayStation 5' });
    await user.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  it('should allow multiple platforms to be selected', async () => {
    const user = userEvent.setup();
    render(<GamePlatformFilter />, { wrapper: FormWrapper });

    const ps5 = screen.getByRole('checkbox', { name: 'PlayStation 5' });
    const nsw = screen.getByRole('checkbox', { name: 'Nintendo Switch' });

    await user.click(ps5);
    await user.click(nsw);

    expect(ps5).toBeChecked();
    expect(nsw).toBeChecked();
  });

  it('should uncheck a platform checkbox when clicked again', async () => {
    const user = userEvent.setup();
    render(<GamePlatformFilter />, { wrapper: FormWrapper });

    const checkbox = screen.getByRole('checkbox', { name: 'PlayStation 5' });
    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('should have accessible names for all checkboxes', () => {
    render(<GamePlatformFilter />, { wrapper: FormWrapper });

    PLATFORMS.forEach(platform => {
      const checkbox = screen.getByRole('checkbox', { name: platform });
      expect(checkbox).toHaveAccessibleName(platform);
    });
  });
});
