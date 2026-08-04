import { TopBar } from '@Shared/ui/components/TopBar/TopBar';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it } from 'vitest';

const renderTopBar = (initialEntries: string[] = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="*" element={<TopBar />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('TopBar', () => {
  describe('rendering', () => {
    it('should render the logo link', () => {
      renderTopBar();
      expect(screen.getByRole('link', { name: 'Game Collection' })).toBeInTheDocument();
    });

    it('should render the navigation landmark with accessible name', () => {
      renderTopBar();
      expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
    });

    it('should render the Collection navigation link', () => {
      renderTopBar();
      expect(screen.getByRole('link', { name: 'Collection' })).toBeInTheDocument();
    });

    it('should render the Wishlist navigation link', () => {
      renderTopBar();
      expect(screen.getByRole('link', { name: 'Wishlist' })).toBeInTheDocument();
    });

    it('should render the burger button', () => {
      renderTopBar();
      expect(screen.getByRole('button', { name: 'Open navigation menu' })).toBeInTheDocument();
    });

    it('should render the search input', () => {
      renderTopBar();
      expect(screen.getByRole('searchbox', { name: 'Search games' })).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should set aria-current="page" on the Collection link when on the home route', () => {
      renderTopBar(['/']);
      expect(screen.getByRole('link', { name: 'Collection' })).toHaveAttribute('aria-current', 'page');
    });

    it('should not set aria-current on the Wishlist link when on the home route', () => {
      renderTopBar(['/']);
      expect(screen.getByRole('link', { name: 'Wishlist' })).not.toHaveAttribute('aria-current', 'page');
    });

    it('should set aria-current="page" on the Wishlist link when on the wishlist route', () => {
      renderTopBar(['/wishlist']);
      expect(screen.getByRole('link', { name: 'Wishlist' })).toHaveAttribute('aria-current', 'page');
    });

    it('should not set aria-current on the Collection link when on the wishlist route', () => {
      renderTopBar(['/wishlist']);
      expect(screen.getByRole('link', { name: 'Collection' })).not.toHaveAttribute('aria-current', 'page');
    });

    it('should have aria-expanded="false" on the burger button initially', () => {
      renderTopBar();
      expect(screen.getByRole('button', { name: 'Open navigation menu' })).toHaveAttribute('aria-expanded', 'false');
    });

    it('should have aria-controls on the burger button referencing the drawer', () => {
      renderTopBar();
      expect(screen.getByRole('button', { name: 'Open navigation menu' })).toHaveAttribute(
        'aria-controls',
        'burger-menu-drawer',
      );
    });

    it('should have an accessible name on the logo link', () => {
      renderTopBar();
      expect(screen.getByRole('link', { name: 'Game Collection' })).toHaveAccessibleName('Game Collection');
    });
  });

  describe('interactions', () => {
    it('should open the burger menu when the burger button is clicked', async () => {
      const user = userEvent.setup();
      renderTopBar();

      await user.click(screen.getByRole('button', { name: 'Open navigation menu' }));

      expect(screen.getByRole('button', { name: 'Close navigation menu' })).toHaveAttribute('aria-expanded', 'true');
    });

    it('should close the burger menu when the burger button is clicked a second time', async () => {
      const user = userEvent.setup();
      renderTopBar();

      await user.click(screen.getByRole('button', { name: 'Open navigation menu' }));
      await user.click(screen.getByRole('button', { name: 'Close navigation menu' }));

      expect(screen.getByRole('button', { name: 'Open navigation menu' })).toHaveAttribute('aria-expanded', 'false');
    });
  });
});
