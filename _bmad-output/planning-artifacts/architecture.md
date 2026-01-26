---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - 'prd.md'
  - 'product-brief-lab-clean-architecture-react-2026-01-14.md'
  - 'ux-design-specification.md'
  - 'technical-api-metadata-jeux-research-2026-01-21.md'
  - 'technical-price-tracking-wishlist-research-2026-01-22.md'
  - 'technical-trophees-playstation-xbox-research-2026-01-22.md'
workflowType: 'architecture'
project_name: 'lab-clean-architecture-react'
user_name: 'Paul'
date: '2026-01-22'
lastStep: 8
status: 'complete'
completedAt: '2026-01-22'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

The application serves as a dual-purpose Game Collection Manager:
- **Collection Management**: Full CRUD operations for video games (add, edit, delete, search, filter by platform/status)
- **Metadata Enrichment**: Automatic fetching of game information via IGDB API (title, cover, release date, genres, platforms, description)
- **Ownership Verification**: Prevent duplicate entries by checking existing collection before adding games
- **Wishlist Management**: Track desired games with priority levels (low/medium/high) and status tracking (wishlist → pre-ordered → purchased)
- **Console Maintenance System**: Manage console inventory with maintenance tracking (last cleaning, repairs, condition notes)
- **Search & Discovery**: Browse collection with filtering, sorting, and search capabilities across multiple criteria

**Deferred Post-MVP:**
- Trophy/Achievement synchronization (PlayStation via psn-api, Xbox limited by paid APIs)
- Real-time price tracking (IsThereAnyDeal API integration)

**Non-Functional Requirements:**

- **Offline-First Architecture**: Complete offline functionality with IndexedDB persistence, PWA installation support
- **Performance**: Page load <2s, interaction responsiveness <100ms, smooth animations at 60fps
- **Accessibility**: WCAG 2.1 AA compliance mandatory (keyboard navigation, screen reader support, color contrast ratios)
- **Responsive Design**: Mobile-first approach supporting 320px to 1440px viewports with 4 breakpoint tiers
- **Security**: OAuth2 client credentials flow for IGDB API (already tested and operational)
- **Maintainability**: Clean Architecture pattern enforcement for educational transparency and future extensibility
- **User Experience**: shelter-ui design system integration, Platform Identity design direction (Elevated Cards), consistent feedback (toast notifications, error states)

**Scale & Complexity:**

- **Primary domain**: Full-stack frontend (React SPA with external API integration)
- **Complexity level**: Medium-High (Clean Architecture adds intentional layering for learning purposes)
- **Estimated architectural components**:
  - 3 core business entities (Game, Console, WishlistItem)
  - 4-6 use cases per entity (~15-18 total use cases)
  - Multiple adapters (IGDB API, IndexedDB repository, UI components)
  - 4 main user journeys with 15+ UI components

**Unique Project Philosophy:**
This is an **honest experimentation laboratory** (80% learning, 20% utility). The goal is to prove Clean Architecture works in React OR document why it doesn't. Learning and architectural transparency take priority over product perfection.

### Technical Constraints & Dependencies

**Imposed Stack:**
- React 18+ with TypeScript (strict mode)
- Rsbuild as build tool (modern alternative to Webpack/Vite)
- shelter-ui custom design system (component library already exists)
- IndexedDB for local storage (no backend database)
- IGDB API (Twitch) for game metadata (OAuth2 credentials configured in http_client/)

**Architectural Constraints:**
- Clean Architecture pattern must be strictly enforced with clear layer separation:
  - **Entities**: Business logic and domain models
  - **Use Cases**: Application-specific business rules
  - **Interface Adapters**: Controllers, presenters, repositories
  - **Frameworks & Drivers**: UI components, external APIs, storage
- Dependency rule: inner layers must not depend on outer layers
- All external dependencies must be behind abstractions/interfaces

**External Dependencies:**
- IGDB API rate limits and availability (Twitch OAuth2 dependency)
- IndexedDB browser support and storage quotas
- PWA service worker lifecycle constraints

### Cross-Cutting Concerns Identified

**State Management:**
- Complex local state for collections (games, consoles, wishlist) with filtering/sorting
- Synchronization between IndexedDB persistence and in-memory state
- Optimistic UI updates with rollback on API/storage failures

**API Integration & Caching:**
- IGDB API request batching and rate limit management
- Local caching strategy for metadata to minimize API calls
- Offline queue for failed requests with retry logic

**Data Persistence:**
- IndexedDB schema versioning and migration strategy
- Conflict resolution for concurrent updates
- Backup/export capabilities for user data portability

**UI/UX Consistency:**
- shelter-ui component library integration across all views
- Responsive breakpoint management (320px → 768px → 1024px → 1440px)
- Animation and transition performance optimization
- Loading states, error handling, and user feedback patterns

**Error Handling & Resilience:**
- Network failure graceful degradation (offline mode)
- API error handling with user-friendly messages
- Data validation at entity and UI layers
- Recovery mechanisms for corrupted local storage

**Accessibility & Internationalization:**
- WCAG 2.1 AA compliance across all interactions
- Keyboard navigation and focus management
- Screen reader announcements for dynamic content
- French language support (UI text, metadata when available via IGDB)

**Developer Experience:**
- Clean Architecture learning curve and onboarding
- Type safety enforcement with TypeScript strict mode
- Testing strategy for isolated layers (unit tests for use cases, integration tests for adapters)
- Documentation of architectural decisions and patterns discovered

## Starter Template Evaluation

### Primary Technology Domain

**Client-Side React SPA with PWA capabilities** - Educational Clean Architecture laboratory with functional game collection management utility.

### Technical Preferences (Pre-Established)

The project has clearly defined technical preferences based on:
- Existing shelter-ui design system (`@pplancq/shelter-ui-react`)
- Educational goals (demonstrate Clean Architecture in React)
- Internal tooling ecosystem (`@pplancq/dev-tools`)

**Stack Requirements:**

**Core Framework:**
- React 19+ with TypeScript strict mode
- Rsbuild build tooling (modern Webpack/Vite alternative)
- React Router with Browser History mode

**State & Data:**
- IndexedDB storage via `idb` library (offline-first MVP)
- TanStack Query Core + InversifyJS DI (Clean Architecture compliant, NOT React Query hooks)
- React hooks for local UI state only

**Styling & UI:**
- shelter-ui custom design system (Sass + CSS Modules architecture)
- No Tailwind, no CSS-in-JS (avoid runtime overhead)
- Built-in light/dark theme support

**Testing & Quality:**
- Vitest + React Testing Library
- Mock Service Worker (MSW) for API mocking
- Playwright for E2E testing (planned)
- Axe for accessibility testing

**PWA & Performance:**
- Rsbuild PWA Plugin for Service Worker generation
- Offline-first architecture with IndexedDB persistence
- Cache-First for app shell, Network-First for API data

### Starter Options Considered

**Option A: Public React Starters (Vite, Next.js, Create React App)**

- ❌ **Vite React Template**: Missing Rsbuild requirement, generic structure
- ❌ **Next.js**: SSR/SSG overhead unnecessary for client-side SPA, opinionated file-based routing conflicts with Clean Architecture layering
- ❌ **Create React App**: Deprecated, missing modern tooling

**Trade-offs:**
- Would provide quick initialization but require extensive reconfiguration
- Bundled dependencies may conflict with shelter-ui or Clean Architecture patterns
- Generic folder structure incompatible with Domain/Use Cases/Infrastructure/Presentation layering

**Option B: Custom Internal Template (`@pplancq/react-app`)**

- ✅ **Pre-configured for Rsbuild**: Matches build tool requirement exactly
- ✅ **TypeScript Strict Mode**: Already configured with project standards
- ✅ **Automated Setup**: Handles git initialization and base dependencies automatically
- ✅ **Clean Slate**: No opinionated routing or state management (enables pure Clean Architecture)
- ✅ **Controlled Dependencies**: Only essential packages, no bloat

**Trade-offs:**
- Requires manual installation of specialized libraries (shelter-ui, InversifyJS)
- Not publicly available (internal tooling dependency)
- Documentation specific to internal team (but author is the user)

### Selected Starter: Internal React Template

**Rationale for Selection:**

The project will use **`@pplancq/react-app`** as the foundation for the following architectural reasons:

1. **Build Tool Alignment**: Pre-configured with Rsbuild, which is a hard requirement for this project
2. **Automated Initialization**: Single command handles git setup and base dependency installation
3. **Clean Architecture Freedom**: Provides minimal structure, allowing proper layering without fighting against framework opinions
4. **Controlled Dependency Graph**: Avoids bloated starter dependencies, ensuring only essential packages are included
5. **Internal Consistency**: Maintained by the same developer (Paul), ensuring alignment with project philosophy and technical standards
6. **Educational Transparency**: Starting from a known, simple base makes architectural decisions more explicit and documented

**Initialization Command:**

```bash
# Initialize project with internal template
npm create @pplancq/react-app

# The create script automatically:
# - Initializes git repository
# - Installs base dependencies (React, Rsbuild, TypeScript, etc.)
# - Configures ESLint + Prettier
# - Sets up project structure foundation
```

**Post-Initialization Setup:**

The template provides the foundation with base dependencies. The following specialized libraries must be installed separately:

