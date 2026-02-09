# ADR-008: Result Pattern Usage Convention

**Status:** ✅ Accepted  
**Date:** 2026-02-09  
**Deciders:** Paul (Lead Developer)  
**Related Epic:** Epic 1 - Foundation, Clean Architecture & PWA Setup  
**Related Story:** Story 1.4 - Implement Result/Either Pattern for Error Handling  
**Extends:** ADR-004 (adds usage convention and guidelines)

---

## Context

The project implements a Result/Either pattern for type-safe error handling. However, we need a clear convention for **when to use Result vs when to throw exceptions**, as both mechanisms exist in TypeScript/JavaScript.

Without a clear guideline, developers might:

- Use Result everywhere (verbose, overkill for programming errors)
- Use exceptions everywhere (loses type safety for business logic errors)
- Mix inconsistently (confusing, hard to maintain)

---

## Decision

**We adopt a two-tier error handling strategy:**

### Rule 1: Business/Domain Errors → Use `Result<T, E>`

All **expected, recoverable errors** in business logic and domain operations use the Result pattern.

**When to use Result:**

- ✅ Domain validation failures (invalid email, out-of-range value)
- ✅ Business rule violations (duplicate game in collection, insufficient stock)
- ✅ External API failures (IGDB API rate limit, network timeout)
- ✅ Repository operations (entity not found, database constraint violation)
- ✅ Use case outcomes (operation succeeded/failed with reason)

**Why Result for business errors:**

- Type safety: Compiler forces handling of both success and error cases
- Explicit: Error cases are visible in function signatures
- No try/catch pollution: Functional composition without exception handling boilerplate
- Testable: Easy to test both success and failure paths

---

### Rule 2: Programming/Developer Errors → Use `throw Error`

All **unexpected, non-recoverable errors** that indicate programming bugs use standard exception throwing.

**When to throw:**

- ❌ Null/undefined where value is required (`if (!value) throw new Error('Value required')`)
- ❌ Invalid function arguments (`if (count < 0) throw new Error('Count must be positive')`)
- ❌ Violated invariants/assertions (`if (state !== 'ready') throw new Error('Invalid state')`)
- ❌ Missing environment configuration (`if (!API_KEY) throw new Error('API_KEY not configured')`)
- ❌ Unrecoverable infrastructure failures (out of memory, file system full)

**Why throw for programming errors:**

- Fail fast: Bugs should crash early and loudly
- No recovery path: Programming errors shouldn't be "handled" - they should be fixed
- Simpler code: No need for Result wrapper for bugs
- Standard practice: Aligns with JavaScript/TypeScript conventions

---

## Examples

### ✅ CORRECT: Business Logic with Result

```typescript
// Use Case - business operation that can fail
export class AddGameUseCase {
  async execute(data: AddGameDTO): Promise<Result<Game, AddGameError>> {
    // Validation - business rule
    if (!data.title || data.title.trim().length === 0) {
      return Result.err(new AddGameError('Title is required'));
    }

    // Check duplicate - business rule
    const existing = await this.repository.findByTitle(data.title);
    if (existing.isOk()) {
      return Result.err(new AddGameError('Game already exists in collection'));
    }

    // Persist - can fail (network, storage quota, etc.)
    const result = await this.repository.save(game);
    return result; // Returns Result<Game, RepositoryError>
  }
}

// Repository - external dependency that can fail
export class IndexedDBGameRepository {
  async save(game: Game): Promise<Result<Game, RepositoryError>> {
    try {
      const transaction = this.db.transaction(['games'], 'readwrite');
      const store = transaction.objectStore('games');
      await store.put(game);
      return Result.ok(game);
    } catch (error) {
      // Infrastructure failure - return Result error
      return Result.err(new RepositoryError('Failed to save game', error));
    }
  }
}

// UI Component - handles business result
const AddGameForm = () => {
  const addGame = useService(AddGameUseCase);

  const handleSubmit = async (data: FormData) => {
    const result = await addGame.execute(data);

    if (result.isErr()) {
      // Business error - show user-friendly message
      toast.error(result.getError().message);
      return;
    }

    // Success
    toast.success('Game added successfully');
    navigate('/collection');
  };
};
```

---

### ✅ CORRECT: Programming Errors with throw

```typescript
// Domain Entity - invariant enforcement
export class Game {
  constructor(
    private id: GameId,
    private title: string,
    private platform: Platform
  ) {
    // Programming error - developer passed invalid data
    if (!title || title.trim().length === 0) {
      throw new Error('Game title cannot be empty'); // This is a bug, not business logic
    }

    // Domain invariant violation - should never happen if used correctly
    if (id.value.length === 0) {
      throw new Error('GameId cannot be empty');
    }
  }

  // Getter with defensive programming
  getTitle(): string {
    if (!this.title) {
      throw new Error('Title is undefined - invariant violated'); // Bug in entity state
    }
    return this.title;
  }
}

// Service Provider - infrastructure requirement
export const ServiceProvider = ({ children }: PropsWithChildren) => {
  if (!serviceContainer) {
    // Programming error - container not initialized
    throw new Error('Service container not initialized. Check app setup.');
  }

  return (
    <ServiceContext.Provider value={serviceContainer}>
      {children}
    </ServiceContext.Provider>
  );
};

// Hook - usage outside provider
export const useService = <T,>(identifier: ServiceIdentifier<T>): T => {
  const container = useContext(ServiceContext);

  if (!container) {
    // Programming error - hook used outside provider
    throw new Error('useService must be used within ServiceProvider');
  }

  return container.get(identifier);
};
```

