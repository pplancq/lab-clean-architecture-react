# Value Objects Pattern

## Overview

Value Objects are immutable objects that represent domain concepts through their attributes rather than identity. Two value objects with the same attributes are considered equal, regardless of their object reference.

## Characteristics

1. **Immutable**: Cannot be modified after creation
2. **Self-validating**: Validate their state in the factory method
3. **No identity**: Equality based on attributes, not reference
4. **Encapsulate validation**: All business rules are internal

## Implementation Pattern

### Structure

Value Objects extend the appropriate abstract base class from `@Shared/domain/value-objects/` and compose validation helpers in their static `create` factory.

```typescript
import { AbstractStringValueObject } from "@Shared/domain/value-objects/AbstractStringValueObject";
import { Result } from "@Shared/domain/result/Result";
import type { DomainValidationErrorInterface } from "@Shared/domain/errors/DomainValidationErrorInterface";

export class GameTitle extends AbstractStringValueObject {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): Result<GameTitle, DomainValidationErrorInterface> {
    const trimmed = AbstractStringValueObject.trim(value);
    const notEmptyCheck = AbstractStringValueObject.notEmpty("title", trimmed);
    if (notEmptyCheck.isErr()) return Result.err(notEmptyCheck.getError());
    const maxLengthCheck = AbstractStringValueObject.maxLength("title", trimmed, 200);
    if (maxLengthCheck.isErr()) return Result.err(maxLengthCheck.getError());
    return Result.ok(new GameTitle(trimmed));
  }

  public getTitle(): string {
    return this.value;
  }
}
```

### Key Points

- **Extends abstract base**: `AbstractStringValueObject` or `AbstractNumberValueObject` from `@Shared/domain/value-objects/`
- **Private constructor**: Prevents invalid instantiation
- **Static factory method**: Returns `Result<T, DomainValidationErrorInterface>` for validation
- **Immutable properties**: All fields are `readonly` (via `protected readonly value` on the base)
- **Single getter**: Returns the primitive value with a domain-specific name
- **Typed errors**: Use `DomainValidationError` subclasses — never plain objects

## Abstract Base Classes

Two abstract base classes are provided in `src/shared/domain/value-objects/`:

### `AbstractStringValueObject`

For all string-based VOs. Provides `protected static` helpers — accessible only within subclasses, not from external code:

| Helper      | Signature                                             | Description                                       |
| ----------- | ----------------------------------------------------- | ------------------------------------------------- |
| `trim`      | `(value: string): string`                             | Trims whitespace; returns `''` for null/undefined |
| `notEmpty`  | `(field, value): Result<string, NotEmptyError>`       | Fails if the trimmed string is empty              |
| `maxLength` | `(field, value, max): Result<string, MaxLengthError>` | Fails if string exceeds `max` characters          |

### `AbstractNumberValueObject`

For numeric VOs. Provides one `protected static` helper:

| Helper           | Signature                                             | Description                                                      |
| ---------------- | ----------------------------------------------------- | ---------------------------------------------------------------- |
| `positiveNumber` | `(field, value): Result<number, PositiveNumberError>` | Fails if value is not finite or `< 1` (handles `NaN`/`Infinity`) |

### Why `protected static`?

Helpers are `protected` to enforce the VO public API contract: only `create()` and `getXXX()` are visible to callers. The validation helpers are implementation details of the class hierarchy and must not be called directly from outside a VO subclass.

### When NOT to extend the abstract base

`Status` does **not** extend `AbstractStringValueObject` because its validation is enum-based (allowed values), not a string-length concern. Use `AllowedValuesError` directly for enum VOs.

See [ADR-018](./architecture/adr/ADR-018-abstract-value-object-base-classes.md) for rationale.

## Naming Conventions

### Getter Methods

Each Value Object has a specific getter that matches its purpose:

```typescript
class GameId {
  getId(): string {
    /* ... */
  }
}
class GameTitle {
  getTitle(): string {
    /* ... */
  }
}
class Platform {
  getPlatform(): string {
    /* ... */
  }
}
class Status {
  getStatus(): StatusType {
    /* ... */
  }
}
```

