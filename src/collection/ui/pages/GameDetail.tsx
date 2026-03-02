import { appRoutes } from '@App/routing/appRoutes';
import { useGamesSelector } from '@Collection/ui/hooks/useGamesSelector/useGamesSelector';
import { Button, Grid, Title, Typography } from '@pplancq/shelter-ui-react';
import type { CSSProperties } from 'react';
import type { RouteObject } from 'react-router';
import { Link, useParams } from 'react-router';

import defaultClasses from './GameDetail.module.css';

const GameDetail = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { data: game, isLoading, hasError, error } = useGamesSelector(s => s.getGame(id));

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
        <Button aria-disabled="true">Edit</Button>
        <Button aria-disabled="true" color="danger">
          Delete
        </Button>
      </Grid>
    </Grid>
  );
};

export const gameDetailRoutes: RouteObject = {
  path: 'games/:id',
  element: <GameDetail />,
};