---

### ❌ INCORRECT: Mixing patterns

```typescript
// ❌ BAD: Using Result for programming error
export class Game {
  constructor(title: string): Result<Game, ValidationError> {
    if (!title) {
      return Result.err(new ValidationError('Title required'));
      // This is a programming error, not a business validation!
      // Constructor misuse should throw, not return Result
    }
    return Result.ok(new Game(title));
  }
}

// ❌ BAD: Throwing for business logic
export class AddGameUseCase {
  async execute(data: AddGameDTO): Promise<Game> {
    if (await this.isDuplicate(data.title)) {
      throw new Error('Game already exists');
      // Business logic should return Result, not throw!
    }
    return this.repository.save(game);
  }
}
```

---

## Consequences

### Positive

✅ **Clear mental model:** Business errors = Result, programming errors = throw  
✅ **Type safety where it matters:** Business logic errors are compile-time checked  
✅ **Better error messages:** Result errors can carry rich context for users  
✅ **Fail fast for bugs:** Programming errors crash immediately (good for debugging)  
✅ **Consistent codebase:** Every developer follows the same convention  
✅ **Testable:** Easy to test both success and error paths with Result

### Negative

⚠️ **Learning curve:** Developers must understand the distinction  
⚠️ **Edge cases:** Some errors blur the line (e.g., configuration errors)  
⚠️ **Verbosity:** Result pattern adds more code than simple try/catch

### Mitigation

- **Documentation:** This ADR + code examples + architecture docs
- **Code reviews:** Enforce convention during reviews
- **Linting:** Future ESLint rule to detect misuse (e.g., throw in use cases)
- **Edge case guidance:** When unsure, default to Result for recoverable, throw for bugs

---

## Edge Case Guidelines

### Configuration Errors

**Rule:** If missing config **prevents app startup** → throw  
**Rule:** If missing config **affects feature** → Result

```typescript
// Startup configuration - throw
export const initializeApp = () => {
  if (!import.meta.env.VITE_APP_NAME) {
    throw new Error('VITE_APP_NAME is required in .env');
  }
  // App cannot function without this
};

// Optional feature configuration - Result
export class IGDBService {
  async fetchGameMetadata(title: string): Promise<Result<GameMetadata, APIError>> {
    if (!this.apiKey) {
      return Result.err(new APIError('IGDB API key not configured'));
      // Feature degrades gracefully, doesn't crash app
    }
    // ...
  }
}
```

### Repository Not Found

**Rule:** If entity **should exist** (by ID from URL) → Result (user navigation error)  
**Rule:** If entity **must exist** (internal logic) → throw (programming error)

```typescript
// User-driven lookup - Result
export class GetGameByIdUseCase {
  async execute(id: string): Promise<Result<Game, NotFoundError>> {
    const result = await this.repository.findById(id);
    if (result.isErr()) {
      return Result.err(new NotFoundError('Game not found'));
      // User might have bad URL or deleted game
    }
    return result;
  }
}

// Internal invariant - throw
export class DeleteGameUseCase {
  async execute(id: string): Promise<Result<void, DeleteError>> {
    const game = await this.repository.findById(id);
    if (game.isErr()) {
      // This should never happen - game ID came from our UI list
      throw new Error(`Game ${id} not found - data inconsistency!`);
    }
    return this.repository.delete(game.getValue());
  }
}
```

---

## Implementation Checklist

For every new function/method, ask:

1. **Is this error expected and recoverable?**
   - ✅ Yes → Use `Result<T, E>`
   - ❌ No → Use `throw Error`

2. **Should the user see this error message?**
   - ✅ Yes → Use `Result` (business error)
   - ❌ No → Use `throw` (programming error → logs/Sentry)

3. **Does this error indicate a bug?**
   - ✅ Yes → Use `throw` (fail fast)
   - ❌ No → Use `Result` (expected failure)

---

## Related Decisions

- ADR-004: Result/Either Pattern for Error Handling (original decision)
- ADR-007: No TypeScript Decorators
- [ADR-002](./ADR-002-clean-architecture-ddd.md): Clean Architecture + DDD Bounded Contexts

---

## References

- [Railway Oriented Programming](https://fsharpforfunandprofit.com/rop/)
- [Rust Error Handling](https://doc.rust-lang.org/book/ch09-00-error-handling.html)
- Result Pattern Implementation: `src/shared/domain/result/Result.ts`
- Result Pattern Documentation: `docs/result-pattern.md`
- Epic 1 Retrospective: `_bmad-output/implementation-artifacts/epic-1-retro-2026-02-09.md`

---

## Revision History

| Date       | Version | Author | Changes                                             |
| ---------- | ------- | ------ | --------------------------------------------------- |
| 2026-02-09 | 1.0     | Paul   | Initial ADR creation following Epic 1 retrospective |
