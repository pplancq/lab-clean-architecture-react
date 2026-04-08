import { XboxBadge } from '@Shared/ui/components/GameBadges/XboxBadge';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('XboxBadge', () => {
  it('should render the label "Xbox"', async () => {
    render(<XboxBadge />);

    await waitFor(() => {
      expect(screen.getByText('Xbox')).toBeInTheDocument();
    });
  });
});
