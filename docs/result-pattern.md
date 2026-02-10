# Result Pattern for Error Handling

## Overview

The Result pattern provides type-safe error handling **without exceptions in the domain layer**. This enables explicit error handling and better control flow.

### Exception Philosophy

**Exceptions in Result (`unwrap()`, `getError()`)** indicate **developer bugs** (misuse), not business logic errors. Business errors are captured as `Err` states. With proper type guards, normal code flow has **zero exceptions**.

- **Developer bug** (misuse): Calling `unwrap()` on Err without type guard → Exception (fail-fast)
- **Business error** (expected): Service returns `Err` with error details → Handled via type guard

## Class Definition

```typescript
export class Result<T, E> {
  static ok<T>(value: T): Result<T, never>;
  static err<E>(error: E): Result<never, E>;

  isOk(): boolean;
  isErr(): boolean;
  unwrap(defaultValue?: T): T;
  getError(): E;
  transform<U>(fn: (value: T) => U): Result<U, E>;
  transformErr<F>(fn: (error: E) => F): Result<T, F>;
}
```

## Creating Results

### Success Case

```typescript
import { Result } from '@Shared/domain/result/Result';

const result = Result.ok(42);
// Type: Result<number, never>
```

### Error Case

```typescript
import { Result } from '@Shared/domain/result/Result';

const result = Result.err('Something went wrong');
// Type: Result<never, string>
```

## Type Guards

### Checking for Success

```typescript
if (result.isOk()) {
  // TypeScript knows this is Result<T, never>
  const value = result.unwrap(); // T - safe to call
}
```

### Checking for Error

```typescript
if (result.isErr()) {
  // TypeScript knows this is Result<never, E>
  const error = result.getError(); // E - safe to call
}
```

## Extracting Values

### unwrap()

Extracts the value from an Ok Result (unwraps it):

```typescript
const result = Result.ok(42);
result.unwrap(); // 42

const errorResult = Result.err('Not found');
errorResult.unwrap(); // throws Error('Not found')
errorResult.unwrap(0); // 0 (uses default, doesn't throw)
```

⚠️ **Important**: Always use `isOk()` type guard before calling `unwrap()` without a default, or provide a default value.

**Why `unwrap()` instead of `getValue()`?**

- ✅ Standard in functional programming (Rust, Haskell)
- ✅ Semantically clear: "unwrap the Result to extract the value"
- ✅ Avoids confusion with Value Object `getValue()` methods
- ✅ Opens the door to `unwrapOr()`, `unwrapOrElse()` in the future

### getError()

Extracts the error from an Err Result:

```typescript
const result = Result.ok(42);
result.getError(); // throws Error('Called getError on an Ok value')

const errorResult = Result.err('Not found');
errorResult.getError(); // 'Not found'
```

⚠️ **Important**: Always use `isErr()` type guard before calling `getError()`.

## Transformations

### transform()

Transforms the success value:

```typescript
const result = Result.ok(42);
const transformed = result.transform(n => n.toString());
// Result.ok("42")

const errorResult = Result.err<number, string>('error');
const transformedError = errorResult.transform(n => n.toString());
// Result.err("error") - unchanged
```

### transformErr()

Transforms the error value:

```typescript
const result = Result.err('error');
const transformed = result.transformErr(e => new Error(e));
// Result.err(Error("error"))

const okResult = Result.ok<number, string>(42);
const transformedOk = okResult.transformErr(e => new Error(e));
// Result.ok(42) - unchanged
```

## Usage Example: Use Case

```typescript
import { Result } from '@Shared/domain/result/Result';

type ValidationError = {
  field: string;
  message: string;
};

class CreateUserUseCase {
  execute(email: string): Result<User, ValidationError> {
    // Validate
    if (!email.includes('@')) {
      return Result.err({
        field: 'email',
        message: 'Invalid email format',
      });
    }

    // Create user
    const user = { id: '123', email };
    return Result.ok(user);
  }
}

// Usage with type guards (recommended)
const useCase = new CreateUserUseCase();
const result = useCase.execute('user@example.com');

if (result.isOk()) {
  const user = result.unwrap(); // Safe - won't throw
  console.log('Created:', user);
} else {
  const error = result.getError(); // Safe - won't throw
  console.error('Validation failed:', error.message);
}

// Usage with default value (safe without type guard)
const user = result.unwrap({ id: 'default', email: 'default@example.com' });
```

## Benefits

1. **Type Safety**: Compiler enforces error handling
2. **Explicit Errors**: Error types are visible in function signatures
3. **Safe with Type Guards**: isOk()/isErr() enable safe extraction
4. **Fail-Fast**: Throws if misused (better than silent null bugs)
5. **Composable**: Easy to chain operations with transform methods

## Best Practices

1. **Always use type guards**: Check `isOk()`/`isErr()` before calling `unwrap()`/`getError()`
   - Prevents exceptions in normal flow
   - Leverages TypeScript type narrowing
2. **Domain Layer**: Use Result for all domain operations instead of throwing
3. **Error Types**: Define specific error types (not string)
4. **Default Values**: Use `unwrap(default)` when a fallback makes sense
5. **Composition**: Chain with transform/transformErr when appropriate
6. **Fail-fast Philosophy**: Exceptions = developer bugs, Result = business errors

## Anti-Patterns

❌ **Don't call unwrap/getError without type guards**

```typescript
// Bad - might throw!
const value = result.unwrap();

// Good - safe
if (result.isOk()) {
  const value = result.unwrap();
}

// Good - safe with default
const value = result.unwrap(defaultValue);
```

❌ **Don't use try/catch to handle Result**

```typescript
// Bad - defeats the purpose
try {
  const value = result.unwrap();
} catch (e) {
  // Use type guards instead!
}

// Good
if (result.isOk()) {
  const value = result.unwrap();
}
```

❌ **Don't use for async operations directly**

```typescript
// Bad - use Promise<Result<T, E>> instead
async function fetchUser(): Result<User, Error> { ... }

// Good
async function fetchUser(): Promise<Result<User, Error>> { ... }
```

## References

- Inspired by Rust's `Result<T, E>`
- Similar to Haskell's `Either` monad
- TypeScript implementation with OOP principles