```bash
# Install Clean Architecture essential dependencies
npm install react-router-dom                # Routing (Browser History mode)
npm install idb                              # IndexedDB wrapper for persistence
npm install @tanstack/query-core             # Query Core (NOT React Query)
npm install inversify reflect-metadata       # Dependency Injection (NOT included in template)
npm install react-hook-form                  # Form management

# Install design system (NOT included in template)
npm install @pplancq/shelter-ui-react        # Custom design system

# Install development dependencies
npm install -D msw                           # Mock Service Worker
npm install -D vitest @vitest/ui             # Testing framework
npm install -D @testing-library/react        # Component testing utilities
npm install -D @axe-core/playwright          # Accessibility testing
npm install -D @playwright/test              # E2E testing
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
- TypeScript 5+ with strict mode enabled (`strict: true`, `noImplicitAny: true`)
- React 19+ with modern JSX transform
- ES2022 target for modern browser support

**Build Tooling:**
- Rsbuild configuration with optimized production builds
- Hot Module Replacement (HMR) for development
- Tree-shaking and code-splitting enabled
- Environment variable management (`.env` support)

**Code Quality:**
- ESLint configuration for React + TypeScript
- Prettier for consistent code formatting
- Git hooks (Husky) for pre-commit linting
- `.editorconfig` for consistent editor settings

**Project Structure (Foundation):**
```
src/
├── index.tsx          # Application entry point
├── App.tsx            # Root component
├── assets/            # Static assets (images, fonts)
└── styles/            # Global styles (reset, variables)
```

**Clean Architecture + DDD Bounded Contexts Structure (To Be Implemented):**

The project will use a **hybrid architecture** combining Clean Architecture layering with Domain-Driven Design bounded contexts. This approach groups code by business domain (vertical slices) while maintaining architectural layers within each context.

```
src/
├── app/                          # Application Foundation (Bootstrap Layer)
│   ├── main.tsx                  # Application entry point
│   ├── App.tsx                   # Root component with routing
│   ├── router/                   # React Router configuration
│   │   ├── routes.tsx            # Route definitions
│   │   └── guards/               # Route guards (auth, etc.)
│   ├── providers/                # Global providers (DI, theme, etc.)
│   │   ├── DIProvider.tsx        # InversifyJS container provider
│   │   └── ThemeProvider.tsx    # shelter-ui theme provider
│   └── config/                   # Application configuration
│       ├── di-container.ts       # InversifyJS container setup
│       └── constants.ts          # Global constants
│
├── shared/                       # Shared Kernel (Cross-Context)
│   ├── domain/                   # Shared domain primitives
│   │   ├── value-objects/        # Common value objects (Email, DateRange, etc.)
│   │   └── types/                # Shared domain types
│   ├── application/              # Shared application logic
│   │   └── interfaces/           # Common interfaces (Logger, EventBus, etc.)
│   ├── infrastructure/           # Shared infrastructure
│   │   ├── storage/              # IndexedDB base adapter
│   │   ├── http/                 # HTTP client wrapper
│   │   └── logger/               # Logging implementation
│   └── ui/                       # Shared UI components
│       ├── components/           # Common components (ErrorBoundary, Loading, etc.)
│       ├── hooks/                # Shared React hooks
│       └── utils/                # UI utilities (formatters, validators, etc.)
│
├── collection/                   # Collection Context (Bounded Context)
│   ├── domain/                   # Collection Domain Layer
│   │   ├── entities/
│   │   │   ├── Game.ts           # Game entity
│   │   │   └── GameId.ts         # Game ID value object
│   │   ├── value-objects/
│   │   │   ├── Platform.ts       # Platform enum/value object
│   │   │   └── Status.ts         # Game status
│   │   └── repositories/
│   │       └── IGameRepository.ts # Repository interface
│   ├── application/              # Collection Use Cases Layer
│   │   ├── use-cases/
│   │   │   ├── AddGame.ts        # Add game use case
│   │   │   ├── EditGame.ts       # Edit game use case
│   │   │   ├── DeleteGame.ts     # Delete game use case
│   │   │   └── GetGames.ts       # Get games use case
│   │   └── dtos/                 # Data Transfer Objects
│   │       └── GameDTO.ts
│   ├── infrastructure/           # Collection Infrastructure Layer
│   │   ├── persistence/
│   │   │   └── IndexedDBGameRepository.ts # IndexedDB implementation
│   │   └── api/
│   │       └── IGDBAdapter.ts    # IGDB API adapter
│   └── ui/                       # Collection Presentation Layer
│       ├── components/
│       │   ├── GameList.tsx      # Game list component
│       │   ├── GameForm.tsx      # Game form component
│       │   └── GameCard.tsx      # Game card component
│       ├── pages/
│       │   ├── CollectionPage.tsx # Collection page
│       │   └── GameDetailPage.tsx # Game detail page
│       └── hooks/
│           └── useGameForm.ts    # Game form hook
│
├── wishlist/                     # Wishlist Context (Bounded Context)
│   ├── domain/
│   │   ├── entities/
│   │   │   └── WishlistItem.ts   # Wishlist item entity
│   │   ├── value-objects/
│   │   │   └── Priority.ts       # Priority value object
│   │   └── repositories/
│   │       └── IWishlistRepository.ts
│   ├── application/
│   │   └── use-cases/
│   │       ├── AddToWishlist.ts
│   │       ├── UpdatePriority.ts
│   │       └── MoveToCollection.ts
│   ├── infrastructure/
│   │   └── persistence/
│   │       └── IndexedDBWishlistRepository.ts
│   └── ui/
│       ├── components/
│       │   └── WishlistCard.tsx
│       └── pages/
│           └── WishlistPage.tsx
│
└── maintenance/                  # Maintenance Context (Bounded Context)
    ├── domain/
    │   ├── entities/
    │   │   ├── Console.ts        # Console entity
    │   │   └── MaintenanceTask.ts # Maintenance task entity
    │   ├── value-objects/
    │   │   └── ConsoleCondition.ts
    │   └── repositories/
    │       ├── IConsoleRepository.ts
    │       └── IMaintenanceRepository.ts
    ├── application/
    │   └── use-cases/
    │       ├── AddConsole.ts
    │       ├── ScheduleMaintenance.ts
    │       └── CompleteMaintenance.ts
    ├── infrastructure/
    │   └── persistence/
    │       ├── IndexedDBConsoleRepository.ts
    │       └── IndexedDBMaintenanceRepository.ts
    └── ui/
        ├── components/
        │   ├── ConsoleCard.tsx
        │   └── MaintenanceTimeline.tsx
        └── pages/
            ├── ConsolesPage.tsx
            └── MaintenanceDetailPage.tsx
```

**Architectural Principles:**

**Bounded Context Isolation:**
- Each context (`collection/`, `wishlist/`, `maintenance/`) is self-contained with its own domain, use cases, infrastructure, and UI
- Contexts communicate through well-defined interfaces (e.g., `MoveToCollection` use case in `wishlist/` calls `AddGame` use case in `collection/`)
- No direct dependencies between contexts - all cross-context communication goes through application layer

**Clean Architecture Layers (Within Each Context):**
- **domain/**: Pure business logic, no framework dependencies, no external dependencies
- **application/**: Use cases orchestrate domain logic, depend only on domain layer
- **infrastructure/**: Concrete implementations (repositories, API adapters), depend on domain interfaces
- **ui/**: React components, hooks, pages - depend on application layer (use cases)

**Shared Kernel:**
- `shared/` contains code reusable across all contexts
- Minimal and carefully curated (avoid shared becoming a dumping ground)
- Changes to `shared/` impact all contexts - treat as public API

**Dependency Rule:**
- Dependencies point inward: `ui` → `application` → `domain`
- `infrastructure` implements `domain` interfaces (dependency inversion)
- No layer depends on outer layers

**Development Experience:**
- `npm run dev` - Start development server with HMR
- `npm run build` - Production build with optimization
- `npm run preview` - Preview production build locally
- `npm run test` - Run Vitest unit tests
- `npm run lint` - Run ESLint checks
- `npm run format` - Format code with Prettier

**Benefits of This Structure:**

1. **Domain-Centric Organization**: All code related to a business domain lives together (easier navigation)
2. **Scalability**: New contexts can be added without affecting existing ones
3. **Team Parallelization**: Different developers can work on different contexts with minimal conflicts
4. **Clean Architecture Compliance**: Each context maintains proper layering and dependency rules
5. **Testability**: Isolated contexts and layers make unit testing straightforward
6. **Educational Clarity**: Structure makes architectural boundaries explicit and visible

**Note:** Project initialization using this template is the first step in Phase 4 (Development Setup). The folder structure will be created incrementally as contexts are implemented, starting with `app/` and `shared/` foundations, then adding `collection/` context as the first vertical slice.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- IndexedDB schema structure (single database with separate stores)
- Result/Either pattern for error handling (type-safe, explicit error management)
- Event Bus pattern for cross-context communication (bounded context isolation)
- DI containers per bounded context (InversifyJS composition strategy)
- No TypeScript decorators in domain layer (pure domain, manual DI registration)

**Important Decisions (Shape Architecture):**
- Hybrid validation strategy (React Hook Form + Domain Value Objects)
- Cache strategy with evolution path (permanent cache with ICacheStrategy interface)
- PWA App Shell pattern with configurable limits (50MB covers)
- Tests organization by type (unit/integration/e2e/visual separation)

**Deferred Decisions (Post-MVP):**
- TTL cache strategy (interface ready, implementation deferred)
- Event Bus persistence/replay (in-memory sufficient for MVP)
- Visual regression testing setup (structure ready)

### Data Architecture

**IndexedDB Schema Strategy:**

**Decision:** Single database with separate object stores per bounded context

```typescript
// shared/infrastructure/storage/database-schema.ts
const dbSchema = {
  name: 'GameCollectionDB',
  version: 1,
  stores: {
    games: { keyPath: 'id', indexes: ['platform', 'status', 'title'] },
    wishlist: { keyPath: 'id', indexes: ['priority', 'status'] },
    consoles: { keyPath: 'id', indexes: ['platform'] },
    maintenance: { keyPath: 'id', indexes: ['consoleId', 'scheduledDate'] },
    game_metadata: { keyPath: 'gameId' } // IGDB cache
  }
};
```

**Rationale:**
- Simpler migration management (single version number)
- Enables cross-context transactions if needed in future
- Code structure still allows future migration to separate databases per context (Repository pattern isolation)
- **Lab Learning Goal:** Demonstrates that architectural flexibility can be preserved even with pragmatic MVP choices

**Migration Strategy:**

**Decision:** Manual migrations with explicit upgrade functions

```typescript
const db = await openDB('GameCollectionDB', 2, {
  upgrade(db, oldVersion, newVersion, transaction) {
    if (oldVersion < 2) {
      // Migration v1 → v2: add search index
      const store = transaction.objectStore('games');
      store.createIndex('platform', 'platform');
    }
  }
});
```

**Documentation Approach:**
- General migration strategy documented in DECISIONS.md
- Complex migrations (data transformations, multi-step migrations) get dedicated entries in MIGRATIONS.md
- Each migration includes timestamp, version, rationale, and rollback considerations (where possible)

**Rationale:**
- Explicit migrations serve as **living documentation** of schema evolution
- Educational value: each migration = an architectural decision record
- Familiar pattern (similar to Doctrine Migrations in PHP)

**Validation Strategy:**

**Decision:** Hybrid validation with shared Value Objects

**UI Layer (React Hook Form):**
- Simple validations (required, max length, format)
- Immediate user feedback
- Value Objects validation rules reused via refinement

**Domain Layer (Entities + Value Objects):**
- Business rules validation (conditional requirements, cross-field validation)
- Value Objects throw exceptions if invalid
- Impossible to create invalid entities

```typescript
// domain/value-objects/GameTitle.ts
class GameTitle {
  constructor(private value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Game title cannot be empty');
    }
    if (value.length > 200) {
      throw new Error('Game title cannot exceed 200 characters');
    }
  }
  getValue(): string { return this.value; }
}