**Why specific names instead of generic `getValue()`?**

- ✅ **Explicit**: `format.getFormat()` is clearer than `format.getValue()`
- ✅ **Self-documenting**: Name indicates exactly what is returned
- ✅ **Prevents confusion**: No clash with `Result.unwrap()`

### File Organization

```
src/collection/domain/value-objects/
├── GameId.ts
├── GameTitle.ts
├── GameDescription.ts
├── Platform.ts
├── Format.ts
└── Status.ts
```

## Validation Strategies

Use `DomainValidationError` subclasses from `@Shared/domain/errors/` — never plain objects.

### Required String Values

```typescript
public static create(value: string): Result<GameTitle, DomainValidationErrorInterface> {
  const trimmed = AbstractStringValueObject.trim(value);
  const notEmptyCheck = AbstractStringValueObject.notEmpty('title', trimmed);
  if (notEmptyCheck.isErr()) return Result.err(notEmptyCheck.getError());
  return Result.ok(new GameTitle(trimmed));
  // NotEmptyError message: "title cannot be empty"
}
```

### Required String Values with Max Length

```typescript
public static create(value: string): Result<GameTitle, DomainValidationErrorInterface> {
  const trimmed = AbstractStringValueObject.trim(value);
  const notEmptyCheck = AbstractStringValueObject.notEmpty('title', trimmed);
  if (notEmptyCheck.isErr()) return Result.err(notEmptyCheck.getError());
  const maxLengthCheck = AbstractStringValueObject.maxLength('title', trimmed, 200);
  if (maxLengthCheck.isErr()) return Result.err(maxLengthCheck.getError());
  return Result.ok(new GameTitle(trimmed));
  // MaxLengthError message: "title cannot exceed 200 characters"
}
```

### Numeric Values (must be positive)

```typescript
public static create(value: number): Result<ToastDuration, DomainValidationErrorInterface> {
  const check = AbstractNumberValueObject.positiveNumber('duration', value);
  if (check.isErr()) return Result.err(check.getError());
  return Result.ok(new ToastDuration(value));
  // PositiveNumberError message: "duration must be a positive number"
  // Also handles NaN and Infinity correctly
}
```

### Enum / Allowed Values

```typescript
import { AllowedValuesError } from "@Shared/domain/errors/AllowedValuesError";
import type { ToastTypeValue } from "../entities/ToastInterface";

export class ToastType {
  private static readonly VALID_TYPES: ToastTypeValue[] = ["success", "error", "info", "warning"];

  private constructor(private readonly value: ToastTypeValue) {}

  static create(value: string): Result<ToastType, DomainValidationErrorInterface> {
    if (!this.VALID_TYPES.includes(value as ToastTypeValue)) {
      return Result.err(new AllowedValuesError("type", this.VALID_TYPES));
      // → message: "type must be one of: success, error, info, warning"
    }
    return Result.ok(new ToastType(value as ToastTypeValue));
  }

  getValue(): ToastTypeValue {
    return this.value;
  }
}
```

### Optional String Values

```typescript
public static create(value: string): Result<GameDescription, DomainValidationErrorInterface> {
  const trimmed = AbstractStringValueObject.trim(value);
  // Empty is valid (optional field)
  const maxLengthCheck = AbstractStringValueObject.maxLength('description', trimmed, 1000);
  if (maxLengthCheck.isErr()) return Result.err(maxLengthCheck.getError());
  return Result.ok(new GameDescription(trimmed));
  // MaxLengthError message: "description cannot exceed 1000 characters"
}
```

### Available Error Classes

| Class                   | Location                 | Default message pattern                      | Use case              |
| ----------------------- | ------------------------ | -------------------------------------------- | --------------------- |
| `NotEmptyError`         | `@Shared/domain/errors/` | `"${field} cannot be empty"`                 | Required strings      |
| `MaxLengthError`        | `@Shared/domain/errors/` | `"${field} cannot exceed ${max} characters"` | String length limit   |
| `PositiveNumberError`   | `@Shared/domain/errors/` | `"${field} must be a positive number"`       | Numeric constraints   |
| `AllowedValuesError`    | `@Shared/domain/errors/` | `"${field} must be one of: …"`               | Enum/fixed-set values |
| `DomainValidationError` | `@Shared/domain/errors/` | Custom message required                      | Other constraints     |

