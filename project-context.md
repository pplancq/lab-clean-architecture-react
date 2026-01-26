---
project_name: 'lab-clean-architecture-react'
user_name: 'Paul'
date: '2026-01-26'
sections_completed: ['technology_stack', 'architecture', 'naming_conventions', 'code_patterns', 'testing', 'anti_patterns']
source_documents: ['architecture.md', 'prd.md', 'ux-design-specification.md']
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

**CRITICAL**: This is an educational laboratory project (80% learning, 20% utility) demonstrating Clean Architecture + DDD Bounded Contexts in React. Every architectural decision must be explicit, documented, and transparent for learning purposes.

---

## Technology Stack & Versions

### Core Framework
- **React**: 19+ (latest stable)
- **TypeScript**: 5.7+ with strict mode ENABLED
- **Build Tool**: Rsbuild 1.1.14+
- **Node**: Latest LTS version

### State Management
- **TanStack Query Core** (NOT React Query - we use the framework-agnostic core)
- **InversifyJS** for Dependency Injection
- **React hooks** for local UI state ONLY

### Data Layer
- **IndexedDB** via `idb` library (Dexie.js style API)
- Single database: `GameCollectionDB`
- 5 stores: `games`, `wishlist`, `consoles`, `maintenance`, `game_metadata`

### UI Framework
- **shelter-ui** (@pplancq/shelter-ui-react) - custom design system
- **Sass + CSS Modules** (NO Tailwind, NO CSS-in-JS)
- Built-in light/dark theme support

### Testing
- **Vitest** (unit tests)
- **React Testing Library** (component tests)
- **Vitest Browser Mode** (component integration tests)
- **Playwright** (E2E tests)
- **Axe** (@axe-core/playwright for accessibility)

### PWA
- **Rsbuild PWA Plugin**
- **Service Worker**: App Shell pattern
- **Cache Strategy**: Cache-First for assets, Network-First for API

### External APIs
- **IGDB API**: OAuth2 Client Credentials flow (game metadata)

---

## Architecture Principles

### Clean Architecture + DDD Bounded Contexts (Hybrid)

**Structure Philosophy:**
- Vertical slices (bounded contexts) at top level
- Horizontal layers (Clean Architecture) inside each context
- Dependency rule: inner layers NEVER depend on outer layers

**Bounded Contexts:**
1. **Collection** (FR-001 to FR-007, FR-017) - Game collection management
2. **Wishlist** (FR-008 to FR-011) - Wishlist tracking
3. **Maintenance** (FR-012 to FR-016) - Console maintenance

**Layers (within each context):**
```
src/
├── app/                    # Application bootstrap
├── shared/                 # Shared kernel (cross-context)
├── collection/             # Collection bounded context
│   ├── domain/             # Entities, Value Objects, Repository Interfaces
│   ├── application/        # Use Cases, DTOs
│   ├── infrastructure/     # Repository implementations, API adapters, DI
│   └── ui/                 # React components, pages, hooks
├── wishlist/               # Wishlist bounded context (same structure)
└── maintenance/            # Maintenance bounded context (same structure)
```

### CRITICAL Dependency Rules

**Domain Layer:**
- ❌ ZERO external dependencies (no InversifyJS, no React, no libraries)
- ✅ Only pure TypeScript classes and interfaces
- ✅ No decorators, no annotations
- ✅ Pure business logic only

**Application Layer:**
- ✅ Can depend on Domain layer
- ❌ Cannot depend on Infrastructure or UI layers
- ✅ Defines interfaces for infrastructure (Repository, Adapter)

**Infrastructure Layer:**
- ✅ Implements domain interfaces
- ✅ Can use external libraries (InversifyJS, idb, axios)
- ✅ Manual DI registration (NO decorators in domain)

**UI Layer:**
- ✅ Depends on Application layer (Use Cases)
- ✅ Uses React, hooks, shelter-ui
- ❌ Never imports domain entities directly (use DTOs)

---

## Naming Conventions

### Functions & Methods
- ✅ **Arrow functions ONLY** (no function declarations)
- ✅ `const myFunction = () => { }`
- ❌ `function myFunction() { }` (FORBIDDEN)

### Components & Classes
- ✅ **PascalCase**: `GameCard`, `AddGameUseCase`, `GameRepository`

