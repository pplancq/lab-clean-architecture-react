import { createBrowserRouter, RouterProvider } from 'react-router';
import { routeObject } from './routes';

interface RouterProps {
  basename?: string;
}

export const Router = ({ basename }: RouterProps = {}) => {
  const router = createBrowserRouter(routeObject, {
    basename,
  });

  return <RouterProvider router={router} />;
};
