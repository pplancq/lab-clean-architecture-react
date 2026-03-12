import { appRoutes } from '@App/routing/appRoutes';
import type { GamesStoreInterface } from '@Collection/application/stores/GamesStoreInterface';
import { COLLECTION_SERVICES } from '@Collection/serviceIdentifiers';
import { useGamesSelector } from '@Collection/ui/hooks/useGamesSelector/useGamesSelector';
import { Button, Grid, Title, Typography } from '@pplancq/shelter-ui-react';
import { ConfirmDialog } from '@Shared/ui/components/ConfirmDialog/ConfirmDialog';
import { useService } from '@Shared/ui/hooks/useService/useService';
import type { CSSProperties, MouseEvent } from 'react';
import { useCallback, useRef, useState } from 'react';
import type { RouteObject } from 'react-router';
import { Link, useNavigate, useParams } from 'react-router';

import defaultClasses from './GameDetail.module.css';

const GameDetail = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const store = useService<GamesStoreInterface>(COLLECTION_SERVICES.GamesStore);
  const { data: game, isLoading, hasError, error } = useGamesSelector(s => s.getGame(id));

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteTriggerRef = useRef<HTMLElement | null>(null);

  const handleDeleteClick = useCallback((e: MouseEvent<HTMLElement>) => {
    deleteTriggerRef.current = e.currentTarget;
    setShowDeleteModal(true);
  }, []);

  const handleDeleteCancel = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    const result = await store.deleteGame(id);
    if (result.isOk()) {
      navigate(appRoutes.home);
    } else {
      setShowDeleteModal(false);
    }
  }, [store, id, navigate]);

  const handleDialogClose = useCallback(() => {
    deleteTriggerRef.current?.focus();
  }, []);

  if (isLoading) {
    return (
      <main>
        <Grid
          as={Typography}
          colSpan={{
            mobile: 4,
            tablet: 8,
            'desktop-small': 12,
          }}
          color="secondary"
          className={defaultClasses.loading}
          role="status"
          aria-live="polite"
        >
          Loading game details…
        </Grid>
      </main>
    );
  }

  if (hasError && !error) {
    return (
      <main>
        <Grid
          container
          colSpan={{
            mobile: 4,
            tablet: 8,
            'desktop-small': 12,
          }}
        >
          <Grid
            as={Typography}
            colSpan={{
              mobile: 4,
              tablet: 8,
              'desktop-small': 12,
            }}
            className={defaultClasses.notFound}
            role="alert"
          >
            Game not found.
          </Grid>
          <Grid
            colSpan={{
              mobile: 4,
              tablet: 8,
              'desktop-small': 12,
            }}
            className={defaultClasses.nav}
          >
            <Link to={appRoutes.home}>Back to collection</Link>
          </Grid>
        </Grid>
      </main>
    );
  }

  if (hasError && error) {
    return (
      <main>
        <Grid
          as={Typography}
          colSpan={{
            mobile: 4,
            tablet: 8,
            'desktop-small': 12,
          }}
          className={defaultClasses.error}
          role="alert"
        >
          {error}
        </Grid>
      </main>
    );
  }

  if (!game) {
    return null;
  }

  return (
    <Grid as="main" container style={{ '--gap': 'var(--gap-1)' } as CSSProperties}>
      <Grid
        colSpan={{
          mobile: 4,
          tablet: 8,
          'desktop-small': 12,
        }}
        className={defaultClasses.nav}
      >
        <Link to={appRoutes.home}>Back to collection</Link>
      </Grid>

      <Grid
        as={Title}
        title={game.getTitle()}
        colSpan={{
          mobile: 4,
          tablet: 8,
          'desktop-small': 12,
        }}
      />

      <Grid
        colSpan={{
          mobile: 4,
          tablet: 8,
          'desktop-small': 12,
        }}
        className={defaultClasses.detail}
      >
        <div className={defaultClasses.coverPlaceholder} aria-hidden="true" />

        <div className={defaultClasses.meta}>
          <Typography as="p">
            <strong>Platform:</strong> {game.getPlatform()}
          </Typography>
          <Typography as="p">
            <strong>Format:</strong> {game.getFormat()}
          </Typography>
          <Typography as="p">
            <strong>Status:</strong> {game.getStatus()}
          </Typography>
          {game.getDescription() && (
            <Typography as="p">
              <strong>Description:</strong> {game.getDescription()}
            </Typography>
          )}
          <Typography as="p">
            <strong>Purchase date:</strong> {game.getPurchaseDate()?.toLocaleDateString() ?? '—'}
          </Typography>
        </div>
      </Grid>

      <Grid
        colSpan={{
          mobile: 4,
          tablet: 8,
          'desktop-small': 12,
        }}
        className={defaultClasses.actions}
      >
        <Button as={Link} to={appRoutes.editGame(id)}>
          Edit
        </Button>
        <Button color="danger" onClick={handleDeleteClick}>
          Delete
        </Button>
      </Grid>

      <ConfirmDialog
        open={showDeleteModal}
        title="Delete game"
        description={`Are you sure you want to delete ${game.getTitle()}? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        onClose={handleDialogClose}
      />
    </Grid>
  );
};

export const gameDetailRoutes: RouteObject = {
  path: 'games/:id',
  element: <GameDetail />,
};
