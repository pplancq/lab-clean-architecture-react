# PWA Infrastructure

This document explains the Progressive Web App (PWA) implementation in the Game Collection Manager.

## Overview

The PWA infrastructure is a **foundational technical layer** (like `app/`) that provides offline capabilities, caching strategies, and Service Worker management. It is **not a DDD bounded context** but rather a cross-cutting infrastructure concern.

## Architecture

### Design Principles

- **TypeScript + Object-Oriented Programming (OOP)**: All PWA code is TypeScript-based with OOP patterns
- **Dependency Injection**: Uses InversifyJS for loose coupling and testability
- **No Decorators**: Manual DI binding (project constraint - no `@injectable` decorators)
- **Strategy Pattern**: Pluggable caching strategies (Cache-First, Network-First, etc.)
- **Handler Pattern**: Lifecycle events handled by dedicated handlers
- **Static Orchestrator**: ServiceWorkerController manages event delegation

### Folder Structure

```
src/pwa/
├── ServiceWorkerController.ts       # Static orchestrator - manages SW lifecycle events
├── cache/                           # Caching strategies
│   ├── CacheFirstStrategy.ts        # Cache-First implementation
│   └── CacheStrategyInterface.d.ts  # Strategy contract
├── config/                          # Configuration and DI setup
│   ├── ServiceWorkerConfig.ts       # PWA configuration (cache names, assets)
│   ├── ServiceWorkerConfigInterface.d.ts
│   └── serviceContainer.ts          # DI container configuration
├── handlers/                        # Event handlers
│   ├── ActivateHandler.ts           # Cleanup old caches, claim clients
│   ├── FetchHandler.ts              # Intercept HTTP requests
│   ├── HandlerInterface.d.ts        # Handler contract
│   ├── InstallHandler.ts            # Cache app shell assets
│   └── MessageHandler.ts            # Handle postMessage communication
├── logger/                          # Service Worker logging
│   ├── ConsoleLogger.ts             # Console logger with [GCM:SW] prefix
│   └── LoggerInterface.d.ts         # Logger contract
└── registration/                    # Page-side registration
    └── RegisterServiceWorker.ts     # Registers SW from main app
```

## Components

### ServiceWorkerController (Orchestrator)

**File**: `src/pwa/ServiceWorkerController.ts`

Static class that orchestrates Service Worker lifecycle:

```typescript
// Initialize with DI container
ServiceWorkerController.initialize(container);

// Registers event listeners:
// - install: InstallHandler
// - activate: ActivateHandler
// - fetch: FetchHandler
// - message: MessageHandler
```

**Responsibilities**:

- Register lifecycle event listeners
- Resolve handlers from DI container
- Delegate events to appropriate handlers

### Handlers

#### InstallHandler

**File**: `src/pwa/handlers/InstallHandler.ts`

Handles Service Worker installation:

- Opens cache with configured name
- Caches app shell assets (HTML, CSS, JS)
- Calls `skipWaiting()` to activate immediately

**Dependencies**: `IServiceWorkerConfig`, `ILogger`

#### ActivateHandler

**File**: `src/pwa/handlers/ActivateHandler.ts`

Handles Service Worker activation:

- Deletes old caches (different versions with same prefix)
- Preserves current cache
- Calls `clients.claim()` to take control of pages

**Dependencies**: `IServiceWorkerConfig`, `ILogger`

#### FetchHandler

**File**: `src/pwa/handlers/FetchHandler.ts`

Intercepts HTTP requests:

- Ignores non-GET requests (POST, PUT, DELETE)
- Delegates GET requests to configured cache strategy
- Pluggable strategy pattern

**Dependencies**: `ICacheStrategy`

#### MessageHandler

**File**: `src/pwa/handlers/MessageHandler.ts`

Handles messages from the application:

- Listens for `postMessage` from app
- Handles `SKIP_WAITING` command
- Extensible for custom messages (future: sync, notifications)

**Dependencies**: None

### Cache Strategies

#### CacheFirstStrategy

**File**: `src/pwa/cache/CacheFirstStrategy.ts`

Cache-First strategy for static assets:

1. Check cache first
2. Return cached response if available
3. Fetch from network if cache miss
4. Logs cache hits/misses

**Best for**: App shell, static assets (CSS, JS, images)

**Dependencies**: `ILogger`

**Future strategies** (not implemented):

