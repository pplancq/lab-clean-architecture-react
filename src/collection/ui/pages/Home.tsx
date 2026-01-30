import type { RouteObject } from 'react-router';

const Home = () => {
  return <div>HomePage</div>;
};

export const homeRoutes: RouteObject = {
  index: true,
  element: <Home />,
};
