import { renderSuspense } from '@pplancq/svg-react/tests';
import { SelectField } from '@Shared/ui/components/SelectField/SelectField';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

describe('SelectField', () => {
  describe('rendering', () => {
    it('should render a combobox with an accessible label', () => {
      render(
        <SelectField id="platform" label="Platform">
          <option value="ps5">PlayStation 5</option>
        </SelectField>,
      );

      expect(screen.getByRole('combobox', { name: 'Platform' })).toBeInTheDocument();
    });

    it('should render provided options', () => {
      render(
        <SelectField id="platform" label="Platform">
          <option value="">Select a platform</option>
          <option value="ps5">PlayStation 5</option>
          <option value="switch">Nintendo Switch</option>
        </SelectField>,
      );

      expect(screen.getByRole('option', { name: 'PlayStation 5' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Nintendo Switch' })).toBeInTheDocument();
    });

    it('should indicate required fields to assistive technologies', () => {
      render(
        <SelectField id="platform" label="Platform" required>
          <option value="">Select a platform</option>
        </SelectField>,
      );

      expect(screen.getByRole('combobox', { name: /Platform/ })).toBeRequired();
    });
  });

  describe('helper text', () => {
    it('should render helper text when provided', async () => {
      await renderSuspense(
        <SelectField id="platform" label="Platform" textHelper="Choose your gaming platform">
          <option value="">Select a platform</option>
        </SelectField>,
      );

      expect(screen.getByText('Choose your gaming platform')).toBeInTheDocument();
    });

    it('should associate helper text with the select via aria-describedby', async () => {
      await renderSuspense(
        <SelectField id="platform" label="Platform" textHelper="Choose your gaming platform">
          <option value="">Select a platform</option>
        </SelectField>,
      );

      const select = screen.getByRole('combobox', { name: 'Platform' });
      expect(select).toHaveAccessibleDescription('Choose your gaming platform');
    });
  });

  describe('error state', () => {
    it('should render an error message when provided', async () => {
      await renderSuspense(
        <SelectField id="platform" label="Platform" errorMessage="Platform is required">
          <option value="">Select a platform</option>
        </SelectField>,
      );

      expect(screen.getByText('Platform is required')).toBeInTheDocument();
    });

    it('should mark the select as invalid when errorMessage is provided', async () => {
      await renderSuspense(
        <SelectField id="platform" label="Platform" errorMessage="Platform is required">
          <option value="">Select a platform</option>
        </SelectField>,
      );

      expect(screen.getByRole('combobox', { name: 'Platform' })).toHaveAttribute('aria-invalid', 'true');
    });

    it('should have an accessible error message via aria-errormessage', async () => {
      await renderSuspense(
        <SelectField id="platform" label="Platform" errorMessage="Platform is required">
          <option value="">Select a platform</option>
        </SelectField>,
      );

      const select = screen.getByRole('combobox', { name: 'Platform' });
      expect(select).toHaveAccessibleErrorMessage('Platform is required');
    });

    it('should not mark the select as invalid when no errorMessage is provided', () => {
      render(
        <SelectField id="platform" label="Platform">
          <option value="">Select a platform</option>
        </SelectField>,
      );

      expect(screen.getByRole('combobox', { name: 'Platform' })).not.toHaveAttribute('aria-invalid');
    });
  });

  describe('interaction', () => {
    it('should allow selecting an option', async () => {
      const user = userEvent.setup();

      render(
        <SelectField id="platform" label="Platform">
          <option value="">Select a platform</option>
          <option value="ps5">PlayStation 5</option>
          <option value="switch">Nintendo Switch</option>
        </SelectField>,
      );

      const select = screen.getByRole('combobox', { name: 'Platform' });
      await user.selectOptions(select, 'ps5');

      expect(select).toHaveValue('ps5');
    });
  });
});
