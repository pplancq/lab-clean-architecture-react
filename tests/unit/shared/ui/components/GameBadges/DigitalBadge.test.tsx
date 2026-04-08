import { DigitalBadge } from '@Shared/ui/components/GameBadges/DigitalBadge';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('DigitalBadge', () => {
  it('should render the label "Digital"', async () => {
    render(<DigitalBadge />);
    await waitFor(() => {
      expect(screen.getByText('Digital')).toBeInTheDocument();
    });
  });
});
