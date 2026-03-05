import { appRoutes } from '@App/routing/appRoutes';
import { AddGameDTO } from '@Collection/application/dtos/AddGameDTO';
import type { EditGameDTO } from '@Collection/application/dtos/EditGameDTO';
import { GameForm } from '@Collection/ui/components/GameForm/GameForm';
import { useGamesStore } from '@Collection/ui/hooks/useGamesStore/useGamesStore';
import { useCallback } from 'react';
import type { RouteObject } from 'react-router';
import { useNavigate } from 'react-router';

const AddGame = () => {
  const store = useGamesStore();
  const navigate = useNavigate();

  const handleSuccess = useCallback(() => {
    navigate(appRoutes.home);
  }, [navigate]);

  const handleSubmit = useCallback((dto: AddGameDTO | EditGameDTO) => {
    return store.addGame(dto as AddGameDTO);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <GameForm onSubmit={handleSubmit} onSuccess={handleSuccess} />;
};

export const addGameRoutes: RouteObject = {
  path: 'add-game',
  element: <AddGame />,
};