### Variables & Constants
- ✅ **camelCase** for variables: `gameTitle`, `platformId`
- ✅ **SCREAMING_SNAKE_CASE** for constants: `MAX_CACHE_SIZE`, `GAME_PLATFORMS`

### Interfaces & Abstract Classes
- ✅ Interfaces: **suffix with `Interface`** → `GameRepositoryInterface`, `CacheStrategyInterface`
- ✅ Abstract classes: **prefix with `Abstract`** → `AbstractRepository`, `AbstractUseCase`
- ❌ NOT suffix (e.g., `RepositoryAbstract` is WRONG)

### Files
- ✅ PascalCase for components/classes: `GameCard.tsx`, `Game.ts`
- ✅ camelCase for utilities: `formatters.ts`, `validators.ts`
- ✅ lowercase for configs: `rsbuild.config.ts`, `tsconfig.json`

### Events
- ✅ **lowercase.dot.notation**: `game.added`, `wishlist.item.moved`, `maintenance.scheduled`

---

## Code Patterns

### Exports
- ❌ **NO default exports** (EVER)
- ✅ Named exports only: `export const GameCard = () => { }`
- ❌ `export default GameCard` (FORBIDDEN)

### Index Files
- ❌ **NO index.ts or index.tsx files** (FORBIDDEN)
- ✅ Import directly from specific files

### Imports
- ✅ Use path aliases (defined in tsconfig.json):
  - `@App/*` → `./src/app/*`
  - `@Shared/*` → `./src/shared/*`
  - `@Collection/*` → `./src/collection/*`
  - `@Wishlist/*` → `./src/wishlist/*`
  - `@Maintenance/*` → `./src/maintenance/*`
- ❌ NO relative imports across contexts: `../../../shared/` (FORBIDDEN)

### Error Handling
- ✅ **Result<T, E> pattern** (type-safe, explicit errors)
- ✅ Error class hierarchy: `ValidationError`, `NotFoundError`, `RepositoryError`, `ApiError`
- ❌ NO exceptions in use case signatures
- ❌ NO try/catch in domain layer

**Example:**
```typescript
export const addGame = async (data: GameDTO): Promise<Result<void, RepositoryError>> => {
  // Implementation
  if (error) {
    return Result.err(new RepositoryError('Failed to save game'));
  }
  return Result.ok(undefined);
};
```

### Dependency Injection
- ✅ **Manual registration** in infrastructure layer
- ❌ **NO decorators in domain layer** (keep domain pure)
- ✅ DI container per context: `collection.container.ts`, `wishlist.container.ts`
- ✅ Compose all containers in `@App/config/di-container.ts`

**Example (CORRECT):**
```typescript
// collection/infrastructure/di/collection.container.ts
import { Container } from 'inversify';
import { TYPES } from './types';

export const collectionContainer = new Container();

collectionContainer
  .bind<GameRepositoryInterface>(TYPES.GameRepository)
  .to(IndexedDBGameRepository);

collectionContainer
  .bind<AddGameUseCase>(TYPES.AddGameUseCase)
  .toDynamicValue((context) => {
    const repo = context.container.get<GameRepositoryInterface>(TYPES.GameRepository);
    return new AddGameUseCase(repo);
  });
```

**Example (WRONG - decorators in domain):**
```typescript
// ❌ FORBIDDEN
import { injectable } from 'inversify';

@injectable() // ❌ Domain layer depends on InversifyJS
export class Game { }
```

### Cross-Context Communication
- ✅ **Event Bus pattern** (InMemoryEventBus in shared kernel)
- ✅ Complete payloads (not just IDs) for performance
- ❌ NO direct use case calls between contexts

**Example:**
```typescript
// wishlist/application/use-cases/MoveToCollection.ts
eventBus.publish({
  type: 'wishlist.item.moved',
  payload: {
    gameId: item.gameId,
    title: item.title,
    platform: item.platform,
    // ... complete data
  },
  timestamp: new Date().toISOString()
});

// collection/ subscribes in DI container
// collection/infrastructure/di/collection.container.ts
eventBus.subscribe('wishlist.item.moved', async (event) => {
  const addGameUseCase = container.get<AddGameUseCase>(TYPES.AddGameUseCase);
  await addGameUseCase.execute(event.payload);
});
```

