import { NintendoBadge } from '@Shared/ui/components/GameBadges/NintendoBadge';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('NintendoBadge', () => {
  it('should render the label "Nintendo"', async () => {
    render(<NintendoBadge />);
    await waitFor(() => {
      expect(screen.getByText('Nintendo')).toBeInTheDocument();
    });
  });
});
