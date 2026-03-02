# ADR-011: Map-Centric Store with Auto-Triggered Fetches

**Status:** ✅ Accepted  
**Date:** 2026-03-02  
**Epic:** Epic 2 — Story 2.6

## Context

Story 2.5 introduced `GamesStore` with a public `fetchGames()` method. Components were responsible for triggering the fetch via `useLayoutEffect`:

```typescript
// GameList.tsx (Story 2.5)
const store = useGamesStore();
useLayoutEffect(() => {
  store.fetchGames();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```

Story 2.6 introduced a second use case (`GetGameByIdUseCase`) requiring per-entry loading state. This raised two problems:

1. **Each component needing game data would have to trigger its own fetch**, creating duplicated orchestration logic across the component tree.
2. **State per game entry was separate from list state**, making it hard to share data between the list view and detail view without double-fetching.

## Decision

Redesign `GamesStore` to be **map-centric with auto-triggered fetches**:

- A single `Map<string, GameMapEntryState>` is the source of truth for all game data
- `getGamesList()` auto-triggers `fetchGames()` on first call via `queueMicrotask`
- `getGame(id)` auto-triggers `fetchGameById(id)` if the entry is absent or lazy (`isLazy: true`)
- Both `fetchGames` and `fetchGameById` are **private** — components never call them directly
- An `isLazy` flag on each entry distinguishes partial data (loaded from list) vs full data (loaded from detail)

```typescript
// GamesStoreInterface.d.ts — public API only
export interface GamesStoreInterface extends AbstractObserverInterface {
  getGamesList(): GamesListState;
  getGame(id: string): GameMapEntryState;
}
```

```typescript
// Component usage — zero fetch orchestration
const { games, isLoading, hasError, error } = useGamesSelector(s => s.getGamesList());
const { data: game, isLoading, hasError, error } = useGamesSelector(s => s.getGame(id));
```

## Consequences

**Positive:**

- ✅ Components are pure consumers — zero fetch orchestration code in the UI layer
- ✅ Matches the React Query mental model: selectors trigger loading, store decides when to fetch
- ✅ `queueMicrotask` ensures the snapshot is returned synchronously (with `isLoading: true`) before the async fetch starts
- ✅ `isLazy` prevents double-fetching: if `getGame(id)` is called for a game already fully loaded, it returns immediately
- ✅ Data sharing between list and detail: full entry from `GetGameByIdUseCase` updates the map and is reused if `getGamesList()` is called again
- ✅ `commit(gamesChanged: boolean)` preserves stable array references for `useSyncExternalStore` (no re-renders when only loading state changes)

**Negative / Trade-offs:**

- ⚠️ No TTL / cache invalidation: data is never re-fetched after initial load (intentional for now, tracked as tech debt)
- ⚠️ `useGamesStore()` hook is no longer needed for fetch triggers — it remains available for future actions (e.g., delete, update)
- ⚠️ Testing requires `queueMicrotask` to be drained — `flushPromises` (a `setTimeout(0)` wrapper) is needed in tests

## Alternatives Considered

### Keep `fetchGames()` Public + Add `fetchGameById(id)` Public

Rejected because it scales poorly. Each new page with its own data needs would require components to know which fetch to call and when. The orchestration burden grows with the application.

### Separate Map for List vs Detail State

Rejected (was briefly considered). A single `gamesMap` allows data loaded from the detail view to serve the list view and vice versa. Two maps would require synchronization logic.

## References

- [GamesStoreInterface.d.ts](../../../../src/collection/application/stores/GamesStoreInterface.d.ts)
- [GamesStore.ts](../../../../src/collection/application/stores/GamesStore.ts)
- [Story 2.6 Retrospective](../../../../.copilot/story-2.6.md)
