import { AppShell } from '@Shared/ui/components/AppShell/AppShell';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it } from 'vitest';

const renderAppShell = (children = <div>Page content</div>) => {
  render(
    <MemoryRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={children} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
};

describe('AppShell', () => {
  describe('rendering', () => {
    it('should render the header landmark', () => {
      renderAppShell();
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('should render the main landmark', () => {
      renderAppShell();
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('should render page content via Outlet', () => {
      renderAppShell(<div>Page content</div>);
      expect(screen.getByText('Page content')).toBeInTheDocument();
    });

    it('should render a skip to main content link', () => {
      renderAppShell();
      const skipLink = screen.getByRole('link', { name: 'Skip to main content' });
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveAttribute('href', '#maincontent');
    });
  });

  describe('accessibility', () => {
    it('should give the main landmark id="maincontent" as skip link target', () => {
      renderAppShell();
      expect(screen.getByRole('main')).toHaveAttribute('id', 'maincontent');
    });

    it('should give the main landmark tabIndex={-1} to allow programmatic focus from skip link', () => {
      renderAppShell();
      expect(screen.getByRole('main')).toHaveAttribute('tabindex', '-1');
    });

    it('should render the skip link before the header landmark in the DOM', () => {
      renderAppShell();
      const skipLink = screen.getByRole('link', { name: 'Skip to main content' });
      const header = screen.getByRole('banner');
      expect(skipLink.compareDocumentPosition(header) && Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    it('should render the header landmark before the main landmark in the DOM', () => {
      renderAppShell();
      const header = screen.getByRole('banner');
      const main = screen.getByRole('main');
      expect(header.compareDocumentPosition(main) && Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });
  });
});
