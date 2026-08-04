import { GameFilterCriteria } from '@Collection/domain/entities/GameFilterCriteria';
import { GamePlatformFilter } from '@Collection/ui/components/GamePlatformFilter/GamePlatformFilter';
import { GameSearch } from '@Collection/ui/components/GameSearch/GameSearch';
import { useGamesStore } from '@Collection/ui/hooks/useGamesStore/useGamesStore';
import type { DebounceServiceInterface } from '@Shared/domain/utils/DebounceServiceInterface';
import { SHARED_SERVICES } from '@Shared/serviceIdentifiers';
import { useService } from '@Shared/ui/hooks/useService/useService';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

type FilterFormData = {
  title: string;
  platforms: string[];
};

/**
 * Filter form for the game collection.
 *
 * Wraps GameSearch (title field) and GamePlatformFilter (platform checkboxes)
 * in a shared RHF FormProvider. Subscribes to field changes via form.watch()
 * and calls store.setFilterCriteria() to trigger filtered fetches:
 * - Title changes are debounced (300 ms)
 * - Platform changes are applied immediately
 *
 * @example
 * ```tsx
 * <FilterForm />
 * ```
 */
export const FilterForm = () => {
  const store = useGamesStore();
  const debounceService = useService<DebounceServiceInterface>(SHARED_SERVICES.DebounceService);

  const methods = useForm<FilterFormData>({
    defaultValues: { title: '', platforms: [] },
  });

  useEffect(() => {
    const debouncedUpdate = debounceService.debounce((title: string, platforms: string[]) => {
      const trimmedTitle = title.trim();
      const activePlatforms = platforms.length > 0 ? platforms : undefined;

      if (!trimmedTitle && !activePlatforms) {
        store.setFilterCriteria(null);
        return;
      }

      const criteriaResult = GameFilterCriteria.create({
        title: trimmedTitle || undefined,
        platforms: activePlatforms,
      });

      if (criteriaResult.isOk()) {
        store.setFilterCriteria(criteriaResult.unwrap());
      }
    }, 300);

    const subscription = methods.watch((values, { name }) => {
      const title = values.title ?? '';
      const platforms = values.platforms ?? [];

      if (name === 'platforms') {
        const activePlatforms = platforms.length > 0 ? platforms : undefined;
        const trimmedTitle = title.trim();

        if (!trimmedTitle && !activePlatforms) {
          store.setFilterCriteria(null);
          return;
        }

        const criteriaResult = GameFilterCriteria.create({
          title: trimmedTitle || undefined,
          platforms: activePlatforms,
        });

        if (criteriaResult.isOk()) {
          store.setFilterCriteria(criteriaResult.unwrap());
        }
      } else {
        debouncedUpdate(title, platforms as string[]);
      }
    });

    return () => subscription.unsubscribe();
  }, [methods, store, debounceService]);

  return (
    <FormProvider {...methods}>
      <form aria-label="Filter games" noValidate>
        <GameSearch />
        <GamePlatformFilter />
      </form>
    </FormProvider>
  );
};
