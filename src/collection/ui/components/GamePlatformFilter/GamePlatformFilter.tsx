import { PLATFORMS } from '@Collection/ui/constants/platforms';
import { Grid } from '@pplancq/shelter-ui-react';
import { useFormContext } from 'react-hook-form';

import defaultClasses from './GamePlatformFilter.module.css';

/**
 * Multi-select platform filter using checkboxes.
 *
 * Must be rendered inside a FormProvider (provided by FilterForm).
 * Registers the "platforms" field (string[]) into the parent RHF form context.
 *
 * @example
 * ```tsx
 * <FormProvider {...methods}>
 *   <GamePlatformFilter />
 * </FormProvider>
 * ```
 */
export const GamePlatformFilter = () => {
  const { register } = useFormContext<{ platforms: string[] }>();

  return (
    <Grid
      colSpan={{
        mobile: 4,
        tablet: 8,
        'desktop-small': 12,
      }}
    >
      <fieldset className={defaultClasses.fieldset}>
        <legend className={defaultClasses.legend}>Filter by platform</legend>
        <div className={defaultClasses.checkboxGroup}>
          {PLATFORMS.map(platform => {
            const inputId = `platform-filter-${platform.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
            return (
              <label key={platform} htmlFor={inputId} className={defaultClasses.checkboxLabel}>
                <input id={inputId} type="checkbox" value={platform} {...register('platforms')} />
                {platform}
              </label>
            );
          })}
        </div>
      </fieldset>
    </Grid>
  );
};
