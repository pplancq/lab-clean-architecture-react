# Folder Structure

## Overview

The folder structure reflects our hybrid architecture: **Clean Architecture + DDD Bounded Contexts**.

```
src/
├── app/                           # Application Bootstrap Layer
│   ├── assets/                    # Global CSS, images
│   ├── config/                    # App-wide configuration
│   ├── providers/                 # Global React providers
│   └── routing/                   # Routing configuration
│
├── shared/                        # Shared Kernel (cross-context)
│   ├── domain/                    # Shared business primitives
│   ├── application/               # Shared application logic
│   ├── infrastructure/            # Shared infrastructure
│   │   └── fetchApi/              # Shared HTTP client
│   └── ui/                        # Shared UI components
│
└── collection/                    # Collection Bounded Context
    ├── domain/                    # Entities and business rules
    ├── application/               # Use cases and DTOs
    ├── infrastructure/            # Adapters (IndexedDB, API)
    └── ui/                        # React components
        └── pages/                 # Context-specific pages
```

## Layer-by-Layer Explanation

### 📦 `src/app/` - Application Foundation

**Role:** Application entry point, global configuration, orchestration.

**Typical Contents:**

- React Providers (QueryClient, Theme, Router)
- App-wide routing configuration
- Global assets (CSS reset, fonts)
- Application bootstrap

**Rules:**

- ✅ Can import from `shared/` and all contexts
- ✅ High-level orchestration only
- ❌ No business logic here

---

### 🌐 `src/shared/` - Shared Kernel

**Role:** Code shared between multiple bounded contexts.

#### `shared/domain/` - Shared Domain Primitives

**Examples:**

- Generic Value Objects (Email, Money, DateRange)
- Business primitive types (GameId, ConsoleId)
- Shared repository interfaces

**Rules:**

- ✅ ZERO external dependencies (pure TypeScript)
- ❌ No React, no libraries

#### `shared/application/` - Shared Application Logic

**Examples:**

- Cross-context use cases
- Shared DTOs
- Shared service interfaces

#### `shared/infrastructure/` - Shared Infrastructure

**Examples:**

- `fetchApi/` - Generic HTTP client
- IndexedDB helpers
- Logging utilities

**Rules:**

- ✅ Implements interfaces from `shared/domain`
- ✅ Can use external libraries

#### `shared/ui/` - Shared UI Components

**Examples:**

- Design system components
- Reusable layouts
- Generic UI hooks

---

### 🎮 `src/collection/` - Collection Bounded Context

**Role:** Everything related to game collection management.

#### `collection/domain/` - Collection Business Logic

**Expected content (future):**

- Entities: `Game.ts`, `Console.ts`, `CollectionItem.ts`
- Value Objects: `GameTitle.ts`, `ReleaseDate.ts`
- Interfaces: `IGameRepository.ts`, `ICollectionService.ts`

**STRICT Rules:**

- ❌ ZERO external dependencies
- ❌ No React, no axios, no InversifyJS
- ✅ Only pure TypeScript and business logic

#### `collection/application/` - Collection Use Cases

**Expected content:**

- Use Cases: `AddGameToCollection.ts`, `RemoveGame.ts`
- DTOs: `GameDTO.ts`, `CollectionItemDTO.ts`
- External service interfaces

**Rules:**

- ✅ Depends on `collection/domain/`
- ✅ Defines interfaces for `infrastructure/`
- ❌ Does NOT depend on `infrastructure/` or `ui/`

#### `collection/infrastructure/` - Collection Adapters

**Expected content:**

- Repositories: `GameRepositoryIndexedDB.ts`
- API Adapters: `IGDBApiAdapter.ts`
- Dependency Injection: `collection.container.ts`

**Rules:**

- ✅ Implements interfaces from `domain/` and `application/`
- ✅ Can use external libraries (axios, idb, InversifyJS)

#### `collection/ui/` - Collection React Components

**Expected content:**

- Pages: `pages/GameList.tsx`, `pages/GameDetail.tsx`
- Components: `GameCard.tsx`, `ConsoleFilter.tsx`
- Hooks: `useGameCollection.ts`

**Rules:**

- ✅ Uses Use Cases from `application/`
- ✅ Can use `shared/ui/` for generic components
- ❌ Must NOT contain business logic

---

## Future Bounded Contexts

### `src/wishlist/` - Wishlist Context

Identical structure to `collection/`:

```
wishlist/
├── domain/
├── application/
├── infrastructure/
└── ui/
```

### `src/maintenance/` - Maintenance Context

Identical structure:

```
maintenance/
├── domain/
├── application/
├── infrastructure/
└── ui/
```

---

## `.gitkeep` Files

**Why .gitkeep?**

- Git doesn't track empty directories
- `.gitkeep` allows versioning structure before implementation
- Current phase = **structuring**, not implementation

**When to remove?**

- When the first real file is added to the directory
- `.gitkeep` files are temporary placeholders

---

## Naming Conventions

### Files

- **Entities/Value Objects:** PascalCase (`Game.ts`, `GameTitle.ts`)
- **Use Cases:** PascalCase verb (`AddGameToCollection.ts`)
- **Repositories:** PascalCase + suffix (`GameRepositoryIndexedDB.ts`)
- **React Components:** PascalCase (`GameCard.tsx`)
- **Hooks:** camelCase + `use` prefix (`useGameCollection.ts`)

### Folders

- **Lowercase** with hyphens if needed (`fetchApi`, `game-list`)
- No plurals except `pages`, `assets`, `utils`

---

## Structure Evolution

### Phase 1: Structuring (Current)

✅ Directories created with `.gitkeep`

### Phase 2: Collection Context (Next)

- Implement Domain entities
- Implement Use Cases
- Implement IndexedDB Repositories

### Phase 3: Wishlist Context

- Duplicate `collection/` structure
- Implement Wishlist logic

### Phase 4: Maintenance Context

- Duplicate structure
- Implement Maintenance logic

---

## Structure Validation

To verify the structure follows the rules:

```bash
# Check directory presence
find src -type d -name "domain" -o -name "application" -o -name "infrastructure" -o -name "ui"

# Check no forbidden dependencies exist (future)
# Use dependency linter or ESLint import rules
```

---

## References

- [Dependency Rules](./dependency-rules.md) - Understand constraints
- [Domain Layer](../layers/domain-layer.md) - Purity rules
- `project-context.md` - Complete technical context
