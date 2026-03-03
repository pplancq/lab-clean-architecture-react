import { addGameRoutes } from '@Collection/ui/pages/AddGame';
import { editGameRoutes } from '@Collection/ui/pages/EditGame';
import { gameDetailRoutes } from '@Collection/ui/pages/GameDetail';
import { homeRoutes } from '@Collection/ui/pages/Home';
import type { RouteObject } from 'react-router';

export const routeObject: RouteObject[] = [
  {
    path: '/',
    children: [homeRoutes, addGameRoutes, gameDetailRoutes, editGameRoutes],
  },
];