// ui/components/GameForm.tsx (React Hook Form integration)
const schema = z.object({
  title: z.string().refine(val => {
    try {
      new GameTitle(val); // Reuse domain validation
      return true;
    } catch {
      return false;
    }
  }, { message: 'Invalid game title' })
});
```

**Rationale:**
- Zero validation duplication (single source of truth in Value Objects)
- UI validates for UX, Domain validates for correctness
- **Lab Learning Goal:** Shows how Clean Architecture enables validation layer separation without duplication

**Cache Strategy:**

**Decision:** Permanent cache with evolution interface (ICacheStrategy)

**MVP Implementation:**
```typescript
// shared/infrastructure/cache/ICacheStrategy.ts
interface ICacheStrategy {
  shouldRefresh(cachedAt: Date): boolean;
}

// shared/infrastructure/cache/PermanentCacheStrategy.ts
class PermanentCacheStrategy implements ICacheStrategy {
  shouldRefresh(cachedAt: Date): boolean {
    return false; // Never expire for MVP
  }
}
```

**Future Evolution:**
```typescript
// shared/infrastructure/cache/TTLCacheStrategy.ts (ready for post-MVP)
class TTLCacheStrategy implements ICacheStrategy {
  constructor(private ttlDays: number) {}

  shouldRefresh(cachedAt: Date): boolean {
    const now = new Date();
    const daysSince = (now.getTime() - cachedAt.getTime()) / (1000 * 60 * 60 * 24);
    return daysSince > this.ttlDays;
  }
}
```

**Cache Scope:**
- Game metadata (IGDB): Permanent (data rarely changes)
- Manual refresh button in UI if needed
- Future: Switch to TTL by changing DI configuration (1 line change)

**Rationale:**
- Metadata is quasi-immutable (game title, release year don't change)
- Rate limit optimization (minimize IGDB API calls)
- **Lab Learning Goal:** Interface-based design enables strategy swap without touching business logic

### Error Handling & Resilience

**Error Handling Pattern:**

**Decision:** Result/Either pattern for type-safe error handling

```typescript
// shared/domain/Result.ts
type Result<T, E extends Error> =
  | { success: true; value: T }
  | { success: false; error: E };

// Usage in Use Cases
class AddGameUseCase {
  execute(data: GameDTO): Promise<Result<Game, ValidationError | RepositoryError>> {
    const titleResult = GameTitle.create(data.title);
    if (!titleResult.success) {
      return Result.fail(new ValidationError('Invalid title'));
    }

    // Business logic...
    return Result.ok(game);
  }
}

// UI handling (type-safe)
const result = await addGameUseCase.execute(data);
if (!result.success) {
  showToast(result.error.message, 'error');
  return;
}
// TypeScript knows result.value is available here
const game = result.value;
```

**Library Choice:**
- Custom `Result<T, E>` implementation in `shared/domain/` (educational value)
- Alternative: `neverthrow` library if custom implementation becomes cumbersome

**Rationale:**
- Type-safe error handling (compiler enforces error checks)
- Explicit error types in function signatures (self-documenting)
- No silent failures or forgotten try/catch blocks
- **Lab Learning Goal:** Demonstrates functional programming patterns in TypeScript + React

**PWA Offline Strategy:**

**Decision:** App Shell Pattern with configurable cache limits

**Service Worker Strategy (Rsbuild PWA Plugin):**
- **App Shell** (HTML, JS, CSS): Cache-First (immutable after deployment)
- **Game Cover Images**: Cache-First with 50MB limit (configurable constant)
- **API Data (IGDB)**: Network-First with cache fallback
- **User Data (collection)**: IndexedDB only (not in Service Worker cache)

**Cache Configuration:**
```typescript
// app/config/pwa-config.ts
export const PWA_CONFIG = {
  COVERS_CACHE_SIZE_MB: 50, // Configurable (approx 100-150 covers)
  COVERS_CACHE_NAME: 'game-covers-v1',
  APP_SHELL_CACHE_NAME: 'app-shell-v1'
};
```

**Update Strategy:**
- Prompt user for app updates (no silent reload)
- Skip waiting: false (user controls update timing)

**Rationale:**
- Standard PWA pattern (well-documented, battle-tested)
- Configurable limits allow adjustment based on user feedback
- IndexedDB handles user data (better suited than Service Worker cache)

### Cross-Cutting Patterns

**Dependency Injection Strategy:**

**Decision:** Bounded context containers with manual registration (NO decorators)

**Critical Constraint: Pure Domain Layer**

The domain layer (entities, value objects, use cases) must remain **completely free of external dependencies**, including InversifyJS decorators. This ensures true Clean Architecture compliance.

**❌ Rejected Approach (Decorators):**
```typescript
// domain/entities/Game.ts - AVOID THIS
import { injectable } from 'inversify'; // ❌ Domain depends on InversifyJS

@injectable() // ❌ Decorator couples domain to DI framework
class Game {
  constructor(public id: GameId, public title: GameTitle) {}
}
```

**✅ Approved Approach (Manual Registration):**
```typescript
// domain/entities/Game.ts - Pure domain, zero dependencies
class Game {
  constructor(public id: GameId, public title: GameTitle) {}
}

// collection/infrastructure/di/collection.container.ts - DI registration in infrastructure layer
import { Container } from 'inversify';
import { Game } from '@/collection/domain/entities/Game';
import { IGameRepository } from '@/collection/domain/repositories/IGameRepository';
import { IndexedDBGameRepository } from '@/collection/infrastructure/persistence/IndexedDBGameRepository';
import { AddGameUseCase } from '@/collection/application/use-cases/AddGame';

export const collectionContainer = new Container();

// Manual registration (more verbose but domain stays pure)
collectionContainer.bind<IGameRepository>(TYPES.GameRepository)
  .to(IndexedDBGameRepository)
  .inSingletonScope();

collectionContainer.bind<AddGameUseCase>(TYPES.AddGameUseCase)
  .toDynamicValue((context) => {
    const repository = context.container.get<IGameRepository>(TYPES.GameRepository);
    return new AddGameUseCase(repository); // Manual instantiation
  });
```

**Container Composition:**
```typescript
// wishlist/infrastructure/di/wishlist.container.ts
export const wishlistContainer = new Container();
wishlistContainer.bind<IWishlistRepository>(TYPES.WishlistRepository)
  .to(IndexedDBWishlistRepository)
  .inSingletonScope();

// app/config/di-container.ts - Merge all contexts
export const appContainer = Container.merge(
  sharedContainer,      // Event bus, logger, cache strategies
  collectionContainer,
  wishlistContainer,
  maintenanceContainer
);
```

**Rationale:**
- ✅ **Domain purity preserved**: Zero external dependencies in domain layer (entities, value objects, use cases)
- ✅ **True Clean Architecture**: Inner layers have no knowledge of outer layers or frameworks
- ✅ **Educational transparency**: Manual registration makes dependencies explicit and visible
- ✅ **Framework independence**: Switching from InversifyJS to another DI library only impacts infrastructure layer
- ✅ **Testability**: Domain classes can be instantiated directly in tests without DI container
- ⚠️ **Trade-off**: More verbose registration code (accepted for architectural purity)

**Lab Learning Goal:** Demonstrates that Clean Architecture means **true framework independence**, not just interface abstractions. The domain layer should compile and run even if InversifyJS is completely removed from the project.

**Cross-Context Communication:**

**Decision:** Event Bus pattern for decoupled communication

```typescript
// shared/application/interfaces/IEventBus.ts
interface DomainEvent<T = any> {
  type: string;
  payload: T;
  timestamp: Date;
}

interface IEventBus {
  publish<T>(event: DomainEvent<T>): void;
  subscribe<T>(eventType: string, handler: (event: DomainEvent<T>) => void): void;
}

// shared/infrastructure/events/InMemoryEventBus.ts
class InMemoryEventBus implements IEventBus {
  private handlers = new Map<string, Array<(event: any) => void>>();

  publish<T>(event: DomainEvent<T>): void {
    const handlers = this.handlers.get(event.type) || [];
    handlers.forEach(handler => handler(event));
  }

  subscribe<T>(eventType: string, handler: (event: DomainEvent<T>) => void): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);
  }
}

// Usage: Wishlist → Collection communication
// wishlist/application/use-cases/MoveToCollection.ts
class MoveToCollectionUseCase {
  constructor(
    private wishlistRepo: IWishlistRepository,
    private eventBus: IEventBus
  ) {}

  async execute(itemId: string): Promise<Result<void, Error>> {
    const item = await this.wishlistRepo.getById(itemId);

    // Publish event (no direct coupling to collection context)
    this.eventBus.publish({
      type: 'GAME_MOVED_TO_COLLECTION',
      payload: { title: item.title, platform: item.platform },
      timestamp: new Date()
    });

    await this.wishlistRepo.delete(itemId);
    return Result.ok(undefined);
  }
}