### Value Objects
- ✅ Immutable classes with validation
- ✅ Validate in constructor, throw if invalid
- ✅ Provide getter methods, NO setters
- ✅ Use for domain concepts: `GameTitle`, `Platform`, `Priority`

**Example:**
```typescript
export class GameTitle {
  private readonly value: string;

  constructor(title: string) {
    if (!title || title.trim().length === 0) {
      throw new ValidationError('Game title cannot be empty');
    }
    if (title.length > 200) {
      throw new ValidationError('Game title too long (max 200 chars)');
    }
    this.value = title.trim();
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: GameTitle): boolean {
    return this.value === other.value;
  }
}
```

### Data Formats
- ✅ **IDs**: UUIDv4 for all entities (`crypto.randomUUID()`)
- ✅ **Dates**: ISO 8601 with timezone (`.toISOString()`)
- ✅ **Booleans**: `true`/`false` (standard)

---

## IndexedDB Patterns

### Schema
```typescript
// Single database with separate stores (Option A from architecture decisions)
const db = await openDB('GameCollectionDB', 1, {
  upgrade(db) {
    // Collection context
    db.createObjectStore('games', { keyPath: 'id' });
    db.createObjectStore('game_metadata', { keyPath: 'gameId' });

    // Wishlist context
    db.createObjectStore('wishlist', { keyPath: 'id' });

    // Maintenance context
    db.createObjectStore('consoles', { keyPath: 'id' });
    db.createObjectStore('maintenance', { keyPath: 'id' });
  }
});
```

### Migrations
- ✅ **Manual migrations with code** (Option A)
- ✅ Document in `DECISIONS.md` and `MIGRATIONS.md`
- ✅ Upgrade function per version
- ❌ NO automatic migration libraries

---

## Testing Patterns

### Test Organization
```
tests/
├── unit/                   # Domain, use cases
│   ├── collection/
│   │   ├── domain/         # Entities, Value Objects
│   │   └── application/    # Use Cases
│   ├── wishlist/
│   └── maintenance/
├── integration/            # Repositories, adapters
│   ├── collection/
│   │   ├── IndexedDBGameRepository.test.ts
│   │   └── IGDBAdapter.test.ts
│   └── shared/
├── e2e/                    # End-to-end (Playwright)
│   ├── collection/
│   │   ├── add-game.spec.ts
│   │   └── search-games.spec.ts
│   └── fixtures/
└── visual/                 # Visual regression (future)
```

### Testing Rules
- ✅ Unit tests for domain logic (entities, value objects, use cases)
- ✅ Integration tests for infrastructure (repositories, adapters)
- ✅ E2E tests for critical user journeys
- ✅ Mock external dependencies (IndexedDB, IGDB API) in unit tests
- ✅ Use real implementations in integration tests

---

## UI/UX Patterns

### Component Strategy
- ✅ **17 shelter-ui components** (base design system)
- ✅ **12 custom components** extending shelter-ui
- ✅ Mobile-first responsive (320px-1440px)
- ✅ WCAG 2.1 AA compliance

### Custom Components
1. **Widget Card** (game/wishlist cards with elevated design)
2. **Platform Badge** (platform identity with brand colors)
3. **Game List Item** (collection list row)
4. **Console Card Tabs** (maintenance tabs)
5. **Status Indicator** (owned/physical/digital)
6. **Toast** (custom notifications)
7. **Timeline** (maintenance history)
8. **Photo Upload** (console photos)
9. **Cover Thumbnail** (game covers)
10. **Search Bar** (with filters)
11. **Textarea Field** (custom textarea)
12. **Select Field** (custom select)

### Responsive Breakpoints
```scss
// shelter-ui breakpoints
$mobile: 320px;
$tablet: 768px;
$desktop: 1024px;
$wide: 1440px;
```

### Accessibility
- ✅ Semantic HTML first
- ✅ ARIA attributes when semantic HTML insufficient
- ✅ Keyboard navigation for all interactions
- ✅ Screen reader support
- ✅ Focus management
- ✅ Color contrast WCAG AA (4.5:1 text, 3:1 UI components)

