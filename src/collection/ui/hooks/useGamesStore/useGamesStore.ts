import type { GamesStoreInterface } from '@Collection/application/stores/GamesStoreInterface';
import { COLLECTION_SERVICES } from '@Collection/serviceIdentifiers';
import { useService } from '@Shared/ui/hooks/useService/useService';

/**
 * Returns the GamesStore singleton from the DI container.
 *
 * Use this hook to access store actions (e.g. fetchGames).
 * For subscribing to state, use useGamesSelector instead.
 *
 * @example
 * const store = useGamesStore();
 * useEffect(() => { store.fetchGames(); }, [store]);
 */
export const useGamesStore = () => useService<GamesStoreInterface>(COLLECTION_SERVICES.GamesStore);
