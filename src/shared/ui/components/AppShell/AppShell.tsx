import { Grid } from '@pplancq/shelter-ui-react';
import { Outlet } from 'react-router';

import defaultClasses from './AppShell.module.css';

export const AppShell = () => {
  return (
    <>
      <a href="#maincontent" className={defaultClasses.skipLink}>
        Skip to main content
      </a>
      <Grid as="header" container>
        {/* TopBar will be added in Story 9.2 */}
      </Grid>
      <Grid as="main" id="maincontent" container className={defaultClasses.main} tabIndex={-1}>
        <Outlet />
      </Grid>
    </>
  );
};
