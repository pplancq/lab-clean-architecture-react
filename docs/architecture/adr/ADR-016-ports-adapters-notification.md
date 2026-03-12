# ADR-016: Ports & Adapters for Cross-Cutting Notification

## Status

✅ Accepted

## Date

2026-03-12

## Context

Story 8.1 built a self-contained `toast` bounded context (domain, application, infrastructure, UI). Story 8.2 needs to make this toast system available to other bounded contexts (e.g., `collection`) so they can trigger notifications after user actions.

The naive approach — importing `@Toast/*` directly from other contexts — would couple every bounded context to the toast implementation, violating the bounded context isolation principle and making the notification system impossible to swap without touching all callers.

Additionally, the `ToastStore` is a React-aware store managed through React context (`ToastProvider`), while services in other bounded contexts are resolved through the DI container. A bridge is needed to connect these two worlds.

## Decision

Implement a Ports & Adapters pattern for cross-cutting notifications:

### 1. Port — `NotificationServiceInterface` (Shared Domain)

A technology-agnostic interface defined in `src/shared/domain/notifications/`:

```typescript
// src/shared/domain/notifications/NotificationServiceInterface.d.ts
export interface NotificationServiceInterface {
  success(message: string): void;
  error(message: string): void;
  info(message: string): void;
  warning(message: string): void;
}
```

All bounded contexts that need to notify the user depend **only** on this interface — never on `@Toast/*`.

### 2. Adapter — `ToastNotificationService` (Shared Infrastructure)

A concrete implementation in `src/shared/infrastructure/notifications/` that delegates to `ToastStoreInterface`:

```typescript
// src/shared/infrastructure/notifications/ToastNotificationService.ts
export class ToastNotificationService implements NotificationServiceInterface {
  constructor(private readonly toastStore: ToastStoreInterface) {}

  success(message: string): void {
    this.toastStore.addToast(message, 'success');
  }
  error(message: string): void {
    this.toastStore.addToast(message, 'error');
  }
  info(message: string): void {
    this.toastStore.addToast(message, 'info');
  }
  warning(message: string): void {
    this.toastStore.addToast(message, 'warning');
  }
}
```

### 3. DI Registration (Shared Service Collection)

`ToastNotificationService` is registered in `src/shared/serviceCollection.ts` via `toDynamicValue`, resolving the `ToastStore` singleton already bound by `serviceToast`. Load order in `serviceContainer.ts` is critical:

```typescript
serviceContainer.loadSync(serviceToast); // 1. Toast singleton registered
serviceContainer.loadSync(sharedServiceCollection); // 2. NotificationService resolved via ToastStore
serviceContainer.loadSync(serviceCollection); // 3. Collection services
```

### 4. Bridge — `ToastBridgeProvider` (Shared UI)

A React component in `src/shared/ui/ToastBridgeProvider/` that uses `useService` to retrieve the `ToastStore` from the DI container and mounts `ToastProvider`:

```tsx
// src/shared/ui/ToastBridgeProvider/ToastBridgeProvider.tsx
export const ToastBridgeProvider = ({ children }: PropsWithChildren) => {
  const toastStore = useService<ToastStoreInterface>(TOAST_SERVICES.ToastStore);
  return <ToastProvider service={toastStore}>{children}</ToastProvider>;
};
```

This component is placed between `ServiceProvider` and `QueryClientProvider` in the provider tree, keeping `Providers.tsx` free of any `@Toast/*` knowledge:

```tsx
// src/app/providers/Providers/Providers.tsx
<ServiceProvider container={container}>
  <ToastBridgeProvider>
    <QueryClientProvider queryClient={queryClient}>{children}</QueryClientProvider>
  </ToastBridgeProvider>
</ServiceProvider>
```

## Consequences

### What becomes easier

- **Bounded context isolation**: `collection` (and future contexts) only import `NotificationServiceInterface` from `@Shared/` — never from `@Toast/`.
- **Swappable implementation**: replacing toast with another notification library only requires a new adapter and DI rebinding — no changes to callers.
- **Testability**: `NotificationServiceInterface` is trivial to mock in unit tests.
- **Provider tree readability**: `Providers.tsx` has no direct knowledge of toast — `ToastBridgeProvider` encapsulates that responsibility.

### What becomes more complex

- **Load order sensitivity**: `serviceToast` must be loaded before `sharedServiceCollection` in `serviceContainer.ts`. A comment documents this constraint.
- **Indirection**: developers unfamiliar with the pattern may wonder why `NotificationServiceInterface` exists when `ToastStore` is already available.

## Alternatives Considered

### Direct `ToastStore` usage in bounded contexts

Rejected. This couples `collection` (and others) directly to `@Toast/*` and breaks bounded context isolation.

### React context bridge component accessing both contexts simultaneously

Previously implemented as `ToastServiceBridge` — a component mounted inside both `ServiceProvider` and `ToastProvider` to sync the DI-resolved service into the toast context. Abandoned because it added complexity without benefit: the `ToastStore` singleton in the DI container is already shared with `ToastProvider` via `ToastBridgeProvider`, making dual-context access unnecessary.

## References

- [Dependency Injection](../dependency-injection.md)
- [Dependency Rules](../dependency-rules.md)
- [Folder Structure](../folder-structure.md)
- [ADR-005: InversifyJS for Dependency Injection](./ADR-005-inversifyjs-dependency-injection.md)
- [ADR-013: In-Memory Repository for Transient Data](./ADR-013-in-memory-repository-for-transient-data.md)