// collection/ subscribes to event
// collection/infrastructure/di/collection.container.ts (initialization)
eventBus.subscribe('GAME_MOVED_TO_COLLECTION', async (event) => {
  const addGameUseCase = container.get<AddGameUseCase>(TYPES.AddGameUseCase);
  await addGameUseCase.execute(event.payload);
});
```

**Rationale:**
- Zero coupling between bounded contexts (true DDD isolation)
- Extensible (new contexts can subscribe to existing events)
- Testable (mock event bus for unit tests)
- **Lab Learning Goal:** Demonstrates proper bounded context communication without tight coupling

**Future Considerations:**
- Event persistence (for audit log or replay)
- Event versioning (for schema evolution)
- Dead letter queue (for failed event handlers)

### Testing Architecture

**Test Organization Strategy:**

**Decision:** Dedicated tests/ folder organized by test type

```
tests/
├── unit/                           # Unit tests (domain, use cases)
│   ├── collection/
│   │   ├── domain/
│   │   │   ├── Game.test.ts
│   │   │   └── GameTitle.test.ts
│   │   └── application/
│   │       └── AddGame.test.ts
│   ├── wishlist/
│   └── maintenance/
├── integration/                    # Integration tests (repositories, adapters)
│   ├── collection/
│   │   └── IndexedDBGameRepository.test.ts
│   └── shared/
│       ├── IGDBAdapter.test.ts
│       └── EventBus.test.ts
├── e2e/                           # End-to-end tests (Playwright)
│   ├── add-game.spec.ts
│   ├── wishlist-flow.spec.ts
│   └── maintenance-tracking.spec.ts
└── visual/                        # Visual regression (future)
    └── game-card.visual.test.ts
```

**Test Execution:**
```bash
npm run test:unit         # Vitest unit tests only
npm run test:integration  # Vitest integration tests
npm run test:e2e          # Playwright E2E tests
npm run test:all          # Run all test suites
```

**Rationale:**
- Test strategies clearly separated and documented
- Easy to run specific test types (faster CI pipelines)
- Scalable (add new test types like contract/performance tests)
- **Lab Learning Goal:** Shows different testing levels in Clean Architecture

**Testing Philosophy per Layer:**
- **Domain (Entities, Value Objects)**: Pure unit tests, no mocks needed (100% framework-independent)
- **Use Cases**: Unit tests with repository mocks
- **Infrastructure (Repositories, Adapters)**: Integration tests with real IndexedDB/API
- **UI Components**: Component tests (Vitest Browser mode)
- **User Flows**: E2E tests (Playwright)

### Performance Optimization

**Code Splitting Strategy:**

**Decision:** Route-based lazy loading with React.lazy

```typescript
// app/router/routes.tsx
import { lazy, Suspense } from 'react';

const CollectionPage = lazy(() => import('@/collection/ui/pages/CollectionPage'));
const WishlistPage = lazy(() => import('@/wishlist/ui/pages/WishlistPage'));
const MaintenancePage = lazy(() => import('@/maintenance/ui/pages/MaintenancePage'));

export const routes = [
  {
    path: '/collection',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <CollectionPage />
      </Suspense>
    )
  },
  // Other routes...
];
```

**Rsbuild Configuration:**
- Automatic code splitting per route
- Tree-shaking enabled
- Dynamic imports for heavy libraries (if needed)

**Rationale:**
- Standard React pattern (well-supported)
- Rsbuild handles chunking automatically
- Each bounded context UI loaded on-demand
- Sufficient for SPA of this scale

**Bundle Size Targets:**
- Initial bundle: < 100KB gzipped (app shell + shared)
- Per-route chunks: < 50KB gzipped (bounded context UI)
- Total app (all routes loaded): < 300KB gzipped

### Decision Impact Analysis

**Implementation Sequence:**

1. **Foundation (Week 1):**
   - Setup InversifyJS DI containers (shared + per-context) with manual registration
   - Implement Result<T, E> pattern in shared/domain/
   - Setup Event Bus (InMemoryEventBus)
   - Configure IndexedDB schema (single DB, multiple stores)

2. **Collection Context (Week 2-3):**
   - Domain entities with Value Objects validation (pure, no decorators)
   - Repository implementation (IndexedDB)
   - Use cases with Result pattern
   - UI components with React Hook Form + Value Objects

3. **Cross-Context Communication (Week 4):**
   - Event Bus integration
   - Wishlist → Collection event flow
   - Event handler registration in DI containers

4. **Infrastructure (Week 5):**
   - PWA Service Worker setup (Rsbuild plugin)
   - Cache strategy implementation (ICacheStrategy)
   - IGDB adapter with cache
   - Manual migration system

5. **Testing & Optimization (Week 6+):**
   - Test infrastructure setup (unit/integration/e2e folders)
   - Route-based lazy loading
   - Performance monitoring

**Cross-Component Dependencies:**

- **Event Bus** ← All contexts depend on it for cross-context communication
- **Result Pattern** ← All use cases depend on it for error handling
- **ICacheStrategy** ← IGDB adapter depends on it, future repositories may use it
- **DI Containers** ← Everything depends on InversifyJS configuration (manual registration in infrastructure layer)
- **IndexedDB Schema** ← All repositories depend on it (migration coordination required)

**Migration Risks & Mitigations:**

- **Risk:** IndexedDB schema changes require version bump (impacts all contexts)
  - **Mitigation:** Manual migrations with clear upgrade paths, test migrations thoroughly

- **Risk:** Event Bus in-memory only (lost on page reload)
  - **Mitigation:** Acceptable for MVP (events are ephemeral), document persistence strategy for post-MVP

- **Risk:** Result pattern verbosity may slow development
  - **Mitigation:** Create helper functions (mapResult, combineResults) in shared/domain/

- **Risk:** Manual DI registration more verbose than decorators
  - **Mitigation:** Accepted trade-off for domain purity, educational value outweighs verbosity

**Architectural Flexibility Preserved:**

- ✅ IndexedDB → Firebase/NestJS: Repository interface unchanged
- ✅ Permanent cache → TTL cache: Strategy swap via DI configuration
- ✅ In-memory Event Bus → Persistent Event Bus: Interface unchanged
- ✅ Custom Result → neverthrow library: Type signatures compatible
- ✅ Single DB → Multiple DBs per context: Repository implementations only
- ✅ InversifyJS → Other DI library: Only infrastructure layer affected (domain untouched)

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
15 areas where AI agents could make different choices without explicit patterns defined. These patterns ensure code consistency across multiple AI agents working on different bounded contexts.

### Naming Patterns

**Code Naming Conventions:**

**Functions:**
- **MANDATORY:** Arrow functions only (no function declarations)
- **Naming:** camelCase (`getUserData`, `calculateTotal`)
```typescript
// ✅ Correct
const addGame = (data: GameDTO): Result<Game, Error> => { };

// ❌ Avoid
function addGame(data: GameDTO): Result<Game, Error> { }
```

**Components & Classes:**
- **Naming:** PascalCase (`GameCard`, `AddGameUseCase`, `EventBus`)
- **File naming:** Matches class/component name exactly
```typescript
// GameCard.tsx
export const GameCard = ({ game }: GameCardProps) => { };

// AddGameUseCase.ts
export class AddGameUseCase { }
```

**Variables:**
- **Naming:** camelCase (`gameId`, `platformList`, `hasError`)
```typescript
const gameId = 'uuid-123';
const isLoading = false;
```

**Types & Interfaces:**
- **Global/Reusable Types:** Dedicated `*.type.d.ts` files
- **Local Types:** Defined in the same file (above component/class)
- **Interface Naming:** ALWAYS suffix with `Interface`
- **Abstract Class Naming:** ALWAYS prefix with `Abstract`

```typescript
// shared/domain/types/result.type.d.ts (global)
type Result<T, E extends Error> =
  | { success: true; value: T }
  | { success: false; error: E };

// GameCard.tsx (local component props)
export type GameCardProps = {
  game: Game;
  onEdit: (id: string) => void;
};

// Domain interface (suffix required)
export interface GameRepositoryInterface {
  save(game: Game): Promise<Result<void, Error>>;
}

// Abstract class (prefix required)
export abstract class AbstractRepository<T> {
  abstract findById(id: string): Promise<T | null>;
}
```

**Constants:**
- **Naming:** SCREAMING_SNAKE_CASE (`GAME_PLATFORMS`, `MAX_CACHE_SIZE`)
- **Placement:**
  - Global constants: `@Shared/domain/constants/`
  - Context-specific constants: In the file where used
  - Class-specific constants: `private readonly` attribute

```typescript
// shared/domain/constants/platforms.ts (global)
export const GAME_PLATFORMS = ['PS5', 'Xbox', 'PC', 'Switch'] as const;

// collection/ui/components/GameList.tsx (file-level)
const MAX_ITEMS_PER_PAGE = 20;

// collection/domain/entities/Game.ts (class-level)
class Game {
  private readonly MAX_TITLE_LENGTH = 200;
}
```

**Event Naming:**
- **Format:** lowercase with dot notation (`game.added`, `wishlist.updated`, `maintenance.completed`)
- **Pattern:** `<entity>.<action>` in past tense

```typescript
// ✅ Correct
eventBus.publish({ type: 'game.added', payload: { ... } });
eventBus.publish({ type: 'wishlist.item.moved', payload: { ... } });

// ❌ Avoid
eventBus.publish({ type: 'GAME_ADDED', payload: { ... } }); // Wrong case
eventBus.publish({ type: 'GameAdded', payload: { ... } });  // Wrong case
eventBus.publish({ type: 'add-game', payload: { ... } });   // Wrong tense
```

### Structure Patterns

**TypeScript Path Aliases:**

**MANDATORY:** Use path aliases by bounded context (never relative imports across contexts)

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@App/*": ["./src/app/*"],
      "@Shared/*": ["./src/shared/*"],
      "@Collection/*": ["./src/collection/*"],
      "@Wishlist/*": ["./src/wishlist/*"],
      "@Maintenance/*": ["./src/maintenance/*"]
    }
  }
}

// ✅ Correct: Using aliases
import { Game } from '@Collection/domain/entities/Game';
import { EventBus } from '@Shared/infrastructure/events/EventBus';
import { WishlistItem } from '@Wishlist/domain/entities/WishlistItem';

// ❌ Avoid: Relative imports across contexts
import { Game } from '../../../collection/domain/entities/Game';
import { EventBus } from '../../shared/infrastructure/events/EventBus';

// ✅ Allowed: Relative imports within same context/folder
import { GameTitle } from './GameTitle'; // Same folder
import { Platform } from '../value-objects/Platform'; // Same context
```

**Module Exports:**

**MANDATORY:** NO default exports (named exports only)

