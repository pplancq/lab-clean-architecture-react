# Architecture Decision Records (ADRs)

This document contains all architectural decisions made for the **lab-clean-architecture-react** project. Each ADR follows a standard format: Context, Decision, Consequences.

---

## ADR-001: Starter Template Selection (@pplancq/react-app)

**Date:** 2026-01-14  
**Status:** ✅ Accepted

### Context

The project requires a React SPA foundation with specific requirements:

- Rsbuild as build tool (modern Webpack/Vite alternative)
- TypeScript strict mode
- Clean Architecture layering without opinionated routing/state management
- Educational goals (demonstrating Clean Architecture in React)
- Integration with internal tooling ecosystem (`@pplancq/shelter-ui-react`, dev tools)

**Alternatives Considered:**

- **Vite React Template**: ❌ Missing Rsbuild requirement, generic structure incompatible with Clean Architecture layers
- **Next.js**: ❌ SSR/SSG overhead unnecessary for client-side SPA, opinionated file-based routing conflicts with domain-driven structure
- **Create React App**: ❌ Deprecated, missing modern tooling
- **@pplancq/react-app**: ✅ Pre-configured for Rsbuild, TypeScript strict mode, clean slate for architectural experimentation

### Decision

Use **`@pplancq/react-app`** as the project foundation.

**Rationale:**

- ✅ Exact Rsbuild configuration match (no reconfiguration needed)
- ✅ TypeScript strict mode pre-configured with project standards
- ✅ Automated git initialization and base dependency setup
- ✅ No opinionated routing/state management (enables pure Clean Architecture implementation)
- ✅ Controlled dependencies (only essential packages, no bloat)
- ✅ Internal tooling compatibility (same ecosystem as shelter-ui)

**Key Dependencies Included:**

```json
{
  "react": "^19.2.3",
  "react-dom": "^19.2.3",
  "@rsbuild/core": "latest",
  "typescript": "^5.x"
}
```

**Post-Install Steps:**

```bash
npm install inversify reflect-metadata # Dependency Injection
npm install react-router               # Routing (manual setup)
npm install react-hook-form            # Form management
npm install @pplancq/shelter-ui-react  # Design system
npm install idb                        # IndexedDB wrapper
npm install @tanstack/query-core       # State management (NOT React Query hooks)
```

### Consequences

**Positive:**

- ✅ Fast project initialization with correct tooling (Rsbuild, TypeScript strict)
- ✅ Complete architectural freedom (no framework constraints on Clean Architecture patterns)
- ✅ Consistent with tooling ecosystem (@pplancq packages)
- ✅ Educational transparency (no hidden framework magic)
- ✅ Open source and publicly available on GitHub

**Negative:**

- ❌ Requires manual installation of specialized libraries (shelter-ui, InversifyJS, etc.)
- ❌ Less popular than mainstream templates (Vite, Create React App)
- ❌ Smaller community (personal project vs ecosystem-wide template)

**Trade-offs Accepted:**

- Manual setup overhead vs. architectural control → **Control wins** (project is 80% learning, 20% utility)
- Popular template vs. exact tool match → **Exact match wins** (Rsbuild non-negotiable)

---

## ADR-002: Clean Architecture + DDD Bounded Contexts

**Date:** 2026-01-22  
**Status:** ✅ Accepted

### Context

The project serves as an educational laboratory to demonstrate Clean Architecture in a React SPA. Requirements:

- Strict layer separation (Entities, Use Cases, Interface Adapters, Frameworks & Drivers)
- Dependency rule enforcement (inner layers must not depend on outer layers)
- Testable business logic (domain layer isolated from React/UI concerns)
- Scalable structure for multiple business domains (Game Collection, Wishlist, Console Maintenance)

**Problem:**
Traditional Clean Architecture examples often use a single-domain structure. This project manages 3 distinct business contexts (Collection, Wishlist, Maintenance) that should remain decoupled.

**Alternatives Considered:**

- **Single Domain Structure**: ❌ All domains mixed in `domain/entities/`, becomes unmaintainable with 3+ contexts
- **Feature-Based Folders**: ❌ Groups by UI features, violates Clean Architecture layer separation
- **Clean Architecture + DDD Bounded Contexts**: ✅ Vertical slices by domain, horizontal layers within each context

### Decision

Implement a **hybrid architecture** combining Clean Architecture layering with Domain-Driven Design bounded contexts.

**Project Structure:**

