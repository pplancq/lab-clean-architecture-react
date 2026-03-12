# ADR-017: Application Layer Owns Operation Notification Responsibility

## Status

✅ Accepted

## Date

2026-03-12

## Context

After establishing the Ports & Adapters notification system (ADR-016), a question arises about **where** `NotificationServiceInterface` should be called for user-facing feedback on CRUD operations (add game, edit game, delete game).

Two options were considered:

**Option A — UI components call `notificationService` after receiving the `Result`:**

```typescript
// In a page component
const result = await store.addGame(dto);
if (result.isOk()) {
  notificationService.success('Game added successfully');
  onSuccess();
} else {
  notificationService.error('Failed to add game');
}
```

**Option B — `GamesStore` calls `notificationService` internally, transparent to UI:**

```typescript
// In GamesStore.addGame()
const result = await this.addGameUseCase.execute(dto);
if (result.isOk()) {
  this.notificationService.success(GamesStore.ADD_SUCCESS_MESSAGE);
} else {
  this.notificationService.error(/* mapped message */);
}
return result; // still returned for navigation/form-reset side-effects
```

The inline `<Alert>` approach (displaying success/error banners inside the form or page) was already in use and was explicitly migrated away from by Story 8.3.

## Decision

**Option B — `GamesStore` (application layer) owns notification responsibility.**

`GamesStore` is injected with `NotificationServiceInterface` as a constructor dependency and calls `success`/`error` on it after every CRUD operation. The `Result` is still returned to callers, but exclusively for navigation and form-reset side-effects.

```typescript
// src/collection/application/stores/GamesStore.ts
export class GamesStore implements GamesStoreInterface {
  private static readonly ADD_SUCCESS_MESSAGE = 'Game added successfully';
  private static readonly ADD_ERROR_MESSAGES: Record<string, string> = { ... };

  constructor(
    // ... use case params ...
    private readonly notificationService: NotificationServiceInterface,
  ) {}

  async addGame(dto: AddGameDTO): Promise<Result<void, ...>> {
    const result = await this.addGameUseCase.execute(dto);
    if (result.isOk()) {
      this.notificationService.success(GamesStore.ADD_SUCCESS_MESSAGE);
    } else {
      this.notificationService.error(
        GamesStore.ADD_ERROR_MESSAGES[result.getError().type] ?? GamesStore.DEFAULT_OPERATION_ERROR_MESSAGE,
      );
    }
    return result;
  }
}
```

All user-visible message strings are defined as `private static readonly` constants on `GamesStore` — a single, authoritative location for operation feedback copy.

## Consequences

### What becomes easier

- **Simplicity in components:** UI components never need to import or resolve `NotificationServiceInterface`. They only handle navigation and form-reset based on the returned `Result`.
- **Consistency:** Notifications are guaranteed for every operation, regardless of the caller. A future use of `addGame` (e.g., a bulk import feature) automatically gets the same feedback without any additional wiring.
- **Single source of truth for message copy:** All operation messages live in `GamesStore` — no duplication across pages.
- **Easier testing:** Component tests no longer need to assert on notification UI. `GamesStore` unit tests cover notification behavior in isolation via a `NotificationServiceInterface` mock.
- **Clean components:** `GameForm`, `EditGame`, and `GameDetail` no longer import `Alert` or manage `successMessage`/`errorMessage` state. Their `onSuccess` callback is purely for navigation.

### What becomes more complex

- **`GamesStore` has one more dependency:** `NotificationServiceInterface` is added as a 6th constructor argument, increasing the dependency count. The DI container manages this transparently.
- **Separation of concerns nuance:** `GamesStore` now concerns itself with user feedback messaging — a presentation concern. This is an intentional tradeoff: keeping UI components clean is valued over strict separation of the store from all presentation concerns.
- **`Result` dual purpose:** The returned `Result` serves two different consumers simultaneously — the store for notification, and the caller for navigation/form-reset. This is transparent in practice but requires understanding for new contributors.

## Alternatives Considered

### UI components call `notificationService` directly

Rejected. This leaks notification logic into every page/component that triggers an operation. It also risks inconsistency: a component could forget to call the notification service, or apply different message strings. Testing becomes spread across component tests.

### Inline `<Alert>` components in the form/page

This was the pre-Story-8.3 approach. Rejected because:

- Alert banners are visually disruptive and harder to dismiss than toasts
- Each page duplicated success/error state management
- The toast system was built precisely to replace this pattern

## References

- [ADR-016: Ports & Adapters for Cross-Cutting Notification](./ADR-016-ports-adapters-notification.md)
- [ADR-008: Result Pattern Usage Convention](./ADR-008-result-pattern-usage-convention.md)
- [Dependency Injection](../dependency-injection.md)
- [UI Layer](../../layers/ui-layer.md)
