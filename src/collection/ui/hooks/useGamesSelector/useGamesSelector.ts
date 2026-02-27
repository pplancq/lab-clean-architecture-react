import type { GamesStoreInterface } from '@Collection/application/stores/GamesStoreInterface';
import { COLLECTION_SERVICES } from '@Collection/serviceIdentifiers';
import { useService } from '@Shared/ui/hooks/useService/useService';
import { useCallback, useRef, useSyncExternalStore } from 'react';

/**
 * Subscribes a component to a specific slice of the GamesStore state.
 *
 * The selector receives the store instance and returns the desired value.
 * Re-renders are triggered only when the selected value changes (Object.is).
 *
 * The selector reference is tracked via a ref so the getSnapshot function
 * stays stable across renders, compatible with React's concurrent mode.
 *
 * @example
 * // Subscribe to the full state (all 3 values trigger re-render)
 * const { games, isLoading, error } = useGamesSelector(s => s.getGamesList());
 *
 * @example
 * // Subscribe to a single boolean — re-renders only when isLoading changes
 * const isLoading = useGamesSelector(s => s.getGamesList().isLoading);
 */
export const useGamesSelector = <T>(selector: (store: GamesStoreInterface) => T): T => {
  const store = useService<GamesStoreInterface>(COLLECTION_SERVICES.GamesStore);

  const selectorRef = useRef(selector);
  selectorRef.current = selector;

  return useSyncExternalStore(
    useCallback(cb => store.subscribe(cb), [store]),
    useCallback(() => selectorRef.current(store), [store]),
  );
};
