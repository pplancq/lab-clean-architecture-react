import { renderSuspense } from '@pplancq/svg-react/tests';
import { TextAreaField } from '@Shared/ui/components/TextAreaField/TextAreaField';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('TextAreaField', () => {
  describe('rendering', () => {
    it('should render a textarea with an accessible label', () => {
      render(<TextAreaField id="description" label="Description" />);

      expect(screen.getByRole('textbox', { name: 'Description' })).toBeInTheDocument();
    });

    it('should render a label associated to the textarea via htmlFor/id', () => {
      render(<TextAreaField id="notes" label="Notes" />);

      const textarea = screen.getByRole('textbox', { name: 'Notes' });
      expect(textarea).toHaveAttribute('id', 'notes');
    });

    it('should indicate required fields to assistive technologies', () => {
      render(<TextAreaField id="description" label="Description" required />);

      expect(screen.getByRole('textbox', { name: /Description/ })).toBeRequired();
    });

    it('should associate the label and textarea when no id is provided', () => {
      render(<TextAreaField label="Notes" />);

      const textarea = screen.getByRole('textbox', { name: 'Notes' });
      expect(textarea).toBeInTheDocument();
      // The label must be associated: getByRole with name verifies htmlFor/id linkage
      expect(textarea).toHaveAttribute('id');
    });
  });

  describe('helper text', () => {
    it('should render helper text when provided', async () => {
      await renderSuspense(<TextAreaField id="description" label="Description" textHelper="Optional field" />);

      expect(screen.getByText('Optional field')).toBeInTheDocument();
    });

    it('should associate helper text with the textarea via aria-describedby', async () => {
      await renderSuspense(<TextAreaField id="description" label="Description" textHelper="Optional field" />);

      const textarea = screen.getByRole('textbox', { name: 'Description' });
      expect(textarea).toHaveAttribute('aria-describedby', 'description-helper');
    });
  });

  describe('error state', () => {
    it('should render an error message when provided', async () => {
      await renderSuspense(
        <TextAreaField id="description" label="Description" errorMessage="This field is required" />,
      );

      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('should mark the textarea as invalid when errorMessage is provided', async () => {
      await renderSuspense(
        <TextAreaField id="description" label="Description" errorMessage="This field is required" />,
      );

      expect(screen.getByRole('textbox', { name: 'Description' })).toHaveAttribute('aria-invalid', 'true');
    });

    it('should have an accessible error message via aria-errormessage', async () => {
      await renderSuspense(
        <TextAreaField id="description" label="Description" errorMessage="This field is required" />,
      );

      const textarea = screen.getByRole('textbox', { name: 'Description' });
      expect(textarea).toHaveAccessibleErrorMessage('This field is required');
    });

    it('should prioritise errorMessage over textHelper', async () => {
      await renderSuspense(
        <TextAreaField
          id="description"
          label="Description"
          textHelper="Optional field"
          errorMessage="This field is required"
        />,
      );

      expect(screen.getByText('This field is required')).toBeInTheDocument();
      expect(screen.queryByText('Optional field')).not.toBeInTheDocument();
    });

    it('should not mark the textarea as invalid when no errorMessage is provided', () => {
      render(<TextAreaField id="description" label="Description" />);

      expect(screen.getByRole('textbox', { name: 'Description' })).not.toHaveAttribute('aria-invalid');
    });
  });

  describe('native textarea props', () => {
    it('should forward native props such as rows and placeholder', () => {
      render(<TextAreaField id="description" label="Description" rows={4} placeholder="Enter description…" />);

      const textarea = screen.getByRole('textbox', { name: 'Description' });
      expect(textarea).toHaveAttribute('rows', '4');
      expect(textarea).toHaveAttribute('placeholder', 'Enter description…');
    });
  });
});