- `NetworkFirstStrategy`: Try network first, fallback to cache
- `StaleWhileRevalidateStrategy`: Return cache, update in background
- `CacheOnlyStrategy`: Only serve from cache
- `NetworkOnlyStrategy`: Only fetch from network

### Configuration

#### ServiceWorkerConfig

**File**: `src/pwa/config/ServiceWorkerConfig.ts`

PWA configuration:

```typescript
{
  cacheName: 'gcm-cache-v1',           // Current cache version
  cachePrefix: 'gcm-cache',            // Prefix for version management
  assetsToCacheOnInstall: [            // App shell assets
    '/',
    '/index.html',
    // ... other assets
  ]
}
```

### DI Container

**File**: `src/pwa/config/serviceContainer.ts`

Dependency injection setup using `toDynamicValue()` for proper dependency resolution:

```typescript
// Symbols for dependency lookup
export const SERVICE_NAME = Object.freeze({
  Logger: Symbol.for('ConsoleLogger'),
  Config: Symbol.for('ServiceWorkerConfig'),
  CacheStrategy: Symbol.for('CacheFirstStrategy'),
  InstallHandler: Symbol.for('InstallHandler'),
  ActivateHandler: Symbol.for('ActivateHandler'),
  FetchHandler: Symbol.for('FetchHandler'),
  MessageHandler: Symbol.for('MessageHandler'),
});

// Singleton logger
serviceContainer
  .bind<LoggerInterface>(SERVICE_NAME.Logger)
  .toDynamicValue(() => new ConsoleLogger())
  .inSingletonScope();

// Configuration
serviceContainer
  .bind<ServiceWorkerConfigInterface>(SERVICE_NAME.Config)
  .toDynamicValue(() => new ServiceWorkerConfig());

// Cache strategy with logger dependency
serviceContainer
  .bind<CacheStrategyInterface>(SERVICE_NAME.CacheStrategy)
  .toDynamicValue(services => new CacheFirstStrategy(services.get<LoggerInterface>(SERVICE_NAME.Logger)));

// Handlers with auto-resolved dependencies
serviceContainer
  .bind<HandlerInterface>(SERVICE_NAME.InstallHandler)
  .toDynamicValue(
    services =>
      new InstallHandler(
        services.get<ServiceWorkerConfigInterface>(SERVICE_NAME.Config),
        services.get<LoggerInterface>(SERVICE_NAME.Logger),
      ),
  );
// ... other handlers
```

**Why `toDynamicValue()`?** Allows InversifyJS to auto-resolve dependencies from the container without manual pre-instantiation.

### Registration

#### RegisterServiceWorker

**File**: `src/pwa/registration/RegisterServiceWorker.ts`

Page-side registration logic:

- Checks browser support (`'serviceWorker' in navigator`)
- Checks HTTPS (required for SW)
- Registers Service Worker from `/service-worker.js`
- Detects updates and logs registration events
- Handles registration errors

**Called from**: `src/main.ts` after React app initialization

## Entry Points

### Service Worker Entry

**File**: `src/serviceWorker.ts`

Service Worker entry point (built by Rsbuild):

```typescript
import { serviceContainer } from '@Pwa/config/serviceContainer';
import { ServiceWorkerController } from '@Pwa/ServiceWorkerController';

// Initialize controller with pre-configured container
ServiceWorkerController.initialize(serviceContainer);
```

### Application Entry

**File**: `src/main.ts`

React app entry point:

```typescript
import { registerServiceWorker } from '@Pwa/registration/RegisterServiceWorker';

// ... React app initialization ...

// Register Service Worker
registerServiceWorker();
```

## Build Configuration

**File**: `rsbuild.config.ts`

Dual environment build:

```typescript
environments: {
  web: {
    // React app build
    source: { entry: { index: 'src/main.ts' } }
  },
  serviceWorker: {
    // Service Worker build
    source: { entry: { 'service-worker': 'src/serviceWorker.ts' } },
    html: { template: false },
    output: { target: 'web-worker' }
  }
}
```

## Current Limitations

The current implementation is a **boilerplate foundation**:

✅ **Implemented**:

- Service Worker lifecycle management
- Basic caching (app shell)
- Cache-First strategy
- Event handling architecture
- DI container setup
- Comprehensive tests

❌ **Not Yet Implemented**:

- Offline sync (IndexedDB integration)
- Push notifications
- Background sync
- Advanced caching strategies
- Runtime caching
- Cache expiration policies
- Network status detection
- Use case integration (domain logic)