```typescript
// ✅ Correct: Named exports
export const GameCard = ({ game }: GameCardProps) => { };
export class AddGameUseCase { }
export type GameDTO = { title: string; platform: string };

// ❌ Avoid: Default exports
export default GameCard;
export default class AddGameUseCase { }
```

**Index Files:**

**MANDATORY:** NO index.ts barrel files

**Rationale:**
- Explicit imports show exact dependencies
- Avoids circular dependency issues
- Better tree-shaking (unused exports not imported)
- Clear module boundaries in Clean Architecture

```typescript
// ❌ Avoid: index.ts barrel exports
// collection/domain/entities/index.ts
export { Game } from './Game';
export { GameId } from './GameId';

// ❌ Then importing from index
import { Game, GameId } from '@Collection/domain/entities';

// ✅ Correct: Direct imports
import { Game } from '@Collection/domain/entities/Game';
import { GameId } from '@Collection/domain/entities/GameId';
```

**Constants Placement Strategy:**

- **Global constants** (used by multiple contexts): `@Shared/domain/constants/`
- **Context constants** (used within one context): In the file where used (top-level const)
- **Class constants** (used by one class): `private readonly` class attribute

```typescript
// Example 1: Global constant (multiple contexts need platforms)
// @Shared/domain/constants/platforms.ts
export const GAME_PLATFORMS = ['PS5', 'Xbox Series X', 'PC', 'Switch'] as const;

// Example 2: File-level constant (only GameList component needs this)
// @Collection/ui/components/GameList.tsx
const DEFAULT_PAGE_SIZE = 20;
const MAX_SEARCH_LENGTH = 100;

export const GameList = () => { /* uses DEFAULT_PAGE_SIZE */ };

// Example 3: Class constant (only Game entity validates title length)
// @Collection/domain/entities/Game.ts
class Game {
  private readonly MAX_TITLE_LENGTH = 200;

  constructor(title: string) {
    if (title.length > this.MAX_TITLE_LENGTH) {
      throw new Error(`Title exceeds ${this.MAX_TITLE_LENGTH} characters`);
    }
  }
}
```

### Format Patterns

**Date/Time Format:**

**MANDATORY:** ISO 8601 format with timezone (always include timezone to avoid ambiguity)

```typescript
// ✅ Correct: ISO with timezone
const createdAt = new Date().toISOString(); // "2026-01-26T14:30:00.000Z"

// Storing in IndexedDB
await db.put('games', {
  id: 'uuid-123',
  createdAt: new Date().toISOString(), // ISO string
  updatedAt: new Date().toISOString()
});

// ❌ Avoid: Unix timestamps or locale strings
const createdAt = Date.now(); // 1737904200000 (ambiguous)
const createdAt = new Date().toString(); // "Sun Jan 26 2026..." (locale-dependent)
```

**Identifier Format:**

**MANDATORY:** UUIDv4 for all entity IDs

```typescript
import { v4 as uuidv4 } from 'uuid';

// ✅ Correct: UUID generation
const gameId = uuidv4(); // "550e8400-e29b-41d4-a716-446655440000"

// Storing in entities
class Game {
  constructor(
    public readonly id: string, // UUID string
    public title: GameTitle
  ) {}

  static create(title: GameTitle): Game {
    return new Game(uuidv4(), title);
  }
}

// ❌ Avoid: Auto-increment numbers or custom formats
const gameId = 1; // Number IDs
const gameId = 'game-123'; // Custom string format
```

**Boolean Representation:**

**MANDATORY:** Standard JavaScript `true`/`false` (no numeric or string representations)

```typescript
// ✅ Correct: Boolean values
const isOwned = true;
const isCompleted = false;

// IndexedDB storage (booleans stored as-is)
await db.put('games', { id: 'uuid', isOwned: true });

// ❌ Avoid: Numeric or string booleans
const isOwned = 1; // Don't use 1/0
const isOwned = "true"; // Don't use strings
```

### Communication Patterns

**Event System Patterns:**

**Event Structure:**

```typescript
interface DomainEvent<T = any> {
  type: string;           // Event name (lowercase.dot.notation)
  payload: T;             // Complete data (not just IDs)
  timestamp: string;      // ISO 8601 with timezone
}
```

**Event Naming Convention:**
- Format: `<entity>.<action>` in past tense
- Lowercase with dots: `game.added`, `wishlist.item.moved`, `maintenance.completed`

**Event Payload Strategy:**

**MANDATORY:** Include complete data in payload (not just IDs)

**Rationale:** Avoids additional repository queries in subscribers, improves performance, simplifies event handlers.

```typescript
// ✅ Correct: Complete data in payload
eventBus.publish({
  type: 'game.added',
  payload: {
    gameId: 'uuid-123',
    title: 'Elden Ring',
    platform: 'PS5',
    status: 'owned'
  },
  timestamp: new Date().toISOString()
});

// Subscriber has all data it needs
eventBus.subscribe('game.added', (event) => {
  const { gameId, title, platform } = event.payload;
  showToast(`${title} added to ${platform} collection`, 'success');
  // No repository query needed
});

// ❌ Avoid: Minimal payload (forces queries)
eventBus.publish({
  type: 'game.added',
  payload: { gameId: 'uuid-123' }, // Only ID
  timestamp: new Date().toISOString()
});

// Subscriber must query repository (inefficient)
eventBus.subscribe('game.added', async (event) => {
  const game = await gameRepository.findById(event.payload.gameId); // Extra query
  showToast(`${game.title} added`, 'success');
});
```

**Event Payload Types:**

Define payload types for each event to ensure type safety:

```typescript
// shared/domain/events/game-events.type.d.ts
type GameAddedPayload = {
  gameId: string;
  title: string;
  platform: string;
  status: string;
};

type GameDeletedPayload = {
  gameId: string;
  title: string; // Include title for user feedback
};

// Usage with type safety
eventBus.publish<GameAddedPayload>({
  type: 'game.added',
  payload: { gameId, title, platform, status },
  timestamp: new Date().toISOString()
});
```

### Error Handling Patterns

**Error Class Hierarchy:**

**MANDATORY:** Use error classes (not strings or plain objects)

**Simple hierarchy (Option A - MVP):**

```typescript
// shared/domain/errors/ValidationError.ts
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// shared/domain/errors/NotFoundError.ts
export class NotFoundError extends Error {
  constructor(entity: string, id: string) {
    super(`${entity} with id ${id} not found`);
    this.name = 'NotFoundError';
  }
}

// shared/infrastructure/errors/RepositoryError.ts
export class RepositoryError extends Error {
  constructor(operation: string, cause?: Error) {
    super(`Repository operation '${operation}' failed: ${cause?.message}`);
    this.name = 'RepositoryError';
    this.cause = cause;
  }
}

// shared/infrastructure/errors/ApiError.ts
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public endpoint?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```

**Usage with Result Pattern:**

```typescript
// Use case example
class AddGameUseCase {
  async execute(data: GameDTO): Promise<Result<Game, ValidationError | RepositoryError>> {
    // Validation
    if (!data.title) {
      return Result.fail(new ValidationError('Title is required'));
    }

    // Repository operation
    try {
      const game = Game.create(data);
      await this.repository.save(game);
      return Result.ok(game);
    } catch (error) {
      return Result.fail(new RepositoryError('save', error as Error));
    }
  }
}

// UI handling (type-safe error checks)
const result = await addGameUseCase.execute(data);
if (!result.success) {
  if (result.error instanceof ValidationError) {
    showToast(result.error.message, 'error'); // User-friendly
  } else if (result.error instanceof RepositoryError) {
    logError(result.error); // Log for debugging
    showToast('Failed to save game. Please try again.', 'error');
  }
  return;
}
```

### Enforcement Guidelines

**All AI Agents MUST:**

1. **Use arrow functions exclusively** (no function declarations)
2. **Follow PascalCase for components/classes**, camelCase for variables, SCREAMING_SNAKE_CASE for constants
3. **Suffix interfaces with `Interface`** and prefix abstract classes with `Abstract`
4. **Use path aliases** (@Collection/, @Shared/, etc.) for cross-context imports
5. **Use named exports only** (no default exports)
6. **Avoid index.ts barrel files** (direct imports only)
7. **Use ISO 8601 dates with timezone** (`.toISOString()`)
8. **Generate UUIDs for all entity IDs** (never auto-increment numbers)
9. **Use standard boolean true/false** (no 1/0 or "true"/"false" strings)
10. **Name events in lowercase.dot.notation** with past tense (`game.added`, not `GAME_ADDED`)
11. **Include complete data in event payloads** (not just IDs)
12. **Use error classes** (ValidationError, NotFoundError, etc.) with Result pattern
13. **Place constants strategically** (shared vs file-level vs class readonly)
14. **Never use TypeScript decorators in domain layer** (manual DI registration only)

**Pattern Enforcement:**

- **ESLint Configuration:** Starter template includes ESLint rules enforcing these patterns
- **Code Review Checklist:** Use this document as review criteria
- **AI Agent Prompting:** Include relevant pattern sections in agent prompts for each task

**Documentation of Pattern Violations:**

If a pattern must be violated for valid reasons:
1. Document the reason in a code comment
2. Add an entry to DECISIONS.md explaining the exception
3. Consider if the pattern itself needs updating

### Pattern Examples

**Good Examples:**