All classes extend `DomainValidationError extends Error implements DomainValidationErrorInterface`. They accept an optional last argument to override the default message.

See [ADR-015](./architecture/adr/ADR-015-domain-validation-error-hierarchy.md) for error hierarchy rationale.
See [ADR-018](./architecture/adr/ADR-018-abstract-value-object-base-classes.md) for abstract base class rationale.

## Usage in Entities

### Entity Getters Return Primitives

```typescript
export class Game {
  private readonly id: GameId;
  private title: GameTitle;
  private readonly platform: Platform;

  // Getters return primitives, not VOs (VOs are implementation details)
  getId(): string {
    return this.id.getId();
  }

  getTitle(): string {
    return this.title.getTitle();
  }

  getPlatform(): string {
    return this.platform.getPlatform();
  }
}
```

**Why return primitives?**

- ✅ **Encapsulation**: Value Objects are internal implementation
- ✅ **Simplicity**: Clients work with primitives
- ✅ **Consistency**: Aligns with `update*()` methods accepting primitives

### Factory Method Accepts Primitives

```typescript
export class Game {
  static create(props: GameCreateProps): Result<Game, DomainValidationErrorInterface> {
    // Accepts primitives
    const { id, title, platform, format, status } = props;

    // Internally creates and validates VOs
    const idResult = GameId.create(id);
    if (idResult.isErr()) return Result.err(idResult.getError());

    const titleResult = GameTitle.create(title);
    if (titleResult.isErr()) return Result.err(titleResult.getError());

    // ... more VOs

    // All valid, create entity
    return Result.ok(
      new Game({
        id: idResult.unwrap(),
        title: titleResult.unwrap(),
        // ...
      }),
    );
  }
}
```

**Benefits:**

- ✅ Ergonomic for UI layer
- ✅ Centralized validation
- ✅ Consistent API

### Update Methods Accept Primitives

```typescript
export class Game {
  updateTitle(newTitle: string): Result<void, DomainValidationErrorInterface> {
    const titleResult = GameTitle.create(newTitle);
    if (titleResult.isErr()) {
      return Result.err(titleResult.getError());
    }

    this.title = titleResult.unwrap();
    return Result.ok(undefined);
  }

  updateStatus(newStatus: string): Result<void, DomainValidationErrorInterface> {
    const statusResult = Status.create(newStatus);
    if (statusResult.isErr()) {
      return Result.err(statusResult.getError());
    }

    this.status = statusResult.unwrap();
    return Result.ok(undefined);
  }
}
```

## Integration with React Hook Form

Value Objects can be reused for real-time validation:

```typescript
// In a React component
const {
  register,
  formState: { errors },
} = useForm();

// Custom validator using VO
const validateTitle = (value: string) => {
  const result = GameTitle.create(value);
  if (result.isErr()) {
    return result.getError().message;
  }
  return true;
};

// In render
<input {...register('title', { validate: validateTitle })} />;
```

**Benefits:**

- ✅ Real-time field validation
- ✅ Reuse domain validation rules
- ✅ Consistent UX

## Best Practices

### DO ✅

1. **Make properties readonly**: Enforce immutability
2. **Use private constructor**: Force factory method usage
3. **Return Result from create()**: Explicit error handling
4. **Auto-trim strings**: User-friendly normalization
5. **Specific getters**: `getFormat()` not `getValue()`
6. **Validate in factory**: All rules in one place

### DON'T ❌

1. **Don't expose public constructor**: Prevents invalid states
2. **Don't add methods without need**: YAGNI (equals/toString)
3. **Don't use generic getValue()**: Less explicit than specific names
4. **Don't mutate after creation**: Immutability is key
5. **Don't skip validation**: Factory must validate

## Common Patterns

### ID Value Objects

