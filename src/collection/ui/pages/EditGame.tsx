import { appRoutes } from '@App/routing/appRoutes';
import type { EditGameDTO } from '@Collection/application/dtos/EditGameDTO';
import type { GamesStoreInterface } from '@Collection/application/stores/GamesStoreInterface';
import { COLLECTION_SERVICES } from '@Collection/serviceIdentifiers';
import { GameForm } from '@Collection/ui/components/GameForm/GameForm';
import { useGamesSelector } from '@Collection/ui/hooks/useGamesSelector/useGamesSelector';
import { Grid, Typography } from '@pplancq/shelter-ui-react';
import type { DateFormatterInterface } from '@Shared/domain/utils/DateFormatterInterface';
import { SHARED_SERVICES } from '@Shared/serviceIdentifiers';
import { useService } from '@Shared/ui/hooks/useService/useService';
import { useCallback } from 'react';
import type { RouteObject } from 'react-router';
import { Link, useNavigate, useParams } from 'react-router';

const EditGame = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const store = useService<GamesStoreInterface>(COLLECTION_SERVICES.GamesStore);
  const dateFormatter = useService<DateFormatterInterface>(SHARED_SERVICES.DateFormatter);
  const { data: game, isLoading, hasError, error } = useGamesSelector(s => s.getGame(id));

  const handleSuccess = useCallback(() => {
    navigate(appRoutes.gameDetail(id));
  }, [navigate, id]);

  const handleCancel = useCallback(() => {
    navigate(appRoutes.gameDetail(id));
  }, [navigate, id]);

  const handleSubmit = useCallback(
    (dto: EditGameDTO) => {
      return store.editGame(dto);
    },
    [store],
  );

  if (isLoading) {
    return (
      <main>
        <Grid
          as={Typography}
          colSpan={{ mobile: 4, tablet: 8, 'desktop-small': 12 }}
          color="secondary"
          role="status"
          aria-live="polite"
        >
          Loading game…
        </Grid>
      </main>
    );
  }

  if (hasError && !error) {
    return (
      <main>
        <Grid container colSpan={{ mobile: 4, tablet: 8, 'desktop-small': 12 }}>
          <Grid as={Typography} colSpan={{ mobile: 4, tablet: 8, 'desktop-small': 12 }} role="alert">
            Game not found.
          </Grid>
          <Grid colSpan={{ mobile: 4, tablet: 8, 'desktop-small': 12 }}>
            <Link to={appRoutes.home}>Back to collection</Link>
          </Grid>
        </Grid>
      </main>
    );
  }

  if (hasError && error) {
    return (
      <main>
        <Grid as={Typography} colSpan={{ mobile: 4, tablet: 8, 'desktop-small': 12 }} role="alert">
          {error}
        </Grid>
      </main>
    );
  }

  if (!game) {
    return null;
  }

  const initialData = {
    title: game.getTitle(),
    platform: game.getPlatform(),
    format: game.getFormat(),
    purchaseDate: game.getPurchaseDate() ? dateFormatter.toLocalDateString(game.getPurchaseDate()!) : '',
    description: game.getDescription(),
    status: game.getStatus(),
  };

  return (
    <main>
      <GameForm
        edit
        gameId={id}
        initialData={initialData}
        onSubmit={handleSubmit}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </main>
  );
};

export const editGameRoutes: RouteObject = {
  path: 'games/:id/edit',
  element: <EditGame />,
};