```typescript
// ✅ Complete example following all patterns

// @Collection/domain/entities/Game.ts
import { GameTitle } from '@Collection/domain/value-objects/GameTitle';
import { Platform } from '@Collection/domain/value-objects/Platform';
import { v4 as uuidv4 } from 'uuid';

export class Game {
  private readonly MAX_NOTES_LENGTH = 1000;

  constructor(
    public readonly id: string,
    public title: GameTitle,
    public platform: Platform,
    public isOwned: boolean,
    public createdAt: string
  ) {}

  static create(title: GameTitle, platform: Platform): Game {
    return new Game(
      uuidv4(),
      title,
      platform,
      false,
      new Date().toISOString()
    );
  }
}

// @Collection/application/use-cases/AddGame.ts
import { Game } from '@Collection/domain/entities/Game';
import { GameRepositoryInterface } from '@Collection/domain/repositories/GameRepositoryInterface';
import { GameTitle } from '@Collection/domain/value-objects/GameTitle';
import { Platform } from '@Collection/domain/value-objects/Platform';
import { Result } from '@Shared/domain/types/result.type';
import { ValidationError } from '@Shared/domain/errors/ValidationError';
import { RepositoryError } from '@Shared/infrastructure/errors/RepositoryError';
import { EventBusInterface } from '@Shared/application/interfaces/EventBusInterface';

export type AddGameDTO = {
  title: string;
  platform: string;
};

export class AddGameUseCase {
  constructor(
    private repository: GameRepositoryInterface,
    private eventBus: EventBusInterface
  ) {}

  execute = async (data: AddGameDTO): Promise<Result<Game, ValidationError | RepositoryError>> => {
    // Validation with Value Objects
    const title = new GameTitle(data.title); // Throws if invalid
    const platform = new Platform(data.platform);

    // Create entity
    const game = Game.create(title, platform);

    // Persist
    const result = await this.repository.save(game);
    if (!result.success) {
      return Result.fail(result.error);
    }

    // Publish event with complete data
    this.eventBus.publish({
      type: 'game.added',
      payload: {
        gameId: game.id,
        title: game.title.getValue(),
        platform: game.platform.getValue(),
        isOwned: game.isOwned
      },
      timestamp: new Date().toISOString()
    });

    return Result.ok(game);
  };
}

// @Collection/ui/components/GameCard.tsx
import { Game } from '@Collection/domain/entities/Game';
import { Button } from '@pplancq/shelter-ui-react';

export type GameCardProps = {
  game: Game;
  onEdit: (gameId: string) => void;
  onDelete: (gameId: string) => void;
};

export const GameCard = ({ game, onEdit, onDelete }: GameCardProps) => {
  const handleEdit = () => onEdit(game.id);
  const handleDelete = () => onDelete(game.id);

  return (
    <div className="game-card">
      <h3>{game.title.getValue()}</h3>
      <p>{game.platform.getValue()}</p>
      <Button onClick={handleEdit}>Edit</Button>
      <Button onClick={handleDelete} color="danger">Delete</Button>
    </div>
  );
};
```

**Anti-Patterns to Avoid:**

```typescript
// ❌ AVOID: Multiple anti-patterns demonstrated

// Wrong: function declaration instead of arrow function
function addGame(data: GameDTO) { }

// Wrong: default export
export default class AddGameUseCase { }

// Wrong: relative import across contexts
import { Game } from '../../../collection/domain/entities/Game';

// Wrong: index.ts barrel export
// collection/domain/entities/index.ts
export * from './Game';

// Wrong: Interface without suffix
export interface GameRepository { } // Should be GameRepositoryInterface

// Wrong: Abstract class with suffix instead of prefix
export abstract class RepositoryAbstract { } // Should be AbstractRepository

// Wrong: lowercase constant
const maxCacheSize = 50; // Should be MAX_CACHE_SIZE

// Wrong: Event name format
eventBus.publish({ type: 'GAME_ADDED', ... }); // Should be 'game.added'
eventBus.publish({ type: 'addGame', ... });    // Should be 'game.added'

// Wrong: Minimal event payload
eventBus.publish({
  type: 'game.added',
  payload: { gameId: 'uuid' } // Missing title, platform, etc.
});

// Wrong: Non-ISO date
const createdAt = Date.now(); // Should be new Date().toISOString()

// Wrong: Numeric boolean
const isOwned = 1; // Should be true/false

// Wrong: String error instead of class
return Result.fail('Validation failed'); // Should be new ValidationError(...)

// Wrong: TypeScript decorator in domain layer
import { injectable } from 'inversify';

@injectable() // ❌ Domain depends on InversifyJS
export class Game { }
```

## Project Structure & Boundaries

### Requirements Mapping to Bounded Contexts

**Collection Context** (`src/collection/`)
- **FR-001**: Add game to collection → `AddGame.ts` use case
- **FR-002**: Edit game details → `EditGame.ts` use case
- **FR-003**: Delete game → `DeleteGame.ts` use case
- **FR-004**: View collection → `GetGames.ts` use case
- **FR-005**: Search games → `SearchGames.ts` use case
- **FR-006**: Filter by platform/status → `FilterGames.ts` use case
- **FR-007**: Verify ownership (prevent duplicates) → `VerifyOwnership.ts` use case
- **FR-017**: IGDB metadata enrichment → `IGDBAdapter.ts` in infrastructure

**Wishlist Context** (`src/wishlist/`)
- **FR-008**: Add game to wishlist → `AddToWishlist.ts` use case
- **FR-009**: Update wishlist priority → `UpdatePriority.ts` use case
- **FR-010**: Update wishlist status → `UpdateStatus.ts` use case
- **FR-011**: Move wishlist to collection → `MoveToCollection.ts` use case (publishes event to collection context)

**Maintenance Context** (`src/maintenance/`)
- **FR-012**: Add console → `AddConsole.ts` use case
- **FR-013**: Edit console → `EditConsole.ts` use case
- **FR-014**: Delete console → `DeleteConsole.ts` use case
- **FR-015**: Schedule maintenance → `ScheduleMaintenance.ts` use case
- **FR-016**: Track maintenance history → `GetMaintenanceHistory.ts` use case

**Shared Kernel** (`src/shared/`)
- IndexedDB base adapter
- Event Bus implementation
- Result<T, E> pattern
- Error classes (ValidationError, NotFoundError, etc.)
- Common Value Objects (if any)
- Cache strategy interfaces

**App Foundation** (`src/app/`)
- React Router configuration
- InversifyJS DI container composition
- PWA configuration
- Global providers (DI, Theme)

### Complete Project Directory Structure

