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
