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