```
lab-clean-architecture-react/
├── README.md
├── CONTRIBUTING.md
├── LICENSE
├── next-steps.md
├── package.json
├── tsconfig.json
├── rsbuild.config.ts
├── .env.example
├── .gitignore
├── .editorconfig
├── .prettierrc
├── .eslintrc.json
│
├── _bmad/                                    # BMAD framework configuration
│   ├── _config/
│   ├── bmm/
│   └── core/
│
├── _bmad-output/                             # Generated documentation
│   ├── analysis/
│   ├── planning-artifacts/
│   │   ├── prd.md
│   │   ├── product-brief-lab-clean-architecture-react-2026-01-14.md
│   │   ├── ux-design-specification.md
│   │   ├── architecture.md                   # This document
│   │   └── research/
│   └── implementation-artifacts/
│
├── http_client/                              # API testing (WebStorm HTTP Client)
│   └── igdb/
│       ├── auth.http
│       ├── games.http
│       └── environement/
│           ├── http-client.env.json
│           └── http-client.private.env.json
│
├── public/                                   # Static assets
│   ├── favicon.ico
│   ├── manifest.json                         # PWA manifest
│   └── assets/
│       └── icons/                            # Platform icons, etc.
│
├── tests/                                    # Tests organized by type
│   ├── unit/                                 # Unit tests (domain, use cases)
│   │   ├── collection/
│   │   │   ├── domain/
│   │   │   │   ├── Game.test.ts
│   │   │   │   ├── GameId.test.ts
│   │   │   │   ├── GameTitle.test.ts
│   │   │   │   ├── Platform.test.ts
│   │   │   │   └── Status.test.ts
│   │   │   └── application/
│   │   │       ├── AddGame.test.ts
│   │   │       ├── EditGame.test.ts
│   │   │       ├── DeleteGame.test.ts
│   │   │       ├── GetGames.test.ts
│   │   │       ├── SearchGames.test.ts
│   │   │       ├── FilterGames.test.ts
│   │   │       └── VerifyOwnership.test.ts
│   │   ├── wishlist/
│   │   │   ├── domain/
│   │   │   │   ├── WishlistItem.test.ts
│   │   │   │   ├── Priority.test.ts
│   │   │   │   └── WishlistStatus.test.ts
│   │   │   └── application/
│   │   │       ├── AddToWishlist.test.ts
│   │   │       ├── UpdatePriority.test.ts
│   │   │       ├── UpdateStatus.test.ts
│   │   │       └── MoveToCollection.test.ts
│   │   ├── maintenance/
│   │   │   ├── domain/
│   │   │   │   ├── Console.test.ts
│   │   │   │   ├── MaintenanceTask.test.ts
│   │   │   │   └── ConsoleCondition.test.ts
│   │   │   └── application/
│   │   │       ├── AddConsole.test.ts
│   │   │       ├── EditConsole.test.ts
│   │   │       ├── DeleteConsole.test.ts
│   │   │       ├── ScheduleMaintenance.test.ts
│   │   │       └── GetMaintenanceHistory.test.ts
│   │   └── shared/
│   │       ├── domain/
│   │       │   └── Result.test.ts
│   │       └── infrastructure/
│   │           ├── EventBus.test.ts
│   │           └── CacheStrategy.test.ts
│   │
│   ├── integration/                          # Integration tests (repositories, adapters)
│   │   ├── collection/
│   │   │   ├── IndexedDBGameRepository.test.ts
│   │   │   └── IGDBAdapter.test.ts
│   │   ├── wishlist/
│   │   │   └── IndexedDBWishlistRepository.test.ts
│   │   ├── maintenance/
│   │   │   ├── IndexedDBConsoleRepository.test.ts
│   │   │   └── IndexedDBMaintenanceRepository.test.ts
│   │   └── shared/
│   │       ├── IndexedDBBase.test.ts
│   │       └── EventBusIntegration.test.ts
│   │
│   ├── e2e/                                  # End-to-end tests (Playwright)
│   │   ├── collection/
│   │   │   ├── add-game.spec.ts
│   │   │   ├── edit-game.spec.ts
│   │   │   ├── delete-game.spec.ts
│   │   │   ├── search-games.spec.ts
│   │   │   └── verify-ownership.spec.ts
│   │   ├── wishlist/
│   │   │   ├── add-to-wishlist.spec.ts
│   │   │   ├── update-priority.spec.ts
│   │   │   └── move-to-collection.spec.ts
│   │   ├── maintenance/
│   │   │   ├── add-console.spec.ts
│   │   │   ├── schedule-maintenance.spec.ts
│   │   │   └── maintenance-history.spec.ts
│   │   └── fixtures/
│   │       └── test-data.ts
│   │
│   └── visual/                               # Visual regression tests (future)
│       └── components/
│           ├── GameCard.visual.test.ts
│           ├── WishlistCard.visual.test.ts
│           └── ConsoleCard.visual.test.ts
│
└── src/                                      # Source code
    │
    ├── app/                                  # Application Foundation (Bootstrap Layer)
    │   ├── main.tsx                          # Application entry point
    │   ├── App.tsx                           # Root component with providers
    │   │
    │   ├── router/                           # React Router configuration
    │   │   ├── routes.tsx                    # Route definitions with lazy loading
    │   │   └── guards/                       # Route guards (future auth)
    │   │       └── AuthGuard.tsx
    │   │
    │   ├── providers/                        # Global providers
    │   │   ├── DIProvider.tsx                # InversifyJS container provider
    │   │   └── ThemeProvider.tsx             # shelter-ui theme provider
    │   │
    │   └── config/                           # Application configuration
    │       ├── di-container.ts               # InversifyJS container composition
    │       ├── pwa-config.ts                 # PWA configuration (cache sizes, etc.)
    │       └── constants.ts                  # Global application constants
    │
    ├── shared/                               # Shared Kernel (Cross-Context)
    │   │
    │   ├── domain/                           # Shared domain primitives
    │   │   ├── types/
    │   │   │   └── result.type.d.ts          # Result<T, E> type definition
    │   │   ├── errors/
    │   │   │   ├── ValidationError.ts
    │   │   │   ├── NotFoundError.ts
    │   │   │   └── DomainError.ts
    │   │   ├── value-objects/                # Shared Value Objects (if any)
    │   │   │   └── Email.ts                  # Example (if user auth added later)
    │   │   └── constants/
    │   │       └── platforms.ts              # GAME_PLATFORMS constant
    │   │
    │   ├── application/                      # Shared application logic
    │   │   └── interfaces/
    │   │       ├── EventBusInterface.ts      # Event Bus contract
    │   │       ├── CacheStrategyInterface.ts # Cache strategy contract
    │   │       └── LoggerInterface.ts        # Logger contract (future)
    │   │
    │   ├── infrastructure/                   # Shared infrastructure
    │   │   ├── storage/
    │   │   │   ├── IndexedDBBase.ts          # Base IndexedDB adapter
    │   │   │   └── database-schema.ts        # IndexedDB schema definition
    │   │   ├── events/
    │   │   │   ├── InMemoryEventBus.ts       # Event Bus implementation
    │   │   │   └── DomainEvent.ts            # Event base class
    │   │   ├── cache/
    │   │   │   ├── PermanentCacheStrategy.ts # Permanent cache (MVP)
    │   │   │   └── TTLCacheStrategy.ts       # TTL cache (future)
    │   │   ├── http/
    │   │   │   └── HttpClient.ts             # HTTP client wrapper (for IGDB)
    │   │   ├── errors/
    │   │   │   ├── RepositoryError.ts
    │   │   │   └── ApiError.ts
    │   │   └── logger/
    │   │       └── ConsoleLogger.ts          # Console logger implementation
    │   │
    │   └── ui/                               # Shared UI components
    │       ├── components/
    │       │   ├── ErrorBoundary.tsx         # Error boundary wrapper
    │       │   ├── LoadingSpinner.tsx        # Loading indicator
    │       │   ├── Toast.tsx                 # Toast notification (custom)
    │       │   └── ConfirmDialog.tsx         # Confirmation dialog
    │       ├── hooks/
    │       │   ├── useToast.ts               # Toast hook
    │       │   └── useDebounce.ts            # Debounce hook
    │       └── utils/
    │           ├── formatters.ts             # Date, number formatters
    │           └── validators.ts             # Common validators
    │
    ├── collection/                           # Collection Context (Bounded Context)
    │   │
    │   ├── domain/                           # Collection Domain Layer
    │   │   ├── entities/
    │   │   │   ├── Game.ts                   # Game entity
    │   │   │   └── GameId.ts                 # Game ID value object
    │   │   ├── value-objects/
    │   │   │   ├── GameTitle.ts              # Title value object with validation
    │   │   │   ├── Platform.ts               # Platform enum/value object
    │   │   │   ├── Status.ts                 # Game status (owned, physical, digital)
    │   │   │   ├── ReleaseDate.ts            # Release date value object
    │   │   │   └── PurchaseDate.ts           # Purchase date value object
    │   │   ├── repositories/
    │   │   │   └── GameRepositoryInterface.ts # Repository interface
    │   │   └── events/
    │   │       └── game-events.type.d.ts     # Event payload types
    │   │
    │   ├── application/                      # Collection Use Cases Layer
    │   │   ├── use-cases/
    │   │   │   ├── AddGame.ts                # Add game use case
    │   │   │   ├── EditGame.ts               # Edit game use case
    │   │   │   ├── DeleteGame.ts             # Delete game use case
    │   │   │   ├── GetGames.ts               # Get all games use case
    │   │   │   ├── GetGameById.ts            # Get single game use case
    │   │   │   ├── SearchGames.ts            # Search games use case
    │   │   │   ├── FilterGames.ts            # Filter games use case
    │   │   │   └── VerifyOwnership.ts        # Check duplicate ownership
    │   │   └── dtos/
    │   │       ├── GameDTO.ts                # Game Data Transfer Object
    │   │       ├── GameFilterDTO.ts          # Filter criteria DTO
    │   │       └── GameSearchDTO.ts          # Search criteria DTO
    │   │
    │   ├── infrastructure/                   # Collection Infrastructure Layer
    │   │   ├── persistence/
    │   │   │   └── IndexedDBGameRepository.ts # IndexedDB implementation
    │   │   ├── api/
    │   │   │   ├── IGDBAdapter.ts            # IGDB API adapter
    │   │   │   └── IGDBMapper.ts             # Map IGDB response to domain
    │   │   └── di/
    │   │       └── collection.container.ts    # Collection DI container
    │   │
    │   └── ui/                               # Collection Presentation Layer
    │       ├── components/
    │       │   ├── GameCard.tsx              # Game card component (Widget Card)
    │       │   ├── GameList.tsx              # Game list component
    │       │   ├── GameListItem.tsx          # Game list item component
    │       │   ├── GameForm.tsx              # Add/Edit game form
    │       │   ├── GameSearchBar.tsx         # Search bar component
    │       │   ├── GameFilters.tsx           # Filter component
    │       │   ├── PlatformBadge.tsx         # Platform badge component
    │       │   ├── StatusIndicator.tsx       # Status indicator component
    │       │   └── CoverThumbnail.tsx        # Game cover thumbnail
    │       ├── pages/
    │       │   ├── CollectionPage.tsx        # Main collection page
    │       │   └── GameDetailPage.tsx        # Game detail page
    │       └── hooks/
    │           ├── useGameForm.ts            # Game form hook
    │           ├── useGameSearch.ts          # Search hook
    │           └── useGameFilters.ts         # Filters hook
    │
    ├── wishlist/                             # Wishlist Context (Bounded Context)
    │   │
    │   ├── domain/                           # Wishlist Domain Layer
    │   │   ├── entities/
    │   │   │   ├── WishlistItem.ts           # Wishlist item entity
    │   │   │   └── WishlistItemId.ts         # Wishlist item ID
    │   │   ├── value-objects/
    │   │   │   ├── Priority.ts               # Priority (low/medium/high)
    │   │   │   └── WishlistStatus.ts         # Status (wishlist/pre-ordered/purchased)
    │   │   ├── repositories/
    │   │   │   └── WishlistRepositoryInterface.ts
    │   │   └── events/
    │   │       └── wishlist-events.type.d.ts
    │   │
    │   ├── application/                      # Wishlist Use Cases Layer
    │   │   ├── use-cases/
    │   │   │   ├── AddToWishlist.ts          # Add to wishlist
    │   │   │   ├── RemoveFromWishlist.ts     # Remove from wishlist
    │   │   │   ├── UpdatePriority.ts         # Update priority
    │   │   │   ├── UpdateStatus.ts           # Update status
    │   │   │   ├── GetWishlistItems.ts       # Get all wishlist items
    │   │   │   └── MoveToCollection.ts       # Move to collection (publishes event)
    │   │   └── dtos/
    │   │       ├── WishlistItemDTO.ts
    │   │       └── WishlistFilterDTO.ts
    │   │
    │   ├── infrastructure/                   # Wishlist Infrastructure Layer
    │   │   ├── persistence/
    │   │   │   └── IndexedDBWishlistRepository.ts
    │   │   └── di/
    │   │       └── wishlist.container.ts     # Wishlist DI container
    │   │
    │   └── ui/                               # Wishlist Presentation Layer
    │       ├── components/
    │       │   ├── WishlistCard.tsx          # Wishlist card component
    │       │   ├── WishlistList.tsx          # Wishlist list component
    │       │   ├── WishlistForm.tsx          # Add/Edit wishlist form
    │       │   └── PrioritySelector.tsx      # Priority selector component
    │       ├── pages/
    │       │   └── WishlistPage.tsx          # Wishlist page
    │       └── hooks/
    │           └── useWishlistForm.ts        # Wishlist form hook
    │
    └── maintenance/                          # Maintenance Context (Bounded Context)
        │
        ├── domain/                           # Maintenance Domain Layer
        │   ├── entities/
        │   │   ├── Console.ts                # Console entity
        │   │   ├── ConsoleId.ts              # Console ID
        │   │   ├── MaintenanceTask.ts        # Maintenance task entity
        │   │   └── MaintenanceTaskId.ts      # Task ID
        │   ├── value-objects/
        │   │   ├── ConsoleCondition.ts       # Console condition
        │   │   ├── MaintenanceType.ts        # Maintenance type (cleaning, repair)
        │   │   └── ScheduledDate.ts          # Scheduled date value object
        │   ├── repositories/
        │   │   ├── ConsoleRepositoryInterface.ts
        │   │   └── MaintenanceRepositoryInterface.ts
        │   └── events/
        │       └── maintenance-events.type.d.ts
        │
        ├── application/                      # Maintenance Use Cases Layer
        │   ├── use-cases/
        │   │   ├── AddConsole.ts             # Add console
        │   │   ├── EditConsole.ts            # Edit console
        │   │   ├── DeleteConsole.ts          # Delete console
        │   │   ├── GetConsoles.ts            # Get all consoles
        │   │   ├── ScheduleMaintenance.ts    # Schedule maintenance task
        │   │   ├── CompleteMaintenance.ts    # Mark task complete
        │   │   └── GetMaintenanceHistory.ts  # Get maintenance history
        │   └── dtos/
        │       ├── ConsoleDTO.ts
        │       └── MaintenanceTaskDTO.ts
        │
        ├── infrastructure/                   # Maintenance Infrastructure Layer
        │   ├── persistence/
        │   │   ├── IndexedDBConsoleRepository.ts
        │   │   └── IndexedDBMaintenanceRepository.ts
        │   └── di/
        │       └── maintenance.container.ts   # Maintenance DI container
        │
        └── ui/                               # Maintenance Presentation Layer
            ├── components/
            │   ├── ConsoleCard.tsx           # Console card component (with tabs)
            │   ├── ConsoleList.tsx           # Console list component
            │   ├── ConsoleForm.tsx           # Add/Edit console form
            │   ├── MaintenanceTimeline.tsx   # Maintenance timeline component
            │   ├── MaintenanceForm.tsx       # Schedule maintenance form
            │   └── PhotoUpload.tsx           # Photo upload component (custom)
            ├── pages/
            │   ├── ConsolesPage.tsx          # Consoles page
            │   └── MaintenanceDetailPage.tsx # Maintenance detail page
            └── hooks/
                ├── useConsoleForm.ts         # Console form hook
                └── useMaintenanceForm.ts     # Maintenance form hook
```

