# ADR-015: Domain Validation Error Hierarchy

- **Status:** Accepted
- **Date:** 2026-03-11
- **Epic:** Toast bounded context (issue #118)

## Context

Value objects validate their inputs and return `Result.err(...)` on failure. Before this ADR, validation errors were plain anonymous objects:

```typescript
return Result.err({ field: 'title', message: 'title cannot be empty' });
```

Problems:

- No type hierarchy — all validation errors look identical at the type level.
- No `instanceof` checks — impossible to distinguish "empty field" from "out-of-range" programmatically.
- Message strings are duplicated across VOs.
- Not `Error` subclasses — stack traces are absent, tooling (Sentry, etc.) doesn't capture them.

## Decision

Introduce a typed error hierarchy rooted at `DomainValidationError` in `src/shared/domain/errors/`:

```
DomainValidationError (extends Error, implements DomainValidationErrorInterface)
├── NotEmptyError          — required field is empty or whitespace
├── PositiveNumberError    — numeric field is not > 0
└── AllowedValuesError     — field value not in a fixed set
```

### Interface

```typescript
// DomainValidationErrorInterface.d.ts
export interface DomainValidationErrorInterface {
  field: string;
  message: string;
}
```

### Base class

```typescript
export class DomainValidationError extends Error implements DomainValidationErrorInterface {
  constructor(
    readonly field: string,
    readonly message: string,
  ) {
    super(message);
    this.name = 'DomainValidationError';
  }
}
```

### Specialised classes (auto-generated messages)

```typescript
new NotEmptyError('message');
// → message: "message cannot be empty"

new PositiveNumberError('duration');
// → message: "duration must be a positive number"

new AllowedValuesError('type', ['success', 'info', 'warning', 'error']);
// → message: "type must be one of: success, info, warning, error"
```

All three accept an optional second parameter to override the default message.

### Placement

- **`src/shared/domain/errors/`** — errors that are reusable across bounded contexts (`NotEmptyError`, `PositiveNumberError`, `AllowedValuesError`).
- **`src/<context>/domain/errors/`** — context-specific errors would go here if needed.

## Consequences

**Easier:**

- VOs emit semantically rich errors with a single `new NotEmptyError('field')`.
- Application layer can `instanceof`-check to distinguish empty vs. out-of-range vs. disallowed value.
- Auto-generated messages eliminate copy-paste inconsistencies.
- Errors are real `Error` subclasses — stack traces are preserved.

**Harder / Trade-offs:**

- Value object tests that asserted specific error message strings must be updated when default messages change.
- Adding a new constraint type (e.g. `MaxLengthError`) requires a new class; plain objects required no boilerplate.

## References

- [Value Objects](../../value-objects.md)
- [AddToast Use Case](../../use-cases/add-toast.md)
