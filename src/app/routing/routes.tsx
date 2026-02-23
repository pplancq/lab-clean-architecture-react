import { addGameRoutes } from '@Collection/ui/pages/AddGame';
import { homeRoutes } from '@Collection/ui/pages/Home';
import type { RouteObject } from 'react-router';

export const routeObject: RouteObject[] = [
  {
    path: '/',
    children: [homeRoutes, addGameRoutes],
  },
];