## Future Extensions

### 1. Offline Sync

**Approach**: DDD Use Cases called from Service Worker

```typescript
// Example: Sync pending actions when online
class SyncOfflineActionsHandler {
  constructor(private syncUseCase: SyncOfflineCollectionsUseCase) {}

  async handle(event: SyncEvent): Promise<void> {
    await this.syncUseCase.execute();
  }
}
```

**Storage**: Use IndexedDB (accessible from both app and Service Worker)

### 2. Push Notifications

**Approach**: Dedicated notification handler

```typescript
class PushNotificationHandler {
  handle(event: PushEvent): void {
    const data = event.data?.json();
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon.png',
    });
  }
}
```

### 3. Advanced Caching Strategies

Implement additional strategies:

- **NetworkFirstStrategy**: Fresh data priority
- **StaleWhileRevalidateStrategy**: Instant response + background update
- **CacheOnly**: Offline-only resources
- **NetworkOnly**: Always-fresh resources

### 4. Communication with React App

Service Worker ↔ App communication via `postMessage`:

```typescript
// App → Service Worker
navigator.serviceWorker.controller?.postMessage({
  type: 'SYNC_NOW',
  payload: { collectionId: '123' },
});

// Service Worker → App
self.clients.matchAll().then(clients => {
  clients.forEach(client => {
    client.postMessage({ type: 'SYNC_COMPLETE' });
  });
});
```

## Key Design Decisions

### Why `pwa/` is Infrastructure (not DDD Context)

| Aspect                  | DDD Context (e.g., `collection/`)    | Infrastructure (`pwa/`, `app/`) |
| ----------------------- | ------------------------------------ | ------------------------------- |
| **Purpose**             | Business domain logic                | Technical cross-cutting concern |
| **Layers**              | domain/ application/ infrastructure/ | Flat structure by feature       |
| **Ubiquitous Language** | Yes (Collection, Game, Wishlist)     | No (technical terms)            |
| **Bounded Context**     | Yes (collection management)          | No (shared infrastructure)      |
| **Example**             | AddGameToCollection use case         | Cache-First strategy            |

**Conclusion**: PWA = foundational infrastructure like `app/`, not a business bounded context.

### Why Manual DI Binding?

Project constraint: **No TypeScript decorators allowed**

**Evolution of DI approach**:

1. ❌ `@injectable` decorators → Violates project rule
2. ⚠️ Manual `toConstantValue()` binding → Initial approach, required pre-instantiation
3. ✅ `toDynamicValue()` with auto-resolution → **Current approach** (cleaner, auto-resolves dependencies)

**Benefits of `toDynamicValue()`**:

- Dependencies automatically resolved from container
- No need for manual pre-instantiation
- Clearer dependency graph
- Singleton scope supported (`.inSingletonScope()`)

**Decision**: InversifyJS with `toDynamicValue()` for type safety + auto-resolution without decorators.

### Why Static ServiceWorkerController?

Service Workers run in a different thread - no shared state with app:

- **Static class** = single instance per Service Worker thread
- No need for instantiation (`new ServiceWorkerController()`)
- Clear lifecycle: `initialize()` once, events delegated forever
- DI container passed once, stored statically

## Troubleshooting

### Service Worker Not Updating

**Symptom**: Changes to Service Worker don't apply

**Solutions**:

1. Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
2. Unregister manually: DevTools → Application → Service Workers → Unregister
3. Clear cache: DevTools → Application → Cache Storage → Delete
4. Update version: Change `cacheName` in `ServiceWorkerConfig.ts`

### Cache Not Working

**Symptom**: Assets not served from cache

**Debug**:

1. Check DevTools → Application → Cache Storage
2. Verify assets in `assetsToCacheOnInstall`
3. Check console for `[GCM:SW]` logs
4. Ensure GET requests (POST/PUT/DELETE ignored)

## References

- [Service Worker API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Progressive Web Apps - web.dev](https://web.dev/progressive-web-apps/)
- [Workbox (Google's PWA library)](https://developers.google.com/web/tools/workbox)
- [InversifyJS Documentation](https://inversify.io/)
- [Rsbuild Environments](https://rsbuild.dev/config/environments)

---

**Next Steps**: See [Architecture Overview](../architecture/README.md) for how PWA fits into the overall architecture.
