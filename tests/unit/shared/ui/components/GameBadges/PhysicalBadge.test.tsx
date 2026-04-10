import { PhysicalBadge } from '@Shared/ui/components/GameBadges/PhysicalBadge';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('PhysicalBadge', () => {
  it('should render the label "Physical"', async () => {
    render(<PhysicalBadge />);
    await waitFor(() => {
      expect(screen.getByText('Physical')).toBeInTheDocument();
    });
  });
});