```
src/
├── app/                          # Application Foundation
│   ├── main.tsx                  # Entry point
│   ├── App.tsx                   # Root component + routing
│   ├── providers/                # Global providers (DI, theme)
│   └── config/                   # DI container composition
│
├── shared/                       # Shared Kernel (cross-context utilities)
│   ├── domain/                   # Shared value objects, Result pattern
│   ├── infrastructure/           # IndexedDB base adapter, HTTP client
│   └── ui/                       # Shared UI components
│
├── collection/                   # BOUNDED CONTEXT: Game Collection
│   ├── domain/                   # Entities, Value Objects, Interfaces
│   │   ├── entities/             # Game.ts
│   │   ├── value-objects/        # GameTitle.ts, Platform.ts
│   │   └── repositories/         # IGameRepository.ts (interface)
│   ├── application/              # Use Cases
│   │   └── use-cases/            # AddGame.ts, SearchGames.ts
│   ├── infrastructure/           # Adapters
│   │   ├── persistence/          # IndexedDBGameRepository.ts
│   │   ├── api/                  # IGDBAdapter.ts
│   │   └── di/                   # collection.container.ts
│   └── ui/                       # React Components
│       ├── pages/                # CollectionPage.tsx
│       └── components/           # GameCard.tsx
│
├── wishlist/                     # BOUNDED CONTEXT: Wishlist
│   └── [same layer structure]
│
└── maintenance/                  # BOUNDED CONTEXT: Console Maintenance
    └── [same layer structure]
```

**Critical Rules:**

1. **Dependency Direction**: Dependencies always point INWARD (domain has zero external dependencies)
2. **Zero Context Coupling**: No imports between bounded contexts (e.g., `@Collection` cannot import from `@Wishlist`)
3. **Pure Domain Layer**: No InversifyJS decorators in domain layer (manual DI registration in infrastructure)

**Path Aliases:**

```typescript
// tsconfig.json
{
  "paths": {
    "@App/*": ["./src/app/*"],
    "@Shared/*": ["./src/shared/*"],
    "@Collection/*": ["./src/collection/*"],
    "@Wishlist/*": ["./src/wishlist/*"],
    "@Maintenance/*": ["./src/maintenance/*"]
  }
}
```

### Consequences

**Positive:**

- ✅ **Scalability**: New contexts added without touching existing code (true DDD isolation)
- ✅ **Testability**: Domain layer completely isolated (mock UI, storage, APIs independently)
- ✅ **Educational Value**: Clear demonstration of Clean Architecture + DDD principles
- ✅ **Maintainability**: Changes to Collection don't affect Wishlist or Maintenance
- ✅ **Architectural Flexibility**: Swap IndexedDB → Firebase without changing domain/application layers

**Negative:**

- ❌ **Code Duplication**: Some patterns repeat across contexts (acceptable for learning)
- ❌ **Boilerplate**: More files/folders than feature-based structure
- ❌ **Learning Curve**: Developers must understand both Clean Architecture AND DDD

**Trade-offs Accepted:**

- Simplicity vs. architectural purity → **Purity wins** (project goal is to demonstrate Clean Architecture)
- DRY principle vs. context isolation → **Isolation wins** (duplicate code across contexts is acceptable)

---

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

## ADR-004: Result/Either Pattern for Error Handling

**Date:** 2026-01-22  
**Status:** ✅ Accepted

### Context

TypeScript applications commonly handle errors via:

- **Try/Catch blocks**: Easy to forget, silent failures, type system doesn't enforce error handling
- **Throwing exceptions**: Breaks function purity, forces side effects, difficult to test
- **Error callbacks**: Callback hell, difficult to compose

**Requirements:**

- Type-safe error handling (compiler enforces error checks)
- Explicit error types in function signatures (self-documenting)
- Composable error handling (chain operations without try/catch nesting)
- Pure functions (domain layer should not throw exceptions)

**Alternatives Considered:**

- **Traditional Try/Catch**: ❌ Not type-safe, easy to forget error handling
- **Throwing Exceptions**: ❌ Breaks functional purity, difficult to track error flow
- **Result/Either Pattern**: ✅ Type-safe, explicit, composable
- **Library (neverthrow)**: ✅ Battle-tested but adds dependency (deferred to post-MVP)

### Decision

Implement a custom **Result<T, E>** pattern for all use cases and domain operations.

**Implementation:**

