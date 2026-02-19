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

## TypeScript Path Aliases

### Overview

Path aliases provide clean, unambiguous imports that respect architectural boundaries. They replace lengthy relative paths with semantic shortcuts.

### Configured Aliases

Each bounded context and major layer has a dedicated alias:

```typescript
// tsconfig.json
"paths": {
  "@App/*":        ["src/app/*"],
  "@Shared/*":     ["src/shared/*"],
  "@Collection/*": ["src/collection/*"],
  "@Mocks/*":      ["mocks/*"]
}
```

### Why Use Aliases?

1. **Clarity** - Import source is immediately obvious:

   ```typescript
   // ✅ Clear: This comes from Collection context
   import { Game } from '@Collection/domain/Game';

   // ❌ Confusing: Where does this come from?
   import { Game } from '../../../collection/domain/Game';
   ```

2. **Architectural Boundaries** - Prevents accidental cross-context dependencies

   ```typescript
   // ✅ Intended: Import from another context
   import { Game } from '@Collection/domain/Game';

   // ❌ Prevented: Relative path bypasses the alias intent
   import { Game } from '../collection/domain/Game';
   ```

3. **Refactoring Safety** - Moving folders doesn't break imports:

   ```typescript
   // If collection/ moves to src/contexts/collection/
   // Only update: "@Collection/*": ["src/contexts/collection/*"]
   // All imports still work!
   ```

4. **IDE Support** - Auto-completion and "Go to Definition" work seamlessly

### Usage Rules

- ✅ **Always use aliases** for same-level or cross-context imports
- ✅ Use relative imports only **within the same folder**:

  ```typescript
  // OK: Same folder
  import { helper } from './helper';
  import { child } from './child/component';

  // Use alias: Different layer or context
  import { Game } from '@Collection/domain/Game';
  ```

- ✅ Prefer **specific aliases** over `@Front/`:

  ```typescript
  // ✅ Good: Clear context
  import { Game } from '@Collection/domain/Game';

  // ❌ Avoid: Ambiguous, deprecated
  import { Game } from '@Front/collection/domain/Game';
  ```

### Adding New Bounded Contexts

⚠️ **CRITICAL: Do NOT forget this step!**

When creating a new bounded context (e.g., `src/wishlist/`):

1. **Update `tsconfig.json`:**

   ```json
   "paths": {
     "@App/*":        ["src/app/*"],
     "@Shared/*":     ["src/shared/*"],
     "@Collection/*": ["src/collection/*"],
     "@Wishlist/*":   ["src/wishlist/*"],      // ← ADD THIS
     "@Mocks/*":      ["mocks/*"]
   }
   ```

2. **Verify Rsbuild Support:**
   - Rsbuild natively reads `tsconfig.json`
   - No separate rsbuild configuration needed
   - Run `npm run build` to verify it works

3. **Update Documentation:**
   - Add new context to this list
   - Update the "Future Bounded Contexts" section

### Verification

After updating tsconfig.json, verify aliases work:

```bash
# Build should succeed with new aliases
npm run build

# TypeScript should recognize new paths
npm run test:unit
```

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

### Phase 1: Structuring

✅ Directories created with `.gitkeep`

### Phase 2: Collection Context

✅ Domain entities (`Game`, Value Objects)
✅ Use Cases (`AddGameUseCase`)
✅ IndexedDB Repositories (`IndexedDBGameRepository`)
✅ UI Components (`GameForm`, `TextAreaField`, `SelectField`, `formField` wrappers)
✅ Page & Route (`/add-game`)

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
