import { ConfirmDialog } from '@Shared/ui/components/ConfirmDialog/ConfirmDialog';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

const renderConfirmDialog = (overrides: Partial<React.ComponentProps<typeof ConfirmDialog>> = {}) => {
  const props = {
    open: true,
    title: 'Delete item',
    description: 'Are you sure? This action cannot be undone.',
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
    ...overrides,
  };
  render(<ConfirmDialog {...props} />);
  return props;
};

describe('ConfirmDialog', () => {
  describe('rendering', () => {
    it('should render dialog with accessible role when open', () => {
      renderConfirmDialog();
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should label the dialog with the title', () => {
      renderConfirmDialog({ title: 'Confirm deletion' });
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAccessibleName('Confirm deletion');
    });

    it('should render the title as a heading', () => {
      renderConfirmDialog({ title: 'Delete item' });
      expect(screen.getByRole('heading', { name: 'Delete item' })).toBeInTheDocument();
    });

    it('should render the description text', () => {
      renderConfirmDialog({ description: 'Are you sure? This action cannot be undone.' });
      expect(screen.getByText('Are you sure? This action cannot be undone.')).toBeInTheDocument();
    });

    it('should render Cancel and confirm buttons', () => {
      renderConfirmDialog({ cancelLabel: 'Cancel', confirmLabel: 'Delete' });
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    });

    it('should not render the dialog in the DOM when closed', () => {
      renderConfirmDialog({ open: false });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('should call onCancel when Cancel button is clicked', async () => {
      const user = userEvent.setup();
      const { onCancel } = renderConfirmDialog();

      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('should call onConfirm when confirm button is clicked', async () => {
      const user = userEvent.setup();
      const { onConfirm } = renderConfirmDialog();

      await user.click(screen.getByRole('button', { name: 'Delete' }));

      expect(onConfirm).toHaveBeenCalledTimes(1);
    });
  });

  describe('accessibility', () => {
    it('should associate the description with the dialog via aria-describedby', () => {
      renderConfirmDialog({ description: 'This action cannot be undone.' });
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAccessibleDescription('This action cannot be undone.');
    });

    it('should render Cancel button before the confirm button for safe default focus', () => {
      renderConfirmDialog();
      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveAccessibleName('Cancel');
      expect(buttons[1]).toHaveAccessibleName('Delete');
    });
  });
});
