import { homeRoutes } from '@Front/collection/ui/pages/Home';
import type { RouteObject } from 'react-router';

export const routeObject: RouteObject[] = [
  {
    path: '/',
    children: [homeRoutes],
  },
];