```typescript
// shared/domain/Result.ts
export type Result<T, E extends Error> = { success: true; value: T } | { success: false; error: E };

export const Result = {
  ok: <T>(value: T): Result<T, never> => ({ success: true, value }),
  fail: <E extends Error>(error: E): Result<never, E> => ({ success: false, error }),
};
```

**Usage in Use Cases:**

```typescript
// collection/application/use-cases/AddGame.ts
export class AddGameUseCase {
  async execute(data: GameDTO): Promise<Result<Game, ValidationError | RepositoryError>> {
    // Validation (type-safe)
    const titleResult = GameTitle.create(data.title);
    if (!titleResult.success) {
      return Result.fail(new ValidationError('Invalid title'));
    }

    // Business logic
    const game = Game.create({
      id: GameId.generate(),
      title: titleResult.value,
      platform: Platform.create(data.platform),
    });

    // Repository operation
    const saveResult = await this.repository.save(game);
    if (!saveResult.success) {
      return Result.fail(saveResult.error);
    }

    return Result.ok(game);
  }
}
```

**UI Handling:**

```typescript
// collection/ui/pages/AddGamePage.tsx
const handleSubmit = async (data: GameDTO) => {
  const result = await addGameUseCase.execute(data);

  if (!result.success) {
    // TypeScript knows result.error exists here
    if (result.error instanceof ValidationError) {
      showToast(result.error.message, 'error'); // User-friendly
    } else if (result.error instanceof RepositoryError) {
      logError(result.error); // Log for debugging
      showToast('Failed to save game. Please try again.', 'error');
    }
    return;
  }

  // TypeScript knows result.value exists here
  showToast(`Game "${result.value.title}" added!`, 'success');
  navigate('/collection');
};
```

**Error Class Hierarchy:**

```typescript
// shared/domain/errors/
export class ValidationError extends Error {
  /* ... */
}
export class NotFoundError extends Error {
  /* ... */
}

// shared/infrastructure/errors/
export class RepositoryError extends Error {
  /* ... */
}
export class ApiError extends Error {
  /* ... */
}
```

### Consequences

**Positive:**

- ✅ **Type Safety**: Compiler enforces error handling (no forgotten try/catch)
- ✅ **Explicit Error Types**: Function signatures document possible errors
- ✅ **No Silent Failures**: Cannot access `result.value` without checking `result.success`
- ✅ **Composable**: Chain operations with `mapResult`, `flatMapResult` helpers
- ✅ **Pure Functions**: Domain layer stays pure (no exceptions thrown)
- ✅ **Educational Value**: Demonstrates functional error handling patterns

**Negative:**

- ❌ **Verbosity**: More code than try/catch (every result must be checked)
- ❌ **Learning Curve**: Developers unfamiliar with Result pattern may struggle initially
- ❌ **Boilerplate**: Repetitive `if (!result.success)` checks

**Trade-offs Accepted:**

- Try/catch simplicity vs. type safety → **Type safety wins** (compiler catches errors)
- Custom implementation vs. library (neverthrow) → **Custom wins** (educational value, zero dependencies)

**Helper Functions (Future):**

```typescript
// shared/domain/ResultHelpers.ts
export const mapResult = <T, E extends Error, U>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> => {
  if (!result.success) return result;
  return Result.ok(fn(result.value));
};

export const combineResults = <T extends unknown[], E extends Error>(results: {
  [K in keyof T]: Result<T[K], E>;
}): Result<T, E> => {
  // Combine multiple results, fail if any fails
};
```

---

## ADR-005: InversifyJS for Dependency Injection

**Date:** 2026-01-22  
**Status:** ✅ Accepted

### Context

Clean Architecture requires dependency inversion: high-level modules (domain, use cases) must not depend on low-level modules (repositories, APIs). Dependencies are injected via interfaces.

**Requirements:**

- Dependency injection without coupling domain layer to DI framework
- Type-safe container (TypeScript support)
- Bounded context isolation (each context has its own container)
- Manual registration (no decorators in domain layer)

**Alternatives Considered:**

- **InversifyJS (Manual Registration)**: ✅ Type-safe, mature, supports manual registration
- **InversifyJS (Decorators)**: ❌ Violates Clean Architecture (domain depends on DI framework)
- **TSyringe**: ❌ Decorator-heavy, not suitable for pure domain layer
- **React Context + Manual Factories**: ❌ Too much boilerplate, no type safety
- **No DI Framework (Constructor Injection)**: ❌ Manual wiring becomes unmaintainable with 15+ use cases

### Decision

Use **InversifyJS with manual registration** (no decorators in domain/application layers).

