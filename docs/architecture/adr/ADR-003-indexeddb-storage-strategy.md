## ADR-003: IndexedDB Storage Strategy

**Date:** 2026-01-22  
**Status:** ✅ Accepted

### Context

The application requires offline-first data persistence for:

- Game collection (CRUD operations)
- Wishlist items with priority tracking
- Console maintenance records
- IGDB API metadata caching (minimize API calls)

**Requirements:**

- No backend database (client-side only)
- Offline functionality (PWA requirement)
- Fast read/write performance
- Structured data with relationships (games → platforms, wishlist → games)

**Alternatives Considered:**

- **LocalStorage**: ❌ 5-10MB limit, synchronous API (blocks UI), no indexing
- **SessionStorage**: ❌ Cleared on tab close (unsuitable for persistent collections)
- **IndexedDB**: ✅ Asynchronous, 50MB+ quota, indexes for fast queries, structured storage
- **WebSQL**: ❌ Deprecated, no browser support

### Decision

Use **IndexedDB** as the primary client-side storage mechanism, with the `idb` library wrapper for Promise-based API.

**Implementation:**

```typescript
// shared/infrastructure/storage/db.ts
import { openDB, DBSchema } from 'idb';

interface AppDB extends DBSchema {
  games: {
    key: string; // GameId
    value: {
      id: string;
      title: string;
      platform: string;
      status: 'owned' | 'playing' | 'completed';
      addedAt: number;
    };
    indexes: { 'by-platform': string; 'by-status': string };
  };
  wishlist: {
    key: string;
    value: {
      /* ... */
    };
    indexes: { 'by-priority': string };
  };
  // One object store per bounded context
}

export const db = await openDB<AppDB>('game-collection-db', 1, {
  upgrade(db) {
    const gameStore = db.createObjectStore('games', { keyPath: 'id' });
    gameStore.createIndex('by-platform', 'platform');
    gameStore.createIndex('by-status', 'status');
    // ... other stores
  },
});
```

**Repository Implementation:**

```typescript
// collection/infrastructure/persistence/IndexedDBGameRepository.ts
export class IndexedDBGameRepository implements IGameRepository {
  async save(game: Game): Promise<Result<void, RepositoryError>> {
    try {
      await db.put('games', game.toPersistence());
      return Result.ok(undefined);
    } catch (error) {
      return Result.fail(new RepositoryError('save', error as Error));
    }
  }

  async findById(id: GameId): Promise<Result<Game, NotFoundError>> {
    const data = await db.get('games', id.value);
    if (!data) {
      return Result.fail(new NotFoundError('Game', id.value));
    }
    return Result.ok(Game.fromPersistence(data));
  }
}
```

**Caching Strategy:**

- **Game Metadata (IGDB API)**: Cache-first with 30-day TTL
- **User Collections**: Write-through (immediate IndexedDB write)
- **Search Results**: In-memory only (IndexedDB provides fast queries, no need to cache)

### Consequences

**Positive:**

- ✅ **Offline-First**: Full CRUD operations without network (PWA requirement met)
- ✅ **Performance**: Asynchronous API (no UI blocking), indexed queries for filtering
- ✅ **Storage Quota**: 50MB+ quota (sufficient for thousands of games)
- ✅ **Structured Data**: Relational-like storage with indexes (better than LocalStorage key-value)
- ✅ **Clean Architecture Compliance**: Repository pattern abstracts storage (swap to Firebase later if needed)

**Negative:**

- ❌ **Browser Quota Limits**: User may hit storage quota (mitigated by cleanup strategy)
- ❌ **No Cross-Device Sync**: Data stored locally only (future: Firebase sync)
- ❌ **Migration Complexity**: Schema changes require versioned migrations
- ❌ **Developer Experience**: More complex than LocalStorage (mitigated by `idb` library)

**Trade-offs Accepted:**

- LocalStorage simplicity vs. IndexedDB capabilities → **Capabilities win** (structured data, offline queries)
- Single shared DB vs. DB per context → **Shared DB wins** (simpler schema management, coordinated migrations)

**Migration Strategy:**

```typescript
// Version 2 migration example
export const db = await openDB<AppDB>('game-collection-db', 2, {
  upgrade(db, oldVersion) {
    if (oldVersion < 2) {
      const gameStore = db.transaction.objectStore('games');
      gameStore.createIndex('by-genre', 'genre'); // New index
    }
  },
});
```

---