### Architectural Boundaries & Integration Points

**Bounded Context Isolation:**

Each bounded context (`collection/`, `wishlist/`, `maintenance/`) is **completely self-contained**:
- Has its own domain layer (entities, value objects, repository interfaces)
- Has its own use cases (application layer)
- Has its own infrastructure (repositories, adapters, DI container)
- Has its own UI (components, pages, hooks)

**Cross-Context Communication:**

Contexts communicate **only through events** via the Event Bus (no direct use case calls):

```typescript
// Example: Wishlist → Collection communication
// wishlist/application/use-cases/MoveToCollection.ts
eventBus.publish({
  type: 'wishlist.item.moved',
  payload: { gameId, title, platform, ... },
  timestamp: new Date().toISOString()
});

// collection/ subscribes in DI container
// collection/infrastructure/di/collection.container.ts
eventBus.subscribe('wishlist.item.moved', async (event) => {
  const addGameUseCase = container.get<AddGameUseCase>(TYPES.AddGameUseCase);
  await addGameUseCase.execute(event.payload);
});
```

**Shared Kernel Access:**

All contexts can import from `@Shared/` without creating coupling:
- Domain types (Result<T, E>)
- Error classes (ValidationError, NotFoundError, etc.)
- Infrastructure services (EventBus, IndexedDBBase, CacheStrategy)
- UI components (ErrorBoundary, Toast, LoadingSpinner)

**Data Access Boundaries:**

Each context has its own repository implementation but all use the shared IndexedDB base:

```typescript
// Shared IndexedDB connection
// @Shared/infrastructure/storage/IndexedDBBase.ts
export class IndexedDBBase {
  protected async getDB(): Promise<IDBPDatabase> {
    return await openDB('GameCollectionDB', 1, { ... });
  }
}

// Context-specific repository extends base
// @Collection/infrastructure/persistence/IndexedDBGameRepository.ts
export class IndexedDBGameRepository extends IndexedDBBase implements GameRepositoryInterface {
  async save(game: Game): Promise<Result<void, RepositoryError>> {
    const db = await this.getDB();
    await db.put('games', { id: game.id, ... });
    return Result.ok(undefined);
  }
}
```

**Dependency Injection Boundaries:**

Each context has its own DI container, composed at app level:

```typescript
// @App/config/di-container.ts
import { Container } from 'inversify';
import { sharedContainer } from '@Shared/infrastructure/di/shared.container';
import { collectionContainer } from '@Collection/infrastructure/di/collection.container';
import { wishlistContainer } from '@Wishlist/infrastructure/di/wishlist.container';
import { maintenanceContainer } from '@Maintenance/infrastructure/di/maintenance.container';

export const appContainer = Container.merge(
  sharedContainer,
  collectionContainer,
  wishlistContainer,
  maintenanceContainer
);
```

**UI Component Boundaries:**

- **shelter-ui components** used across all contexts (Button, Input, Typography, etc.)
- **Custom shared components** in `@Shared/ui/components/` (ErrorBoundary, Toast, LoadingSpinner)
- **Context-specific components** stay within their context (`@Collection/ui/components/GameCard.tsx`)

No UI components are shared between bounded contexts (no `@Collection/ui/components/GameCard.tsx` used in `@Wishlist/`). If needed, a component moves to `@Shared/ui/components/`.

### Path Alias Configuration

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@App/*": ["./src/app/*"],
      "@Shared/*": ["./src/shared/*"],
      "@Collection/*": ["./src/collection/*"],
      "@Wishlist/*": ["./src/wishlist/*"],
      "@Maintenance/*": ["./src/maintenance/*"]
    }
  }
}
```

### Clean Architecture Dependency Flow

```
┌─────────────────────────────────────────────────────────────┐
│                         UI Layer                            │
│  (React Components, Pages, Hooks)                           │
│  Depends on ↓                                               │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
│  (Use Cases, DTOs)                                          │
│  Depends on ↓                                               │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                      Domain Layer                           │
│  (Entities, Value Objects, Repository Interfaces)           │
│  Depends on NOTHING (pure business logic)                   │
└─────────────────────────────────────────────────────────────┘
                           ↑
                           │ implements
┌─────────────────────────────────────────────────────────────┐
│                  Infrastructure Layer                       │
│  (Repository Implementations, API Adapters, DI Containers)  │
│  Depends on ↑ (implements domain interfaces)                │
└─────────────────────────────────────────────────────────────┘
```

**Critical Rule:** Dependencies always point INWARD. The domain layer has zero external dependencies.

---

## Architecture Completion Summary

### Workflow Completion

**Architecture Decision Workflow:** COMPLETED ✅
**Total Steps Completed:** 8
**Date Completed:** 2026-01-22
**Document Location:** `_bmad-output/planning-artifacts/architecture.md`

### Final Architecture Deliverables

**📋 Complete Architecture Document**

- All architectural decisions documented with specific versions
- Implementation patterns ensuring AI agent consistency
- Complete project structure with all files and directories
- Requirements to architecture mapping
- Validation confirming coherence and completeness

**🏗️ Implementation Ready Foundation**

- 10 core architectural decisions made
- 15+ implementation patterns defined
- 3 bounded contexts specified (Collection, Wishlist, Maintenance)
- 17 functional requirements fully supported

**📚 AI Agent Implementation Guide**

- Technology stack with verified versions (React 19+, TypeScript 5.7+, Rsbuild 1.1.14+)
- Consistency rules that prevent implementation conflicts
- Project structure with clear boundaries (Clean Architecture + DDD Bounded Contexts)
- Integration patterns and communication standards (Event Bus)

### Implementation Handoff

**For AI Agents:**
This architecture document is your complete guide for implementing lab-clean-architecture-react. Follow all decisions, patterns, and structures exactly as documented.

**First Implementation Priority:**
```bash
npm create @pplancq/react-app@latest lab-clean-architecture-react
```

**Development Sequence:**

1. Initialize project using documented starter template
2. Set up development environment per architecture (IndexedDB schema, DI containers)
3. Implement core architectural foundations (Shared kernel: EventBus, Result pattern, IndexedDBBase)
4. Build features following established patterns (Collection context → Wishlist context → Maintenance context)
5. Maintain consistency with documented rules (arrow functions only, no decorators in domain, manual DI registration)

### Quality Assurance Checklist

**✅ Architecture Coherence**

- [x] All decisions work together without conflicts
- [x] Technology choices are compatible (React 19 + Rsbuild + InversifyJS + IndexedDB)
- [x] Patterns support the architectural decisions (Result pattern + Value Objects + Event Bus)
- [x] Structure aligns with all choices (bounded contexts with Clean Architecture layers inside)

**✅ Requirements Coverage**

- [x] All functional requirements are supported (FR-001 to FR-017 mapped to contexts)
- [x] All non-functional requirements are addressed (PWA with 50MB cache, WCAG 2.1 AA, IndexedDB resilience)
- [x] Cross-cutting concerns are handled (Event Bus, shared error handling, DI, caching)
- [x] Integration points are defined (IGDB OAuth2 Client Credentials, EventBus, IndexedDB)

**✅ Implementation Readiness**

- [x] Decisions are specific and actionable (exact versions, command examples, code snippets)
- [x] Patterns prevent agent conflicts (no default exports, no index.ts, arrow functions only)
- [x] Structure is complete and unambiguous (200+ file paths documented)
- [x] Examples are provided for clarity (Game entity, AddGameUseCase, EventBus integration)

### Project Success Factors

**🎯 Clear Decision Framework**
Every technology choice was made collaboratively with clear rationale, ensuring all stakeholders understand the architectural direction. Manual DI registration keeps domain pure, Event Bus decouples contexts, Result pattern ensures type-safe error handling.

**🔧 Consistency Guarantee**
Implementation patterns and rules ensure that multiple AI agents will produce compatible, consistent code that works together seamlessly. ESLint conventions documented (arrow functions only, PascalCase components, camelCase variables, Abstract prefix for abstract classes).

**📋 Complete Coverage**
All project requirements are architecturally supported, with clear mapping from business needs to technical implementation. Collection context (FR-001 to FR-007, FR-017), Wishlist context (FR-008 to FR-011), Maintenance context (FR-012 to FR-016).

**🏗️ Solid Foundation**
The chosen starter template (@pplancq/react-app) and architectural patterns (Clean Architecture + DDD Bounded Contexts) provide a production-ready foundation following current best practices. IndexedDB migrations manual with code, PWA App Shell pattern, TanStack Query + InversifyJS state management.

---

**Architecture Status:** READY FOR IMPLEMENTATION ✅

**Next Phase:** Begin implementation using the architectural decisions and patterns documented herein.

**Document Maintenance:** Update this architecture when major technical decisions are made during implementation.


**Critical Rule:** Dependencies always point INWARD. The domain layer has zero external dependencies.

