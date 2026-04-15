import { appRoutes } from '@App/routing/appRoutes';
import { BurgerMenuDrawer } from '@Shared/ui/components/BurgerMenuDrawer/BurgerMenuDrawer';
import { SearchInput } from '@Shared/ui/components/SearchInput/SearchInput';
import { useState } from 'react';
import { NavLink } from 'react-router';

import defaultClasses from './TopBar.module.css';

export const TopBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className={defaultClasses.topBar}>
      <NavLink to={appRoutes.home} className={defaultClasses.logo} aria-label="Game Collection" end>
        Game Collection
      </NavLink>

      <nav className={defaultClasses.desktopNav} aria-label="Main navigation">
        <ul className={defaultClasses.navList}>
          <li>
            <NavLink
              to={appRoutes.home}
              className={({ isActive }) =>
                isActive ? `${defaultClasses.navLink} ${defaultClasses.navLinkActive}` : defaultClasses.navLink
              }
              end
            >
              Collection
            </NavLink>
          </li>
          <li>
            <NavLink
              to={appRoutes.wishlist}
              className={({ isActive }) =>
                isActive ? `${defaultClasses.navLink} ${defaultClasses.navLinkActive}` : defaultClasses.navLink
              }
            >
              Wishlist
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className={defaultClasses.actions}>
        <button
          type="button"
          className={defaultClasses.burgerButton}
          onClick={handleToggleMenu}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          aria-controls="burger-menu-drawer"
        >
          <span aria-hidden="true">☰</span>
        </button>
        <SearchInput />
      </div>

      <BurgerMenuDrawer id="burger-menu-drawer" isOpen={isMenuOpen} onClose={handleCloseMenu} />
    </div>
  );
};
