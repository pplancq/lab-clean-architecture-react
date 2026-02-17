# Game Collection IndexedDB Persistence

This document describes the IndexedDB persistence implementation for the Game Collection feature.

## Architecture

The persistence layer follows Clean Architecture principles with clear separation between domain and infrastructure:

```
shared/
├── domain/repositories/
│   ├── RepositoryInterface.d.ts         # Generic repository contract
│   └── error/
│       ├── RepositoryErrorInterface.d.ts
│       ├── NotFoundError.ts
│       ├── QuotaExceededError.ts
│       └── UnknownError.ts
└── infrastructure/persistence/
    ├── IndexedDBInterface.d.ts          # IndexedDB service contract
    └── IndexedDB.ts                     # IndexedDB service implementation

collection/
├── domain/
│   ├── entities/Game.ts                 # Domain entity
│   └── repositories/
│       └── GameRepositoryInterface.d.ts # Game repository contract
└── infrastructure/persistence/
    ├── IndexedDBGameRepository.ts       # Repository implementation
    ├── dtos/
    │   └── GameDTO.ts                   # Storage data transfer object
    └── mappers/
        └── GameMapper.ts                # Entity ↔ DTO conversion
```

## IndexedDB Schema

### Database Configuration

- **Database Name**: `GameCollectionDB`
- **Version**: 1
- **Object Store**: `games`
- **Key Path**: `id`

### Indexes

| Index Name | Field    | Unique | Purpose                         |
| ---------- | -------- | ------ | ------------------------------- |
| title      | title    | No     | Search/filter games by title    |
| platform   | platform | No     | Filter games by gaming platform |
| status     | status   | No     | Filter by ownership status      |

### Schema Definition

```typescript
// Object Store: games
class GameDTO {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly platform: string,
    public readonly format: string,
    public readonly purchaseDate: string | null, // ISO 8601 date string
    public readonly status: string,
  ) {}
}
```

## DTO Mapping Strategy

The persistence layer uses Data Transfer Objects (DTOs) to isolate the domain model from storage concerns:

### Why DTOs?

1. **Storage Independence**: IndexedDB only handles primitives efficiently
2. **Schema Evolution**: DTOs allow versioning and migrations without affecting domain
3. **Type Safety**: Explicit conversion prevents accidental data corruption
4. **Validation**: Domain validation occurs only when converting from DTO to entity

### Mapping Process

```typescript
// Domain → Storage (save operation)
Game entity → GameMapper.toDTO() → GameDTO → IndexedDB

// Storage → Domain (retrieve operation)
IndexedDB → GameDTO → GameMapper.toDomain() → Result<Game, GameError>
```

### Date Handling

- **Domain**: `Date | null` (JavaScript Date object)
- **Storage**: `string | null` (ISO 8601 format: `YYYY-MM-DDTHH:mm:ss.sssZ`)
- **Conversion**: Automatic via `toISOString()` and `new Date()`

## Usage Examples

### Dependency Injection Setup

The repository is registered in the DI container (`serviceCollection.ts`):

```typescript
import { IndexedDB } from '@Shared/infrastructure/persistence/IndexedDB';
import { ContainerModule } from 'inversify';
import { IndexedDBGameRepository } from './infrastructure/persistence/IndexedDBGameRepository';

export const serviceCollection: ContainerModule = new ContainerModule(options => {
  options
    .bind(IndexedDB)
    .toDynamicValue(() => new IndexedDB('GameCollectionDB', 1, 'games'))
    .inSingletonScope();

  options
    .bind(IndexedDBGameRepository)
    .toDynamicValue(service => new IndexedDBGameRepository(service.get(IndexedDB)))
    .inSingletonScope();
});
```

### Basic Operations

