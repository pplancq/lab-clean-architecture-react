import { GameForm } from '@Collection/ui/components/GameForm/GameForm';
import type { RouteObject } from 'react-router';

const AddGame = () => {
  return <GameForm />;
};

export const addGameRoutes: RouteObject = {
  path: 'add-game',
  element: <AddGame />,
};
