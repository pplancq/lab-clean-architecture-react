# ADR-014: Infrastructure ID Generator

- **Status:** Accepted
- **Date:** 2026-03-11
- **Epic:** Toast bounded context (issue #118)

## Context

When adding a toast, a unique ID must be generated. The first draft placed `globalThis.crypto.randomUUID()` directly inside `AddToastUseCase`. This is problematic:

- **Testability**: tests cannot control the generated ID without patching global objects.
- **Domain purity**: using a browser/Node API (`globalThis.crypto`) in application layer couples it to a specific runtime.
- **Flexibility**: switching to a `uuid` library or a deterministic sequence requires modifying the use case.

## Decision

Extract ID generation behind a **domain interface**:

```typescript
// src/shared/domain/utils/IdGeneratorInterface.d.ts
export interface IdGeneratorInterface {
  generate(): string;
}
```

Provide a default implementation in `shared/infrastructure/`:

```typescript
// src/shared/infrastructure/utils/CryptoIdGenerator.ts
export class CryptoIdGenerator implements IdGeneratorInterface {
  generate(): string {
    return globalThis.crypto.randomUUID();
  }
}
```

Inject it into use cases that need IDs:

```typescript
export class AddToastUseCase {
  constructor(
    private readonly repository: ToastRepositoryInterface,
    private readonly idGenerator: IdGeneratorInterface,
  ) {}

  execute(dto: AddToastDTO) {
    const toast = Toast.create({ id: this.idGenerator.generate(), ... });
    // ...
  }
}
```

The interface lives in `shared/domain/utils/` (not `shared/domain/repositories/`) because ID generation is a utility concern, not a persistence concern.

## Consequences

**Easier:**

- Tests inject a `FakeIdGenerator` with predictable output — no global mocking needed.
- Any generation strategy (UUID v4, ULID, nanoid, auto-increment in tests) can be swapped by binding a different implementation in the DI container.
- Use cases remain free of platform-specific imports.

**Harder / Trade-offs:**

- One extra DI binding (`SHARED_SERVICES.IdGenerator`) must be registered before any use case that generates IDs.
- Minor indirection for a simple operation; worth it for testability.

## References

- [AddToast Use Case](../../use-cases/add-toast.md)
- [Dependency Injection](../dependency-injection.md)
- [ADR-005: InversifyJS for Dependency Injection](./ADR-005-inversifyjs-dependency-injection.md)
