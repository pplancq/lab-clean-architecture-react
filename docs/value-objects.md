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

```typescript
import { Result } from '@Shared/domain/result/Result';

type MyValueError = {
  field: string;
  message: string;
};

export class MyValue {
  private readonly value: string; // Immutable

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Result<MyValue, MyValueError> {
    // Validation
    if (!value || value.trim().length === 0) {
      return Result.err({
        field: 'myValue',
        message: 'Value is required',
      });
    }

    if (value.length > 100) {
      return Result.err({
        field: 'myValue',
        message: 'Value cannot exceed 100 characters',
      });
    }

    return Result.ok(new MyValue(value.trim()));
  }

  getValue(): string {
    return this.value;
  }
}
```

### Key Points

- **Private constructor**: Prevents invalid instantiation
- **Static factory method**: Returns `Result<T, E>` for validation
- **Immutable properties**: All fields are `readonly`
- **Single getter**: Returns the primitive value

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

### Required String Values

```typescript
static create(value: string): Result<GameTitle, GameTitleError> {
  if (!value || value.trim().length === 0) {
    return Result.err({
      field: 'title',
      message: 'Title is required',
    });
  }

  if (value.length > 200) {
    return Result.err({
      field: 'title',
      message: 'Title cannot exceed 200 characters',
    });
  }

  return Result.ok(new GameTitle(value.trim()));
}
```

### Optional String Values

```typescript
static create(value: string): Result<GameDescription, GameDescriptionError> {
  // Empty is valid (optional)
  if (value.length > 1000) {
    return Result.err({
      field: 'description',
      message: 'Description cannot exceed 1000 characters',
    });
  }

  return Result.ok(new GameDescription(value));
}
```

### Enum Values

```typescript
export enum StatusType {
  Owned = 'Owned',
  Wishlist = 'Wishlist',
  Sold = 'Sold',
  Borrowed = 'Borrowed',
}

static create(value: string): Result<Status, StatusError> {
  const normalizedValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

  if (!Object.values(StatusType).includes(normalizedValue as StatusType)) {
    return Result.err({
      field: 'status',
      message: `Invalid status. Allowed values: ${Object.values(StatusType).join(', ')}`,
    });
  }

  return Result.ok(new Status(normalizedValue as StatusType));
}
```

### Flexible Strings (Anticipating Database)

For values that will be database-driven in the future:

```typescript
static create(value: string): Result<Platform, PlatformError> {
  if (!value || value.trim().length === 0) {
    return Result.err({
      field: 'platform',
      message: 'Platform name is required',
    });
  }

  if (value.length > 100) {
    return Result.err({
      field: 'platform',
      message: 'Platform name cannot exceed 100 characters',
    });
  }

  // Flexible - accepts any platform name
  // Examples: 'PlayStation 5', 'Xbox Series X', 'Steam Deck'
  return Result.ok(new Platform(value.trim()));
}
```

**Why flexible strings?**

- ✅ Prepares for database-driven lists
- ✅ Avoids code changes when adding new platforms
- ✅ Supports variations (PS1, PS2, PS3, PS4, PS5, etc.)

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
  static create(props: GameCreateProps): Result<Game, GameError> {
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
  updateTitle(newTitle: string): Result<void, GameError> {
    const titleResult = GameTitle.create(newTitle);
    if (titleResult.isErr()) {
      return Result.err(titleResult.getError());
    }

    this.title = titleResult.unwrap();
    return Result.ok(undefined);
  }

  updateStatus(newStatus: string): Result<void, GameError> {
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
class GameId {
  static create(value: string): Result<GameId, GameIdError> {
    if (!value || value.trim().length === 0) {
      return Result.err({ field: 'id', message: 'ID is required' });
    }
    return Result.ok(new GameId(value));
  }

  getId(): string {
    return this.value;
  }
}
```

### Optional Text Value Objects

```typescript
class GameDescription {
  static create(value: string): Result<GameDescription, GameDescriptionError> {
    // Empty is valid
    if (value.length > 1000) {
      return Result.err({
        field: 'description',
        message: 'Description too long',
      });
    }
    return Result.ok(new GameDescription(value));
  }

  getDescription(): string {
    return this.value;
  }
}
```

### Enum Value Objects

```typescript
enum StatusType {
  Active = 'Active',
  Inactive = 'Inactive',
}

class Status {
  static create(value: string): Result<Status, StatusError> {
    const normalized = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    if (!Object.values(StatusType).includes(normalized as StatusType)) {
      return Result.err({ field: 'status', message: 'Invalid status' });
    }
    return Result.ok(new Status(normalized as StatusType));
  }

  getStatus(): StatusType {
    return this.value;
  }
}
```

## Testing Value Objects

### Test Structure

```typescript
import { describe, it, expect } from 'vitest';
import { GameTitle } from './GameTitle';

describe('GameTitle', () => {
  describe('create', () => {
    it('should create a valid GameTitle', () => {
      const result = GameTitle.create('The Legend of Zelda');

      expect(result.isOk()).toBeTruthy();
      const title = result.unwrap();
      expect(title.getTitle()).toBe('The Legend of Zelda');
    });

    it('should return error for empty title', () => {
      const result = GameTitle.create('');

      expect(result.isErr()).toBeTruthy();
      expect(result.getError().field).toBe('title');
      expect(result.getError().message).toContain('required');
    });

    it('should trim whitespace', () => {
      const result = GameTitle.create('  Zelda  ');

      expect(result.isOk()).toBeTruthy();
      expect(result.unwrap().getTitle()).toBe('Zelda');
    });

    it('should return error for title exceeding max length', () => {
      const longTitle = 'a'.repeat(201);
      const result = GameTitle.create(longTitle);

      expect(result.isErr()).toBeTruthy();
      expect(result.getError().message).toContain('200 characters');
    });
  });

  describe('getTitle', () => {
    it('should return the title', () => {
      const title = GameTitle.create('Zelda').unwrap();

      expect(title.getTitle()).toBe('Zelda');
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
