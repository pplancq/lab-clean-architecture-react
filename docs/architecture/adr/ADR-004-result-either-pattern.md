## ADR-004: Result/Either Pattern for Error Handling

**Date:** 2026-01-22  
**Status:** ✅ Accepted

### Context

TypeScript applications commonly handle errors via:

- **Try/Catch blocks**: Easy to forget, silent failures, type system doesn't enforce error handling
- **Throwing exceptions**: Breaks function purity, forces side effects, difficult to test
- **Error callbacks**: Callback hell, difficult to compose

**Requirements:**

- Type-safe error handling (compiler enforces error checks)
- Explicit error types in function signatures (self-documenting)
- Composable error handling (chain operations without try/catch nesting)
- Pure functions (domain layer should not throw exceptions)

**Alternatives Considered:**

- **Traditional Try/Catch**: ❌ Not type-safe, easy to forget error handling
- **Throwing Exceptions**: ❌ Breaks functional purity, difficult to track error flow
- **Result/Either Pattern**: ✅ Type-safe, explicit, composable
- **Library (neverthrow)**: ✅ Battle-tested but adds dependency (deferred to post-MVP)

### Decision

Implement a custom **Result<T, E>** pattern for all use cases and domain operations.

**Implementation:**

```typescript
// shared/domain/Result.ts
export type Result<T, E extends Error> = { success: true; value: T } | { success: false; error: E };

export const Result = {
  ok: <T>(value: T): Result<T, never> => ({ success: true, value }),
  fail: <E extends Error>(error: E): Result<never, E> => ({ success: false, error }),
};
```

**Usage in Use Cases:**

```typescript
// collection/application/use-cases/AddGame.ts
export class AddGameUseCase {
  async execute(data: GameDTO): Promise<Result<Game, ValidationError | RepositoryError>> {
    // Validation (type-safe)
    const titleResult = GameTitle.create(data.title);
    if (!titleResult.success) {
      return Result.fail(new ValidationError('Invalid title'));
    }

    // Business logic
    const game = Game.create({
      id: GameId.generate(),
      title: titleResult.value,
      platform: Platform.create(data.platform),
    });

    // Repository operation
    const saveResult = await this.repository.save(game);
    if (!saveResult.success) {
      return Result.fail(saveResult.error);
    }

    return Result.ok(game);
  }
}
```

**UI Handling:**

```typescript
// collection/ui/pages/AddGamePage.tsx
const handleSubmit = async (data: GameDTO) => {
  const result = await addGameUseCase.execute(data);

  if (!result.success) {
    // TypeScript knows result.error exists here
    if (result.error instanceof ValidationError) {
      showToast(result.error.message, 'error'); // User-friendly
    } else if (result.error instanceof RepositoryError) {
      logError(result.error); // Log for debugging
      showToast('Failed to save game. Please try again.', 'error');
    }
    return;
  }

  // TypeScript knows result.value exists here
  showToast(`Game "${result.value.title}" added!`, 'success');
  navigate('/collection');
};
```

**Error Class Hierarchy:**

```typescript
// shared/domain/errors/
export class ValidationError extends Error {
  /* ... */
}
export class NotFoundError extends Error {
  /* ... */
}

// shared/infrastructure/errors/
export class RepositoryError extends Error {
  /* ... */
}
export class ApiError extends Error {
  /* ... */
}
```

### Consequences

**Positive:**

- ✅ **Type Safety**: Compiler enforces error handling (no forgotten try/catch)
- ✅ **Explicit Error Types**: Function signatures document possible errors
- ✅ **No Silent Failures**: Cannot access `result.value` without checking `result.success`
- ✅ **Composable**: Chain operations with `mapResult`, `flatMapResult` helpers
- ✅ **Pure Functions**: Domain layer stays pure (no exceptions thrown)
- ✅ **Educational Value**: Demonstrates functional error handling patterns

**Negative:**

- ❌ **Verbosity**: More code than try/catch (every result must be checked)
- ❌ **Learning Curve**: Developers unfamiliar with Result pattern may struggle initially
- ❌ **Boilerplate**: Repetitive `if (!result.success)` checks

**Trade-offs Accepted:**

- Try/catch simplicity vs. type safety → **Type safety wins** (compiler catches errors)
- Custom implementation vs. library (neverthrow) → **Custom wins** (educational value, zero dependencies)

**Helper Functions (Future):**

```typescript
// shared/domain/ResultHelpers.ts
export const mapResult = <T, E extends Error, U>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> => {
  if (!result.success) return result;
  return Result.ok(fn(result.value));
};

export const combineResults = <T extends unknown[], E extends Error>(results: {
  [K in keyof T]: Result<T[K], E>;
}): Result<T, E> => {
  // Combine multiple results, fail if any fails
};
```

---