**Critical Constraint:**
The domain layer (entities, value objects, use cases) must remain **completely free of external dependencies**, including InversifyJS decorators.

**Implementation:**

**❌ Rejected Approach (Decorators):**

```typescript
// domain/entities/Game.ts - AVOID THIS
import { injectable } from 'inversify'; // ❌ Domain depends on InversifyJS

@injectable() // ❌ Decorator couples domain to DI framework
class Game {
  constructor(
    public id: GameId,
    public title: GameTitle,
  ) {}
}
```

**✅ Approved Approach (Manual Registration):**

```typescript
// domain/entities/Game.ts - Pure domain, zero dependencies
export class Game {
  private constructor(
    public id: GameId,
    public title: GameTitle,
  ) {}

  static create(data: { id: GameId; title: GameTitle }): Game {
    return new Game(data.id, data.title);
  }
}

// collection/infrastructure/di/collection.container.ts
import { Container } from 'inversify';
import { IGameRepository } from '@Collection/domain/repositories/IGameRepository';
import { IndexedDBGameRepository } from '@Collection/infrastructure/persistence/IndexedDBGameRepository';
import { AddGameUseCase } from '@Collection/application/use-cases/AddGame';

export const collectionContainer = new Container();

// Manual registration (domain stays pure)
collectionContainer.bind<IGameRepository>('IGameRepository').to(IndexedDBGameRepository).inSingletonScope();

collectionContainer
  .bind<AddGameUseCase>('AddGameUseCase')
  .toDynamicValue(context => {
    return new AddGameUseCase(context.container.get<IGameRepository>('IGameRepository'));
  })
  .inSingletonScope();
```

**Container Composition (App Level):**

```typescript
// app/config/di-container.ts
import { Container } from 'inversify';
import { sharedContainer } from '@Shared/infrastructure/di/shared.container';
import { collectionContainer } from '@Collection/infrastructure/di/collection.container';
import { wishlistContainer } from '@Wishlist/infrastructure/di/wishlist.container';

export const appContainer = Container.merge(sharedContainer, collectionContainer, wishlistContainer);
```

**React Integration:**

```typescript
// app/providers/DIProvider.tsx
import { Container } from 'inversify';
import { createContext, useContext, PropsWithChildren } from 'react';

const DIContext = createContext<Container | null>(null);

export const DIProvider = ({ container, children }: PropsWithChildren<{ container: Container }>) => (
  <DIContext.Provider value={container}>{children}</DIContext.Provider>
);

export const useDI = () => {
  const container = useContext(DIContext);
  if (!container) throw new Error('DIProvider not found');
  return container;
};

// Usage in components
export const AddGamePage = () => {
  const container = useDI();
  const addGameUseCase = container.get<AddGameUseCase>('AddGameUseCase');
  // ...
};
```

### Consequences

**Positive:**

- ✅ **Pure Domain Layer**: Zero dependencies on InversifyJS (domain remains framework-agnostic)
- ✅ **Type Safety**: TypeScript enforces correct dependency types
- ✅ **Bounded Context Isolation**: Each context has its own DI container
- ✅ **Testability**: Easy to mock dependencies in tests (swap container bindings)
- ✅ **Architectural Flexibility**: Swap DI framework later without touching domain layer

**Negative:**

- ❌ **Boilerplate**: Manual registration more verbose than decorators
- ❌ **String Identifiers**: `'IGameRepository'` strings instead of symbols (error-prone)
- ❌ **Developer Experience**: More code to write compared to decorator approach

**Trade-offs Accepted:**

- Decorator convenience vs. domain purity → **Purity wins** (Clean Architecture principle)
- Symbols vs. strings → **Strings win** (simpler, acceptable for MVP, migrate to symbols post-MVP)

**Improvements (Post-MVP):**

```typescript
// Use symbols instead of strings for type safety
export const TYPES = {
  GameRepository: Symbol.for('IGameRepository'),
  AddGameUseCase: Symbol.for('AddGameUseCase'),
};

collectionContainer.bind<IGameRepository>(TYPES.GameRepository).to(IndexedDBGameRepository);
```

---

## ADR-006: PWA from Day One

**Date:** 2026-01-14  
**Status:** ✅ Accepted

### Context

The application requires offline functionality for game collection management. Users should be able to:

- Browse their collection without internet
- Add/edit games offline (sync when online)
- Install the app on mobile/desktop for native-like experience

**Requirements:**

