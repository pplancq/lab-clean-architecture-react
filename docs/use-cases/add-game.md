# AddGame Use Case

## Overview

The `AddGameUseCase` is an application-layer component responsible for orchestrating the business logic required to add a game to the user's collection. It follows Clean Architecture principles by keeping the business logic independent of frameworks and UI concerns.

## Purpose

This use case:

1. **Creates a Game entity** from the provided data transfer object (DTO)
2. **Delegates validation** to the domain layer (value objects)
3. **Persists the game** via the repository abstraction

## Location

- **Interface**: `src/collection/application/use-cases/AddGameUseCaseInterface.d.ts`
- **Implementation**: `src/collection/application/use-cases/AddGameUseCase.ts`
- **Tests**: `tests/unit/collection/application/use-cases/AddGameUseCase.test.ts`

## Dependencies

- **GameRepositoryInterface**: Repository abstraction for persisting games
- **Game**: Domain entity representing a game
- **AddGameDTO**: Data transfer object for input data
- **Result Pattern**: For functional error handling

## Flow Diagram

```mermaid
flowchart TD
    A[UI Layer] -->|AddGameDTO| B[AddGameUseCase<br/>Application Layer]
    B -->|1. Create entity| C[Game.create]
    C -->|Validation| D[Value Objects<br/>GameTitle, Platform, Format, etc.]
    D -->|Result| C
    C -->|Game entity| B
    B -->|2. Persist| E[GameRepository.save]
    E -->|Result| B
    B -->|Result void or Error| A

    style A fill:#e1f5ff
    style B fill:#fff4e1
    style C fill:#e8f5e9
    style D fill:#e8f5e9
    style E fill:#f3e5f5
```

## Validation Strategy

The use case follows a **single-level validation** approach:

### Domain-Level Validation (via Value Objects)

All validation is handled by the domain layer when creating the Game entity:

- **GameTitle**: Max 200 characters, not empty
- **GameDescription**: Max 1000 characters
- **Platform**: Max 100 characters, not empty
- **Format**: Max 50 characters, not empty
- **GameStatus**: Must be a valid enum value (Owned, Wishlist, etc.)

### Why No Application-Level Validation?

The application layer does **not** duplicate validation logic because:

1. **Domain is the single source of truth** for business rules
2. **UI validation** handles user experience (required fields, format hints)
3. **Avoiding redundancy** prevents inconsistencies between layers

If additional data arrives empty or invalid from the UI, the domain validation will catch it and return a clear error.

## Usage Example

### Basic Usage

```typescript
import { container } from '@/collection/serviceCollection';
import { COLLECTION_SERVICES } from '@/collection/serviceIdentifiers';
import { AddGameDTO } from '@/collection/application/dtos/AddGameDTO';

// Get the use case from DI container
const addGameUseCase = container.get<AddGameUseCaseInterface>(COLLECTION_SERVICES.AddGameUseCase);

// Create DTO from user input
const dto = new AddGameDTO(
  'game-123',
  'The Legend of Zelda: Breath of the Wild',
  'Open-world action-adventure game',
  'Nintendo Switch',
  'Physical',
  new Date('2023-05-12'),
  'Owned',
);

// Execute the use case
const result = await addGameUseCase.execute(dto);

if (result.isOk()) {
  console.log('Game added successfully!');
} else {
  const error = result.getError();
  console.error(`Failed to add game: ${error.message}`);
}
```

### React Hook Integration

```typescript
import { useCallback, useState } from 'react';
import { container } from '@/collection/serviceCollection';
import { COLLECTION_SERVICES } from '@/collection/serviceIdentifiers';
import type { AddGameUseCaseInterface } from '@/collection/application/use-cases/AddGameUseCaseInterface';
import type { ApplicationErrorInterface } from '@/collection/application/errors/ApplicationErrorInterface';

export function useAddGame() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApplicationErrorInterface | null>(null);

  const addGame = useCallback(async (dto: AddGameDTO) => {
    setIsLoading(true);
    setError(null);

    const useCase = container.get<AddGameUseCaseInterface>(COLLECTION_SERVICES.AddGameUseCase);

    const result = await useCase.execute(dto);

    setIsLoading(false);

    if (result.isErr()) {
      setError(result.getError());
      return false;
    }

    return true;
  }, []);

  return { addGame, isLoading, error };
}
```

## Error Handling

The use case uses the [Result Pattern](../result-pattern.md) for type-safe error handling.

### Error Types

| Error Type          | When It Occurs                                 | Example                                         |
| ------------------- | ---------------------------------------------- | ----------------------------------------------- |
| **ValidationError** | Domain validation fails (value object rules)   | "Title must be between 1 and 200 characters"    |
| **RepositoryError** | Persistence operation fails (storage, network) | "Failed to save game: Database connection lost" |

### Error Response Structure

```typescript
// ValidationError
{
  type: 'Validation',
  message: 'Title must be between 1 and 200 characters',
  field: 'title',  // Optional: which field failed
  metadata: {
    domainError: { /* original domain error */ }
  }
}

// RepositoryError
{
  type: 'Repository',
  message: 'Failed to save game: Storage quota exceeded',
  metadata: {
    repositoryError: { /* original repository error */ }
  }
}
```

## Testing

The use case is thoroughly tested with 8 unit tests covering:

1. ✅ **Success case**: Valid game is created and saved
2. ✅ **Domain validation failures**: Title too long, platform too long, format too long, invalid status
3. ✅ **Repository failures**: Database errors, storage quota exceeded
4. ✅ **Edge cases**: Null purchase dates, date handling

All tests use mocked repositories and do not require actual persistence.

### Running Tests

```bash
# Run all tests for AddGameUseCase
npm run test:unit -- AddGameUseCase

# Run tests in watch mode
npm run test:unit:watch -- AddGameUseCase
```

## Design Decisions

### Why No DTO Validation?

**Decision**: The use case does not validate the DTO for required fields.

**Rationale**:

1. **Domain is authoritative**: Value objects already enforce all business rules
2. **UI handles UX**: Form validation provides immediate feedback to users
3. **Avoid triple validation**: DTO validation would be the 3rd layer (UI → DTO → Domain)
4. **Simpler code**: Less code to maintain, fewer tests, clearer responsibilities

**Trade-off**: If invalid data bypasses UI validation, the domain will catch it. Error messages from domain validation are still user-friendly and include the problematic field.

### Why Use DTOs?

**Decision**: Use a DTO (`AddGameDTO`) instead of accepting raw objects.

**Rationale**:

1. **Type safety**: Clear contract between UI and application layers
2. **Immutability**: DTOs are readonly, preventing accidental mutations
3. **Documentation**: Self-documenting interface for UI developers
4. **Testing**: Easy to construct test data

### Why Dependency Injection?

**Decision**: Use InversifyJS container for dependency management.

**Rationale**:

1. **Testability**: Easy to mock repositories in tests
2. **Flexibility**: Switch implementations (e.g., IndexedDB → API) without changing use case
3. **Single Responsibility**: Use case only knows the interface, not the implementation

## Related Documentation

- [Clean Architecture](../architecture/README.md)
- [Result Pattern](../result-pattern.md)
- [Value Objects](../value-objects.md)
- [Repository Pattern](../persistence-indexeddb.md)
- [Dependency Injection](../setup.md#dependency-injection)

## See Also

- **Domain Layer**: [Game Entity](../../src/collection/domain/entities/Game.ts)
- **Infrastructure Layer**: [IndexedDBGameRepository](../../src/collection/infrastructure/persistence/IndexedDBGameRepository.ts)
- **Application Errors**: [Error Types](../../src/collection/application/errors/)