### Platform Colors
```scss
$ps5-blue: #006FCD;
$xbox-green: #107C10;
$nintendo-red: #E60012;
$pc-gray: #888888;
```

---

## Anti-Patterns (FORBIDDEN)

### ❌ Function Declarations
```typescript
// ❌ WRONG
function addGame() { }

// ✅ CORRECT
export const addGame = () => { };
```

### ❌ Default Exports
```typescript
// ❌ WRONG
export default GameCard;

// ✅ CORRECT
export const GameCard = () => { };
```

### ❌ Index Files
```typescript
// ❌ WRONG - NO index.ts files
// src/collection/domain/index.ts
export * from './Game';
export * from './GameId';

// ✅ CORRECT - Import directly
import { Game } from '@Collection/domain/entities/Game';
```

### ❌ Relative Imports Across Contexts
```typescript
// ❌ WRONG
import { EventBus } from '../../../shared/infrastructure/events/EventBus';

// ✅ CORRECT
import { EventBus } from '@Shared/infrastructure/events/EventBus';
```

### ❌ Decorators in Domain Layer
```typescript
// ❌ WRONG
import { injectable } from 'inversify';

@injectable()
export class Game { }

// ✅ CORRECT - Manual DI registration in infrastructure
// No decorators in domain, keep it pure
export class Game {
  // Pure domain logic
}
```

### ❌ Wrong Abstract Class Naming
```typescript
// ❌ WRONG
export abstract class RepositoryAbstract { }

// ✅ CORRECT
export abstract class AbstractRepository { }
```

### ❌ DTOs in Domain Layer
```typescript
// ❌ WRONG - Domain depends on application DTOs
import { GameDTO } from '@Collection/application/dtos/GameDTO';

export class Game {
  constructor(dto: GameDTO) { } // ❌ Domain knows about DTOs
}

// ✅ CORRECT - Domain is pure, DTOs in application layer
export class Game {
  constructor(
    private id: GameId,
    private title: GameTitle,
    private platform: Platform
  ) { }
}
```

---

## Starter Template

**Initialization command:**
```bash
npm create @pplancq/react-app@latest lab-clean-architecture-react
```

**Post-init setup:**
1. Configure path aliases in tsconfig.json
2. Setup DI containers per context
3. Create IndexedDB schema
4. Configure PWA (Rsbuild PWA Plugin)
5. Setup Event Bus in shared kernel

---

## Development Workflow

### Shipping Discipline
- ✅ Ship 1 feature per week (no exceptions)
- ✅ Max 1 day architecture per feature (time-boxing)
- ✅ "Good enough" code > perfect code
- ✅ Max 5h/week development (sustainable pace)
- ✅ Weekends OFF (unless naturally motivated)

### Documentation
- ✅ Update `DECISIONS.md` within 24h of every decision
- ✅ Weekly reflection in `LEARNINGS.md` (15min every Friday)
- ✅ Document mistakes in `REGRETS.md` without shame

### Kill Switches
- ⚠️ If architecture blocks shipping >2 weeks → Simplify
- ⚠️ If PWA takes >2 weeks → Pivot to LocalStorage
- ⚠️ If APIs unavailable → Pivot to manual-first

---

## Critical Reminders

1. **Domain Purity**: The domain layer must have ZERO external dependencies. No InversifyJS, no React, no libraries. Only pure TypeScript.

2. **Manual DI Registration**: DI containers are in the infrastructure layer. Domain entities never use decorators.

3. **Event Bus for Cross-Context**: Contexts communicate via events, never direct use case calls.

4. **Result Pattern**: All use cases return `Result<T, E>` for type-safe error handling. No exceptions in signatures.

5. **Arrow Functions Only**: No function declarations anywhere in the codebase.

6. **No Default Exports**: Always use named exports.

7. **No Index Files**: Import directly from specific files using path aliases.

8. **Abstract Prefix**: Abstract classes are prefixed (e.g., `AbstractRepository`), not suffixed.

9. **Educational Transparency**: This is a learning lab. Every decision must be documented with rationale.

10. **Ship Weekly**: Architecture is proven by shipping. If not shipping weekly, simplify.

---

**Last Updated**: 2026-01-26
**Source**: architecture.md (complete through 8 steps)
