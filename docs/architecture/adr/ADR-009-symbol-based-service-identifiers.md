# ADR-009: Symbol-based Service Identifiers for Dependency Injection

**Status:** ✅ Accepted  
**Date:** 2026-02-23  
**Deciders:** Paul (Lead Developer)  
**Related Epic:** Epic 2 - Game Collection Infrastructure  
**Related Story:** Story 2.2 - IndexedDB Persistence Layer  
**Extends:** ADR-005 (adds service identifier convention)

---

## Context

ADR-005 establishes the use of InversifyJS with manual registration (no decorators). However, it does not specify **how services should be identified** within the container.

InversifyJS supports three types of service identifiers:

| Approach                        | Example                                              | Issues                                                    |
| ------------------------------- | ---------------------------------------------------- | --------------------------------------------------------- |
| Direct class reference          | `container.bind(GameRepository)`                     | Exposes concrete implementation; risk of circular imports |
| String literals                 | `container.bind('GameRepository')`                   | Collision risk across bounded contexts; no type safety    |
| **Symbol-based identifiers** ✅ | `container.bind(COLLECTION_SERVICES.GameRepository)` | Globally unique; namespaced; type-safe                    |

Without a clear convention, different bounded contexts might adopt inconsistent identifier strategies, leading to naming collisions or unclear dependency ownership.

---

## Decision

Use **`Symbol.for()`-based identifiers** grouped in frozen constant objects, with one dedicated file per bounded context.

### Convention

Each bounded context defines its service identifiers in a `serviceIdentifiers.ts` file at the context root:

```typescript
// src/{context}/serviceIdentifiers.ts
export const {CONTEXT}_SERVICES = Object.freeze({
  ServiceName: Symbol.for('{Context}.{ServiceName}'),
} as const);
```

### Naming Rules

- **Object name:** `{CONTEXT}_SERVICES` (e.g., `COLLECTION_SERVICES`, `SHARED_SERVICES`)
- **Symbol key:** `Symbol.for('{Context}.{ServiceName}')` (e.g., `Symbol.for('Collection.GameRepository')`)
- **Context prefix:** PascalCase, matching the bounded context name
- **Service name:** PascalCase, matching the interface name without the `Interface` suffix

### Reference Implementation

```typescript
// src/collection/serviceIdentifiers.ts
/**
 * Service identifiers for collection bounded context.
 * Defines Symbol-based identifiers for dependency injection.
 * Uses Object.freeze to ensure immutability during runtime.
 */
export const COLLECTION_SERVICES = Object.freeze({
  /** IndexedDB database interface for game collection storage */
  IndexedDB: Symbol.for('Collection.IndexedDB'),

  /** Repository interface for Game entity persistence */
  GameRepository: Symbol.for('Collection.GameRepository'),

  /** Use case for adding a game to the collection */
  AddGameUseCase: Symbol.for('Collection.AddGameUseCase'),
} as const);
```

```typescript
// src/collection/serviceCollection.ts — registration
import { COLLECTION_SERVICES } from './serviceIdentifiers';

export const serviceCollection: ContainerModule = new ContainerModule(options => {
  options
    .bind<IndexedDBInterface>(COLLECTION_SERVICES.IndexedDB)
    .toDynamicValue(() => new IndexedDB('GameCollectionDB', 1, 'games'))
    .inSingletonScope();

  options
    .bind<GameRepositoryInterface>(COLLECTION_SERVICES.GameRepository)
    .toDynamicValue(
      services => new IndexedDBGameRepository(services.get<IndexedDBInterface>(COLLECTION_SERVICES.IndexedDB)),
    )
    .inSingletonScope();
});
```

```typescript
// src/collection/ui/hooks/useAddGame.ts — consumer
import { COLLECTION_SERVICES } from '@Collection/serviceIdentifiers';
import type { AddGameUseCaseInterface } from '@Collection/application/use-cases/AddGameUseCaseInterface';

const addGameUseCase = useService<AddGameUseCaseInterface>(COLLECTION_SERVICES.AddGameUseCase);
```

