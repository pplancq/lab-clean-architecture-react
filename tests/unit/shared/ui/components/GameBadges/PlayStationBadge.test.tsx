import { PlayStationBadge } from '@Shared/ui/components/GameBadges/PlayStationBadge';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('PlayStationBadge', () => {
  it('should render the label "PlayStation"', async () => {
    render(<PlayStationBadge />);

    await waitFor(() => {
      expect(screen.getByText('PlayStation')).toBeInTheDocument();
    });
  });
});
