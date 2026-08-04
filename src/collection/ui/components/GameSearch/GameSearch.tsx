import { Grid } from '@pplancq/shelter-ui-react';
import { useFormContext } from 'react-hook-form';

import defaultClasses from './GameSearch.module.css';

/**
 * Search input field for filtering games by title.
 *
 * Must be rendered inside a FormProvider (provided by FilterForm).
 * Registers the "title" field into the parent RHF form context.
 *
 * @example
 * ```tsx
 * <FormProvider {...methods}>
 *   <GameSearch />
 * </FormProvider>
 * ```
 */
export const GameSearch = () => {
  const { register } = useFormContext<{ title: string }>();

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
        placeholder="Search by title..."
        aria-label="Search games by title"
        className={defaultClasses.searchInput}
        {...register('title')}
      />
    </Grid>
  );
};