---

## Why `Symbol.for()` over `Symbol()`

`Symbol.for(key)` looks up the **global Symbol registry** — two calls with the same key always return the same Symbol instance. This is critical for DI containers where the binding and the resolution happen in different module scopes:

```typescript
// ✅ Symbol.for() — consistent across modules
const id1 = Symbol.for('Collection.GameRepository');
const id2 = Symbol.for('Collection.GameRepository');
console.log(id1 === id2); // true — same Symbol, container.get() works

// ❌ Symbol() — each call creates a unique Symbol
const id1 = Symbol('Collection.GameRepository');
const id2 = Symbol('Collection.GameRepository');
console.log(id1 === id2); // false — different Symbols, container.get() would fail
```

## Why `Object.freeze`

Prevents accidental mutation of service identifiers at runtime. Service identifiers are immutable constants — freezing enforces this at the JavaScript engine level and signals intent to future developers.

---

## Anti-patterns to Avoid

```typescript
// ❌ BAD: Direct class reference (couples consumer to concrete implementation)
container.bind(IndexedDBGameRepository).toSelf();
container.get(IndexedDBGameRepository);

// ❌ BAD: String literal (collision risk, no type safety)
container.bind('GameRepository').to(IndexedDBGameRepository);
container.get<GameRepositoryInterface>('GameRepository');

// ❌ BAD: Symbol without namespace (collision risk across bounded contexts)
const GameRepository = Symbol.for('GameRepository');

// ✅ GOOD: Namespaced Symbol with interface binding
options
  .bind<GameRepositoryInterface>(COLLECTION_SERVICES.GameRepository)
  .toDynamicValue(services => new IndexedDBGameRepository(...));
```

---

## Consequences

### Positive

✅ **No circular imports:** Consumers import the Symbol identifier, not the concrete class  
✅ **Interface-based binding:** `bind<ServiceInterface>(SERVICES.Symbol)` keeps implementations hidden from consumers  
✅ **Cross-context isolation:** Namespacing prevents identifier collisions between bounded contexts  
✅ **Type-safe:** TypeScript enforces the bound interface type at `container.get()`  
✅ **Global registry safety:** `Symbol.for()` ensures consistency across module boundaries  
✅ **Discoverable:** All service identifiers for a context are centralized in one file

### Negative

⚠️ **Extra file per context:** Each bounded context requires a `serviceIdentifiers.ts` file  
⚠️ **String coupling:** The string passed to `Symbol.for()` must remain consistent if services are renamed

### Mitigation

- Naming convention enforced through this ADR and code reviews
- One file per context keeps overhead minimal and identifiers easy to find
- Service renames trigger a single-file update in `serviceIdentifiers.ts`

---

## Related Decisions

- [ADR-005](./ADR-005-inversifyjs-dependency-injection.md): InversifyJS for Dependency Injection (original DI decision)
- [ADR-002](./ADR-002-clean-architecture-ddd.md): Clean Architecture + DDD Bounded Contexts
- [ADR-007](./ADR-007-no-typescript-decorators.md): No TypeScript Decorators

---

## References

- [InversifyJS: Service Identifiers](https://inversify.io/docs/service-identifiers/)
- [MDN: Symbol.for()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)
- Collection identifiers: `src/collection/serviceIdentifiers.ts`
- Shared identifiers: `src/shared/serviceIdentifiers.ts`
- DI container: `src/app/config/serviceContainer.ts`
- Epic 2 Retrospective: `_bmad-output/implementation-artifacts/epic-2-retro-2026-02-23.md`

---

## Revision History

| Date       | Version | Author | Changes                                             |
| ---------- | ------- | ------ | --------------------------------------------------- |
| 2026-02-23 | 1.0     | Paul   | Initial ADR creation following Epic 2 retrospective |
