import type { GetGamesUseCaseInterface } from '@Collection/application/use-cases/GetGamesUseCaseInterface';
import type { Game } from '@Collection/domain/entities/Game';
import { COLLECTION_SERVICES } from '@Collection/serviceIdentifiers';
import { Grid, Typography } from '@pplancq/shelter-ui-react';
import { useService } from '@Shared/ui/hooks/useService/useService';
import { type CSSProperties, useEffect, useState } from 'react';
import { GameCard } from '../GameCard/GameCard';

import defaultClasses from './GameList.module.css';

export const GameList = () => {
  const getGamesUseCase = useService<GetGamesUseCaseInterface>(COLLECTION_SERVICES.GetGamesUseCase);
  const [games, setGames] = useState<Game[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isLoading = games === null && error === null;

  useEffect(() => {
    let cancelled = false;

    const fetchGames = async () => {
      setError(null);

      const result = await getGamesUseCase.execute();

      if (cancelled) {
        return;
      }

      if (result.isErr()) {
        setError('Unable to load games. Please try again.');
        setGames(null);
      } else {
        setGames(result.unwrap());
        setError(null);
      }
    };

    fetchGames();

    return () => {
      cancelled = true;
    };
  }, [getGamesUseCase]);

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

  if (games?.length === 0) {
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
        {games?.length} {games?.length === 1 ? 'game' : 'games'} in collection
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
        {games?.map(game => (
          <Grid key={game.getId()} as="li" colSpan={{ mobile: 4, tablet: 4, 'desktop-small': 3 }}>
            <GameCard game={game} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};