- Offline-first architecture (IndexedDB + Service Worker)
- App shell caching (HTML, CSS, JS files)
- Network-first for API calls (IGDB metadata)
- Installable on mobile/desktop (PWA manifest)

**Alternatives Considered:**

- **No PWA (Online-Only)**: ❌ Requires internet, poor mobile experience
- **PWA Post-MVP**: ❌ Harder to retrofit Service Worker logic later
- **PWA from Day One**: ✅ Architecture designed for offline from the start

### Decision

Implement **Progressive Web App (PWA)** from the initial setup using Rsbuild PWA Plugin.

**Implementation:**

**Rsbuild Configuration:**

```typescript
// rsbuild.config.ts
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginPWA } from '@rsbuild/plugin-pwa';

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginPWA({
      manifest: {
        name: 'Game Collection Manager',
        short_name: 'GameCollection',
        description: 'Manage your video game collection offline',
        theme_color: '#1a1a2e',
        background_color: '#16213e',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        // Cache-first for app shell (HTML, CSS, JS)
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /^https:\/\/api\.igdb\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'igdb-api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
});
```

**Manifest File:**

```json
{
  "name": "Game Collection Manager",
  "short_name": "GameCollection",
  "description": "Offline-first game collection management",
  "theme_color": "#1a1a2e",
  "background_color": "#16213e",
  "display": "standalone",
  "scope": "/",
  "start_url": "/",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

**Caching Strategy:**

- **App Shell (HTML, CSS, JS)**: Cache-First with automatic updates on new deployment
- **IGDB API Metadata**: Network-First with 30-day fallback cache
- **User Data (IndexedDB)**: No Service Worker caching (direct IndexedDB access)

**Offline Detection:**

```typescript
// shared/infrastructure/network/NetworkStatus.ts
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

// Usage in UI
const CollectionPage = () => {
  const isOnline = useNetworkStatus();

  return (
    <>
      {!isOnline && <OfflineBanner />}
      {/* ... */}
    </>
  );
};
```

### Consequences

**Positive:**

- ✅ **Offline-First**: Full CRUD operations without network (IndexedDB + Service Worker)
- ✅ **Performance**: Instant page loads (cached app shell)
- ✅ **Mobile Experience**: Installable on home screen, native-like feel
- ✅ **Resilience**: App works even with poor network connection
- ✅ **Educational Value**: Demonstrates modern PWA patterns

**Negative:**

- ❌ **Cache Management**: Service Worker lifecycle can be confusing (update strategies)
- ❌ **Storage Quotas**: PWA storage subject to browser eviction policies
- ❌ **Debugging Complexity**: Service Worker bugs harder to debug than regular JS
- ❌ **HTTPS Requirement**: Cannot test PWA features on `http://` (mitigated by localhost exception)

**Trade-offs Accepted:**

- Online-only simplicity vs. offline capabilities → **Offline wins** (core project requirement)
- Service Worker complexity vs. instant page loads → **Performance wins** (educational value)

**Monitoring:**

```typescript
// Track PWA installation
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  // Show custom install prompt
});

window.addEventListener('appinstalled', () => {
  console.log('PWA installed successfully');
});
```

---

## Summary

| ADR | Decision                   | Status      | Key Benefit                                    |
| --- | -------------------------- | ----------- | ---------------------------------------------- |
| 001 | @pplancq/react-app Starter | ✅ Accepted | Exact Rsbuild match, architectural freedom     |
| 002 | Clean Architecture + DDD   | ✅ Accepted | Scalable, testable, educational transparency   |
| 003 | IndexedDB Storage          | ✅ Accepted | Offline-first, structured data, fast queries   |
| 004 | Result/Either Pattern      | ✅ Accepted | Type-safe error handling, explicit errors      |
| 005 | InversifyJS (Manual DI)    | ✅ Accepted | Pure domain layer, dependency inversion        |
| 006 | PWA from Day One           | ✅ Accepted | Offline capabilities, installable, performance |

---

## Documentation Metadata

**Created:** 2026-02-05  
**Last Updated:** 2026-02-05  
**Author:** Paul (with AI assistance)  
**Project:** lab-clean-architecture-react  
**Purpose:** Educational laboratory (80% learning, 20% utility)

**Related Documentation:**

- `README.md` - Project overview and quick start
- `_bmad-output/planning-artifacts/architecture.md` - Detailed architecture decisions
- `_bmad-output/planning-artifacts/prd.md` - Product requirements
- `docs/` - Additional technical documentation
