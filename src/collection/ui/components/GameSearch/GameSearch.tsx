import { GameFilterCriteria } from '@Collection/domain/entities/GameFilterCriteria';
import { useGamesStore } from '@Collection/ui/hooks/useGamesStore/useGamesStore';
import { Grid } from '@pplancq/shelter-ui-react';
import type { ChangeEvent } from 'react';
import { useCallback, useEffect, useRef } from 'react';

import defaultClasses from './GameSearch.module.css';

/**
 * Search component for filtering games by title
 *
 * Features:
 * - Debounced search input (300ms delay)
 * - Case-insensitive substring matching
 * - Accessible with proper labels and ARIA attributes
 * - Integrates with GamesStore to trigger filtered fetches
 *
 * @example
 * ```tsx
 * <GameSearch />
 * ```
 */
export const GameSearch = () => {
  const store = useGamesStore();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const searchText = event.currentTarget.value;

      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        const trimmedSearchText = searchText.trim();

        if (trimmedSearchText === '') {
          store.setFilterCriteria(null);
          return;
        }

        const criteriaResult = GameFilterCriteria.create({ title: trimmedSearchText });
        if (criteriaResult.isOk()) {
          store.setFilterCriteria(criteriaResult.unwrap());
        }
      }, 300);
    },
    [store],
  );

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  return (
    <Grid
      colSpan={{
        mobile: 4,
        tablet: 8,
        'desktop-small': 12,
      }}
      className={defaultClasses.searchContainer}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor="game-search" className={defaultClasses.label}>
        Search games
      </label>
      <input
        id="game-search"
        type="search"
        defaultValue=""
        onChange={handleChange}
        placeholder="Search by title..."
        aria-label="Search games by title"
        className={defaultClasses.searchInput}
      />
    </Grid>
  );
};
