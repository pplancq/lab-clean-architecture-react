# ADR-018: Abstract Base Classes for Value Object Validation

- **Status:** Accepted
- **Date:** 2026-05-05
- **Issue:** [#285](https://github.com/pplancq/lab-clean-architecture-react/issues/285)

## Context

After ADR-015 introduced the `DomainValidationError` subclass hierarchy, each Value Object still repeated inline validation logic. All 6 collection VOs and 3 toast VOs contained nearly identical guards:

```typescript
// Duplicated across every VO
if (!value || value.trim().length === 0) {
  return Result.err(new NotEmptyError("title"));
}
if (value.trim().length > 200) {
  return Result.err(new DomainValidationError("title", "title cannot exceed 200 characters"));
}
```

Problems:

- Validation logic was copy-pasted — a bug fix or behaviour change had to be applied to every VO independently.
- Inconsistent `trim()` behaviour: some VOs trimmed, some did not.
- No `MaxLengthError` concrete class — long-string constraints fell back to the generic `DomainValidationError` with a manually written message.
- `ToastDuration` used `value <= 0` which incorrectly passes `NaN` (because `NaN <= 0` evaluates to `false`).

## Decision

Introduce two abstract base classes in `src/shared/domain/value-objects/` and one new error class in `src/shared/domain/errors/`.

### `MaxLengthError`

A new concrete subclass of `DomainValidationError`:

```typescript
new MaxLengthError("title", 200);
// → message: "title cannot exceed 200 characters"
```

### `AbstractStringValueObject`

Abstract base for all string-based VOs. Exposes three `protected static` helpers:

```typescript
protected static trim(value: string): string
protected static notEmpty(field: string, value: string): Result<string, NotEmptyError>
protected static maxLength(field: string, value: string, max: number): Result<string, MaxLengthError>
```

### `AbstractNumberValueObject`

Abstract base for numeric VOs. Exposes one `protected static` helper:

```typescript
protected static positiveNumber(field: string, value: number): Result<number, PositiveNumberError>
```

Uses `!Number.isFinite(value) || value < 1` — correctly rejects `NaN` and `Infinity`.

### Usage pattern

VOs extend the abstract base and compose helpers in their `create` factory:

```typescript
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

VOs with unique constraints add a `private static` method alongside the inherited helpers.

> **Note on `private static` vs instance methods**: The general repository convention for helper methods that don't use `this` is to keep them as `private` instance methods and add `/* eslint-disable-next-line class-methods-use-this */` (see `DeleteGameUseCase`, `EditGameUseCase`). In VO subclasses this is an intentional exception: VOs are immutable value types with no mutable instance state, so `private static` is semantically correct and does not require disabling the ESLint rule.

### `Status` VO exception

`Status` does **not** extend `AbstractStringValueObject` — its validation is enum-based (`AllowedValuesError`), not a string-length concern. It uses the shared error class directly without an abstract base.

### Visibility: `protected static`

Helpers are `protected static` — accessible within subclasses but not from external code. This enforces the VO public API: only `create()` and `getXXX()` are visible to callers. The validation helpers are implementation details of the VO class hierarchy.

## Consequences

**Easier:**

- Validation logic lives in one place — a fix propagates to all VOs automatically.
- New VOs compose existing helpers rather than repeating guards.
- `MaxLengthError` is available for any VO needing a length constraint.
- Consistent `trim()` behaviour across all string VOs.
- `NaN`/`Infinity` edge case handled correctly by `AbstractNumberValueObject.positiveNumber`.

**Trade-offs:**

- All string/number VOs depend on the abstract base — changing the base affects all subclasses.
- Tests that assert specific error message strings must be updated if default messages change (already accepted as a trade-off in ADR-015).

## References

- [ADR-015](./ADR-015-domain-validation-error-hierarchy.md) — Domain Validation Error Hierarchy
- [Value Objects Guide](../../value-objects.md)
