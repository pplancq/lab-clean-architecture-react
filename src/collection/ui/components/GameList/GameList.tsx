import { useGamesSelector } from '@Collection/ui/hooks/useGamesSelector/useGamesSelector';
import { useGamesStore } from '@Collection/ui/hooks/useGamesStore/useGamesStore';
import { Grid, Typography } from '@pplancq/shelter-ui-react';
import { type CSSProperties, useLayoutEffect } from 'react';
import { GameCard } from '../GameCard/GameCard';

import defaultClasses from './GameList.module.css';

export const GameList = () => {
  const store = useGamesStore();
  const { games, error, isLoading } = useGamesSelector(s => s.getGamesList());

  useLayoutEffect(() => {
    store.fetchGames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
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
        Loading your game collection…
      </Grid>
    );
  }

  if (error) {
    return (
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
    );
  }

  if (games.length === 0) {
    return (
      <Grid
        as={Typography}
        colSpan={{
          mobile: 4,
          tablet: 8,
          'desktop-small': 12,
        }}
        color="secondary"
        className={defaultClasses.emptyState}
      >
        Add your first game!
      </Grid>
    );
  }

  return (
    <Grid
      container
      colSpan={{
        mobile: 4,
        tablet: 8,
        'desktop-small': 12,
      }}
      style={{ '--gap': 'var(--gap-4)' } as CSSProperties}
    >
      <Grid
        as="p"
        colSpan={{
          mobile: 4,
          tablet: 8,
          'desktop-small': 12,
        }}
        aria-live="polite"
      >
        {games.length} {games.length === 1 ? 'game' : 'games'} in collection
      </Grid>

      <Grid
        as="ul"
        colSpan={{
          mobile: 4,
          tablet: 8,
          'desktop-small': 12,
        }}
        container
        aria-label="Game collection"
        style={{ listStyle: 'none', padding: 0, margin: 0 }}
      >
        {games.map(game => (
          <Grid key={game.getId()} as="li" colSpan={{ mobile: 4, tablet: 4, 'desktop-small': 3 }}>
            <GameCard game={game} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};
