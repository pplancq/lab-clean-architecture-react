import gameStructureIcon from '@pplancq/shelter-ui-icon/icon/game-structure.svg';
import { Badge } from '@Shared/ui/components/Badge/Badge';
import { BadgeContainer } from '@Shared/ui/components/BadgeContainer/BadgeContainer';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

const anyIcon = gameStructureIcon as string;

describe('BadgeContainer', () => {
  describe('rendering', () => {
    it('should render two Badge children', async () => {
      render(
        <BadgeContainer>
          <Badge icon={anyIcon} color="primary">
            PS5
          </Badge>
          <Badge icon={anyIcon} color="success">
            Physical
          </Badge>
        </BadgeContainer>,
      );

      await waitFor(() => {
        expect(screen.getByText('PS5')).toBeInTheDocument();
        expect(screen.getByText('Physical')).toBeInTheDocument();
      });
    });

    it('should render three Badge children', async () => {
      render(
        <BadgeContainer>
          <Badge icon={anyIcon} color="primary">
            Nintendo Switch
          </Badge>
          <Badge icon={anyIcon} color="success">
            Physical
          </Badge>
          <Badge icon={anyIcon} color="critical">
            High
          </Badge>
        </BadgeContainer>,
      );

      await waitFor(() => {
        expect(screen.getByText('Nintendo Switch')).toBeInTheDocument();
        expect(screen.getByText('Physical')).toBeInTheDocument();
        expect(screen.getByText('High')).toBeInTheDocument();
      });
    });

    it('should apply the container CSS class', async () => {
      render(
        <BadgeContainer data-testid="container">
          <Badge icon={anyIcon}>Xbox</Badge>
        </BadgeContainer>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('container')).toHaveClass('container');
      });
    });
  });
});
