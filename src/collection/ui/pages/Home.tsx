import { GameList } from '@Collection/ui/components/GameList/GameList';
import { Grid, Title } from '@pplancq/shelter-ui-react';
import type { CSSProperties } from 'react';
import type { RouteObject } from 'react-router';

const Home = () => {
  return (
    <Grid as="main" container style={{ '--gap': 'var(--gap-1)' } as CSSProperties}>
      <Grid
        as={Title}
        title="My Game Collection"
        colSpan={{
          mobile: 4,
          tablet: 8,
          'desktop-small': 12,
        }}
      />
      <GameList />
    </Grid>
  );
};

export const homeRoutes: RouteObject = {
  index: true,
  element: <Home />,
};