```typescript
export class GameId extends AbstractStringValueObject {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): Result<GameId, DomainValidationErrorInterface> {
    const trimmed = AbstractStringValueObject.trim(value);
    const notEmptyCheck = AbstractStringValueObject.notEmpty("id", trimmed);
    if (notEmptyCheck.isErr()) return Result.err(notEmptyCheck.getError());
    return Result.ok(new GameId(trimmed));
  }

  public getId(): string {
    return this.value;
  }
}
```

### Optional Text Value Objects

```typescript
export class GameDescription extends AbstractStringValueObject {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): Result<GameDescription, DomainValidationErrorInterface> {
    const trimmed = AbstractStringValueObject.trim(value);
    // Empty is valid (optional field)
    const maxLengthCheck = AbstractStringValueObject.maxLength("description", trimmed, 1000);
    if (maxLengthCheck.isErr()) return Result.err(maxLengthCheck.getError());
    return Result.ok(new GameDescription(trimmed));
  }

  public getDescription(): string {
    return this.value;
  }
}
```

### Enum Value Objects

Enum VOs do **not** extend `AbstractStringValueObject` — they use `AllowedValuesError` directly:

```typescript
import { AllowedValuesError } from "@Shared/domain/errors/AllowedValuesError";

export enum StatusType {
  OWNED = "Owned",
  WISHLIST = "Wishlist",
  SOLD = "Sold",
  LOANED = "Loaned",
}

export class Status {
  private readonly value: StatusType;

  private constructor(value: StatusType) {
    this.value = value;
  }

  public static create(value: string): Result<Status, DomainValidationErrorInterface> {
    const trimmedValue = value?.trim() ?? "";
    const allowedValues = Object.values(StatusType);
    const statusValue = allowedValues.find((s) => s.toLowerCase() === trimmedValue.toLowerCase());

    if (!statusValue) {
      return Result.err(new AllowedValuesError("status", allowedValues));
      // → "status must be one of: Owned, Wishlist, Sold, Loaned"
    }
    return Result.ok(new Status(statusValue as StatusType));
  }

  getStatus(): StatusType {
    return this.value;
  }
}
```

## Testing Value Objects

### Test Structure

```typescript
import { describe, it, expect } from "vitest";
import { GameTitle } from "./GameTitle";

describe("GameTitle", () => {
  describe("create", () => {
    it("should create a valid GameTitle", () => {
      const result = GameTitle.create("The Legend of Zelda");

      expect(result.isOk()).toBeTruthy();
      const title = result.unwrap();
      expect(title.getTitle()).toBe("The Legend of Zelda");
    });

    it("should return error for empty title", () => {
      const result = GameTitle.create("");

      expect(result.isErr()).toBeTruthy();
      expect(result.getError().field).toBe("title");
      expect(result.getError().message).toContain("cannot be empty");
    });

    it("should trim whitespace", () => {
      const result = GameTitle.create("  Zelda  ");

      expect(result.isOk()).toBeTruthy();
      expect(result.unwrap().getTitle()).toBe("Zelda");
    });

    it("should return error for title exceeding max length", () => {
      const longTitle = "a".repeat(201);
      const result = GameTitle.create(longTitle);

      expect(result.isErr()).toBeTruthy();
      expect(result.getError().message).toContain("200 characters");
    });
  });

  describe("getTitle", () => {
    it("should return the title", () => {
      const title = GameTitle.create("Zelda").unwrap();

      expect(title.getTitle()).toBe("Zelda");
    });
  });
});
```

### Test Coverage

For each Value Object, test:

- ✅ Valid creation
- ✅ Required field validation
- ✅ Max length validation
- ✅ Trimming behavior
- ✅ Getter returns correct value
- ✅ Edge cases (empty, whitespace, boundaries)

## References

- Domain-Driven Design by Eric Evans
- [Martin Fowler - Value Object](https://martinfowler.com/bliki/ValueObject.html)
- Project Result Pattern: [result-pattern.md](./result-pattern.md)
- [ADR-015 — Domain Validation Error Hierarchy](./architecture/adr/ADR-015-domain-validation-error-hierarchy.md)
- [ADR-018 — Abstract Base Classes for Value Object Validation](./architecture/adr/ADR-018-abstract-value-object-base-classes.md)
