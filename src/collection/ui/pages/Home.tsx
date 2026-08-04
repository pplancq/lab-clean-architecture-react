import { FilterForm } from '@Collection/ui/components/FilterForm/FilterForm';
import { GameList } from '@Collection/ui/components/GameList/GameList';
import { Grid, Title } from '@pplancq/shelter-ui-react';
import type { RouteObject } from 'react-router';

const Home = () => {
  return (
    <>
      <Grid
        as={Title}
        title="My Game Collection"
        colSpan={{
          mobile: 4,
          tablet: 8,
          'desktop-small': 12,
        }}
      />
      <FilterForm />
      <GameList />
    </>
  );
};

export const homeRoutes: RouteObject = {
  index: true,
  element: <Home />,
};
