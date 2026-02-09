# ADR-007: No TypeScript Decorators for Dependency Injection

**Status:** ✅ Accepted  
**Date:** 2026-02-09  
**Deciders:** Paul (Lead Developer)  
**Related Epic:** Epic 1 - Foundation, Clean Architecture & PWA Setup  
**Related Story:** Story 1.3 - Configure Dependency Injection with InversifyJS  
**Supersedes:** ADR-005 (extends with detailed rationale)

---

## Context

The project uses InversifyJS for dependency injection to maintain loose coupling between layers in Clean Architecture. InversifyJS supports two binding approaches:

1. **Decorator-based binding** (e.g., `@injectable()`, `@inject()`)
2. **Manual binding** (explicit registration in container configuration)

We needed to choose which approach to adopt as the standard for the entire project.

---

## Decision

**We will NOT use TypeScript decorators for dependency injection.**

All dependency injection bindings will be done via **manual registration** in service collection modules (e.g., `serviceCollection.ts` per bounded context).

---

## Rationale

### 1. TypeScript Decorators Are Not Yet Stable

- Decorators are still in **Stage 3** of the TC39 proposal process (not yet official ECMAScript standard)
- The current TypeScript implementation may change when the final spec is approved
- Using experimental features introduces long-term maintenance risk and potential breaking changes

**Risk:** Future TypeScript versions could require significant refactoring if decorator syntax or behavior changes.

---

### 2. Violates Clean Architecture Principles

In Clean Architecture, the **domain layer must be technology-agnostic** and free from framework/library dependencies.

**Problem with decorators:**

- Adding `@injectable()` to a domain entity or use case **couples the domain to InversifyJS**
- Domain classes should not know about DI containers or injection mechanisms
- Violates the Dependency Inversion Principle (domain depends on infrastructure concern)

**Example - BAD (with decorators):**

```typescript
// src/collection/domain/entities/Game.ts
import { injectable } from 'inversify'; // ❌ Domain depends on DI library

@injectable() // ❌ Domain class coupled to InversifyJS
export class Game {
  // domain logic
}
```

**Example - GOOD (manual binding):**

```typescript
// src/collection/domain/entities/Game.ts
// ✅ Pure domain class - no infrastructure dependencies
export class Game {
  // domain logic
}

// src/collection/serviceCollection.ts
import { Game } from './domain/entities/Game';

// ✅ Infrastructure configures DI, not domain
container.bind(Game).toSelf();
```

With manual binding, the domain remains pure and the DI configuration lives in the infrastructure layer where it belongs.

---

### 3. JavaScript Decorators Execute at Import (Side Effects)

**Key difference between JavaScript/TypeScript and other languages:**

- **PHP decorators (attributes):** Pure metadata, no code execution
- **JavaScript/TypeScript decorators:** **Execute code at class import time** (side effects)

**Problem:**

- Importing a class with decorators triggers decorator functions immediately
- This can cause unexpected initialization, circular dependencies, and hard-to-debug issues
- Violates the principle of explicit initialization

**Example:**

```typescript
// Decorator executes when this file is imported (not when instantiated)
@injectable()
export class MyService {
  constructor() {
    console.log('MyService created');
  }
}

// Just importing this file runs the @injectable() decorator function
import { MyService } from './MyService';
```

With manual binding, initialization is explicit and controlled:

```typescript
// No side effects on import
export class MyService {
  constructor() {
    console.log('MyService created');
  }
}

// Explicit registration - you control when and how
container.bind(MyService).toSelf(); // Clear, explicit, testable
```

---

## Consequences

### Positive

✅ **Domain purity maintained:** Domain layer has zero infrastructure dependencies  
✅ **Testability improved:** No hidden decorator side effects, easier to mock and test  
✅ **Explicit configuration:** DI bindings are visible and centralized in `serviceCollection.ts`  
✅ **Future-proof:** No risk from potential decorator spec changes  
✅ **Better IntelliSense:** TypeScript can infer types without decorator metadata  
✅ **Easier debugging:** No magic - all bindings are explicit and traceable

### Negative

⚠️ **More verbose:** Manual binding requires more boilerplate code  
⚠️ **Risk of forgetting bindings:** Developers must remember to register new classes  
⚠️ **No compile-time errors:** Missing bindings only fail at runtime

### Mitigation

- **Standardized pattern:** Use consistent `serviceCollection.ts` pattern per context
- **Documentation:** Clear examples and guidelines for manual binding
- **Code reviews:** Verify bindings are added for new services
- **Testing:** Integration tests catch missing bindings early

---

## Implementation Pattern

### Standard Service Collection Structure

Each bounded context has a `serviceCollection.ts` module:

```typescript
// src/collection/serviceCollection.ts
import { Container } from 'inversify';

// Import domain, application, infrastructure
import { Game } from './domain/entities/Game';
import { AddGameUseCase } from './application/use-cases/AddGameUseCase';
import { IGameRepository } from './application/ports/IGameRepository';
import { IndexedDBGameRepository } from './infrastructure/repositories/IndexedDBGameRepository';

export const registerCollectionServices = (container: Container): void => {
  // Domain entities (if needed)
  container.bind(Game).toSelf();

  // Use cases
  container.bind(AddGameUseCase).toSelf();

  // Repositories (interface to implementation)
  container.bind<IGameRepository>('IGameRepository').to(IndexedDBGameRepository);
};
```

### Composition Root

The main service container aggregates all context service collections:

```typescript
// src/app/config/serviceContainer.ts
import { Container } from 'inversify';
import { registerCollectionServices } from '@Front/collection/serviceCollection';
import { registerWishlistServices } from '@Front/wishlist/serviceCollection';

export const createServiceContainer = (): Container => {
  const container = new Container();

  // Register all bounded context services
  registerCollectionServices(container);
  registerWishlistServices(container);

  return container;
};
```

### Usage in React Components

Use the `useService` hook for type-safe dependency retrieval:

```typescript
// src/collection/ui/pages/AddGame/AddGame.tsx
import { useService } from '@Front/shared/ui/hooks/useService';
import { AddGameUseCase } from '@Front/collection/application/use-cases/AddGameUseCase';

export const AddGame = () => {
  const addGameUseCase = useService(AddGameUseCase);

  const handleSubmit = async (data: GameData) => {
    const result = await addGameUseCase.execute(data);
    // handle result
  };

  return <form onSubmit={handleSubmit}>...</form>;
};
```

---

## Related Decisions

- ADR-005: InversifyJS for Dependency Injection (original decision)
- ADR-008: Result Pattern Usage Convention
- [ADR-002](./ADR-002-clean-architecture-ddd.md): Clean Architecture + DDD Bounded Contexts

---

## References

- [InversifyJS Manual Binding Documentation](https://github.com/inversify/InversifyJS/blob/master/wiki/container_api.md)
- [TC39 Decorators Proposal](https://github.com/tc39/proposal-decorators)
- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- Epic 1 Retrospective: `_bmad-output/implementation-artifacts/epic-1-retro-2026-02-09.md`

---

## Revision History

| Date       | Version | Author | Changes                                             |
| ---------- | ------- | ------ | --------------------------------------------------- |
| 2026-02-09 | 1.0     | Paul   | Initial ADR creation following Epic 1 retrospective |
