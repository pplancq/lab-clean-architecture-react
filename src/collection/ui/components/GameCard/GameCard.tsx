import { appRoutes } from '@App/routing/appRoutes';
import type { Game } from '@Collection/domain/entities/Game';
import { Typography } from '@pplancq/shelter-ui-react';
import { Link } from 'react-router';

import defaultClasses from './GameCard.module.css';

type GameCardProps = {
  game: Game;
};

export const GameCard = ({ game }: GameCardProps) => {
  return (
    <article className={defaultClasses.card}>
      <Link
        to={appRoutes.gameDetail(game.getId())}
        aria-label={`${game.getTitle()} — ${game.getPlatform()}, ${game.getFormat()}`}
      >
        <div className={defaultClasses.coverPlaceholder} aria-hidden="true" />
        <div className={defaultClasses.info}>
          <Typography variant="heading" size={3}>
            {game.getTitle()}
          </Typography>
          <Typography variant="text" color="secondary">
            {game.getPlatform()}
          </Typography>
          <Typography variant="text" color="secondary">
            {game.getFormat()}
          </Typography>
        </div>
      </Link>
    </article>
  );
};
