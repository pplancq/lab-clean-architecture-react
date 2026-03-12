# ADR-013: In-Memory Repository for Transient Data

- **Status:** Accepted
- **Date:** 2026-03-11
- **Epic:** Toast bounded context (issue #118)

## Context

The toast bounded context manages short-lived notifications that should disappear automatically. Unlike games, toasts are:

- **Transient**: they don't need to survive a page reload.
- **Process-local**: only the current session cares about them.
- **High-frequency mutated**: add/remove happen often, with React re-render as a direct consequence.

The standard `RepositoryInterface` used by the collection context targets IndexedDB (async, can fail, returns `Result<T, RepositoryErrorInterface>`). Forcing that contract on a purely in-memory store would introduce unnecessary async overhead and artificial error paths.

## Decision

Introduce a **dedicated synchronous repository interface** for the toast context:

```typescript
// src/toast/domain/repositories/ToastRepositoryInterface.d.ts
export interface ToastRepositoryInterface {
  add(toast: Toast): Result<void, never>;
  remove(id: string): Result<void, never>;
  findById(id: string): Result<Toast | undefined, never>;
  getAll(): Result<Toast[], never>;
}
```

Key choices:

1. **`Result<T, never>`** on all methods — the in-memory implementation cannot fail, and `never` makes that explicit at the type level.
2. **Synchronous** — no `Promise`, consistent with `useSyncExternalStore`'s synchronous snapshot contract.
3. **Referential stability** on `getAll()`: `ImmutableInMemoryToastRepository` only creates a new array when a mutation (`add`/`remove`) actually occurs. Consecutive `getAll()` calls without mutation return the **same array reference**, letting React bail out of re-renders cheaply.

```typescript
// ImmutableInMemoryToastRepository
add(toast) {
  this.toasts = [...this.toasts, toast]; // new ref on mutation
  return Result.ok(undefined);
}

getAll() {
  return Result.ok(this.toasts); // same ref if no mutation
}
```

## Consequences

**Easier:**

- Repository tests are trivial — no async, no mocks, purely synchronous assertions.
- `getAllToasts()` on the store is a direct `.unwrap()` call, safe without a type guard because `E = never`.
- `useSyncExternalStore` snapshot is stable — React skips re-renders when nothing changed.

**Harder / Trade-offs:**

- Two repository interface styles coexist in the codebase (async `RepositoryInterface` and sync `ToastRepositoryInterface`). This is intentional: the async one models persistent storage, the sync one models transient state.
- Any future persistent toast feature (e.g. notification history) would require migrating to an async interface.

## References

- [GetToasts Use Case](../../use-cases/get-toasts.md)
- [ADR-011: Map-Centric Store with Auto-Triggered Fetches](./ADR-011-map-centric-store-auto-trigger.md)
- [Result Pattern](../../result-pattern.md)