```typescript
import { container } from '@Front/di/container';
import { IndexedDBGameRepository } from '@Collection/infrastructure/persistence/IndexedDBGameRepository';
import type { GameRepositoryInterface } from '@Collection/domain/repositories/GameRepositoryInterface';

// Get repository from DI container
const repository = container.get<GameRepositoryInterface>(IndexedDBGameRepository);

// Save a game
const saveResult = await repository.save(game);
if (saveResult.isOk()) {
  console.log('Game saved successfully');
} else {
  const error = saveResult.getError();
  if (error instanceof QuotaExceededError) {
    // Handle storage quota exceeded
  }
}

// Find game by ID
const findResult = await repository.findById('game-123');
if (findResult.isOk()) {
  const game = findResult.unwrap();
  console.log(`Found: ${game.getTitle()}`);
} else {
  const error = findResult.getError();
  if (error instanceof NotFoundError) {
    console.log('Game not found');
  }
}

// Get all games
const allResult = await repository.findAll();
if (allResult.isOk()) {
  const games = allResult.unwrap();
  console.log(`Total games: ${games.length}`);
}

// Delete a game
const deleteResult = await repository.delete('game-123');
if (deleteResult.isOk()) {
  console.log('Game deleted');
}
```

## Error Handling

All repository operations return `Result<T, RepositoryError>` for type-safe error handling:

### Error Types

```typescript
type RepositoryError =
  | NotFoundError // Entity not found
  | QuotaExceededError // Storage quota exceeded
  | UnknownError; // Other database errors
```

### Error Handling Pattern

```typescript
const result = await repository.save(game);

if (result.isErr()) {
  const error = result.getError();

  if (error instanceof QuotaExceededError) {
    // Show user: "Storage full, please free up space"
  } else if (error instanceof NotFoundError) {
    // Entity doesn't exist (shouldn't happen on save)
  } else if (error instanceof UnknownError) {
    // Log error details and show generic error message
    console.error('Database error:', error.originalError);
  }
}
```

## Testing

### Test Utilities

The `utils/indexedDBTestUtils.ts` provides helpers for integration testing:

```typescript
import { setupTestDatabase, cleanupTestDatabase } from './utils/indexedDBTestUtils';

describe('Repository Tests', () => {
  beforeEach(async () => {
    await setupTestDatabase();
  });

  afterEach(async () => {
    await cleanupTestDatabase();
  });

  it('should save and retrieve game', async () => {
    // Test implementation
  });
});
```

### Testing with fake-indexeddb

Integration tests use `fake-indexeddb` to simulate IndexedDB in Node.js:

```typescript
// vitest.setup.ts
import 'fake-indexeddb/auto';
```

This provides a real IndexedDB implementation for tests without requiring a browser.

## Performance Considerations

### Batch Operations

For bulk saves, use transactions efficiently:

```typescript
// Good: Single transaction for multiple saves
const games = [game1, game2, game3];
for (const game of games) {
  await repository.save(game);
}

// Better: Consider implementing saveBatch() for true bulk operations
```

### Query Optimization

Use indexes for common queries:

```typescript
// Uses 'platform' index - fast
const playstationGames = (await repository.findAll()).unwrap().filter(g => g.getPlatform() === 'PlayStation');

// Better: Implement findByPlatform() using IDBCursor for efficiency
```

## Troubleshooting

### Common Issues

| Issue                | Cause                                | Solution                                        |
| -------------------- | ------------------------------------ | ----------------------------------------------- |
| `QuotaExceededError` | Browser storage limit reached        | Ask user to clear old games or use less storage |
| `VersionError`       | Database version conflict            | Close all tabs/windows with the app and refresh |
| Tests timeout        | Missing `fake-indexeddb/auto` import | Check `vitest.setup.ts` has the import          |
| DTO mapping fails    | Invalid domain data                  | Check value object validation rules             |

### Browser Compatibility

IndexedDB is supported in all modern browsers:

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 10+)

## Future Enhancements

Potential improvements for the persistence layer:

1. **Schema Migrations**: Version management for database schema changes
2. **Batch Operations**: `saveAll()`, `deleteAll()` for efficiency
3. **Advanced Queries**: `findByPlatform()`, `findByStatus()` using indexes
4. **Sync Status**: Track which games need cloud sync
5. **Import/Export**: Backup and restore game collection
6. **Full-Text Search**: Search across title and description

## References

- [IndexedDB API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Clean Architecture Principles](../../docs/architecture/clean-architecture.md)
- [Repository Pattern](../../docs/architecture/repository-pattern.md)
- [Result Pattern](../../docs/architecture/result-pattern.md)
