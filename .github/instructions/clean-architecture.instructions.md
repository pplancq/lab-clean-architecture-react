---
applyTo: '**/domain/**/*.ts, **/application/**/*.ts, **/infrastructure/**/*.ts'
description: Enforces Clean Architecture principles and TypeScript best practices for domain, application, and infrastructure layers
---

# Clean Architecture Instructions

Instructions for implementing Clean Architecture principles in TypeScript with a focus on domain-driven design, proper abstractions, and maintainable code.

## Project Context

- **Architecture**: Clean Architecture with Domain-Driven Design
- **Language**: TypeScript with strict mode enabled
- **Layers**: Domain, Application, Infrastructure, UI
- **Pattern**: Repository pattern, Result pattern for error handling
- **DI Container**: InversifyJS for dependency injection

## Core Principles

### SOLID Principles

Follow SOLID principles throughout the codebase:

- **S**ingle Responsibility Principle: Each class should have one reason to change
- **O**pen/Closed Principle: Open for extension, closed for modification
- **L**iskov Substitution Principle: Derived classes must be substitutable for their base classes
- **I**nterface Segregation Principle: Clients should not depend on interfaces they don't use
- **D**ependency Inversion Principle: Depend on abstractions, not concretions

### Additional Principles

- **DRY** (Don't Repeat Yourself): Avoid code duplication
- **KISS** (Keep It Simple, Stupid): Prefer simplicity over complexity
- **YAGNI** (You Aren't Gonna Need It): Don't add functionality until it's needed
- **Separation of Concerns**: Each module should handle one aspect of functionality

---

## Interface and Type Conventions

### Interface Naming

**ALWAYS** suffix interfaces with `Interface`, never use the `I` prefix:

```typescript
// ✅ GOOD - Interface suffix
export interface GameRepositoryInterface {
  save(entity: Game): Promise<Result<void, RepositoryErrorInterface>>;
}

export interface RepositoryErrorInterface {
  type: string;
  message: string;
}

// ❌ BAD - I prefix
export interface IGameRepository {
  save(entity: Game): Promise<Result<void, IRepositoryError>>;
}
```

### Interface File Location

**ALWAYS** place interfaces and type definitions in `.d.ts` files:

```typescript
// ✅ GOOD - Interfaces in .d.ts file
// File: GameRepositoryInterface.d.ts
export interface GameRepositoryInterface extends RepositoryInterface<Game> {}

// ❌ BAD - Interfaces in .ts file
// File: GameRepository.ts
export interface GameRepositoryInterface extends RepositoryInterface<Game> {}
export class GameRepository implements GameRepositoryInterface { ... }
```

**Rationale**: TypeScript compiler recognizes `.d.ts` files as declaration files and doesn't need to transform them during compilation, improving build performance.

### Class Implementation Rule

**EVERY** class MUST implement an interface:

```typescript
// ✅ GOOD - Class implements interface
// File: GameRepositoryInterface.d.ts
export interface GameRepositoryInterface extends RepositoryInterface<Game> {}

// File: IndexedDBGameRepository.ts
export class IndexedDBGameRepository implements GameRepositoryInterface {
  constructor(private readonly db: IndexedDBInterface) {}
  // Implementation...
}

// ❌ BAD - Class without interface
export class IndexedDBGameRepository {
  constructor(private readonly db: IndexedDB) {}
  // Implementation...
}
```

**Exceptions**:

- DTOs (Data Transfer Objects) - These are pure data containers
- Simple utility classes with no dependencies
- Framework-specific classes (e.g., React components)

---

## Layer-Specific Guidelines

### Domain Layer

The domain layer contains business logic and is independent of external concerns.

#### Domain Entities

**Rules**:

- MUST be independent of infrastructure
- MUST NOT import from infrastructure or application layers
- MUST use value objects for complex types
- MUST validate invariants in constructors or factory methods
- MUST implement an interface (placed in `.d.ts` file)

**Example**:

```typescript
// File: GameInterface.d.ts
export interface GameInterface {
  getId(): string;
  getTitle(): string;
  getStatus(): string;
  // ... other getters
}

// File: Game.ts
import type { GameInterface } from './GameInterface';

export class Game implements GameInterface {
  private constructor(
    private readonly id: GameId,
    private readonly title: GameTitle,
    private readonly description: GameDescription,
    // ... other value objects
  ) {}

  static create(props: GameProps): Result<Game, ValidationError> {
    // Validate and create
  }

  getId(): string {
    return this.id.getValue();
  }

  // ... other methods
}
```

#### Value Objects

**Rules**:

- MUST be immutable
- MUST validate on creation
- MUST implement an interface
- MUST use private constructor with static factory method
- MUST return Result for validation errors

**Example**:

```typescript
// File: GameTitleInterface.d.ts
export interface GameTitleInterface {
  getValue(): string;
  equals(other: GameTitleInterface): boolean;
}

// File: GameTitle.ts
export class GameTitle implements GameTitleInterface {
  private static readonly MIN_LENGTH = 1;
  private static readonly MAX_LENGTH = 200;

  private constructor(private readonly value: string) {}

  static create(value: string): Result<GameTitle, ValidationError> {
    if (value.length < this.MIN_LENGTH || value.length > this.MAX_LENGTH) {
      return Result.fail({
        field: 'title',
        message: `Title must be between ${this.MIN_LENGTH} and ${this.MAX_LENGTH} characters`,
      });
    }
    return Result.ok(new GameTitle(value.trim()));
  }

  getValue(): string {
    return this.value;
  }

  equals(other: GameTitleInterface): boolean {
    return this.value === other.getValue();
  }
}
```

#### Repository Interfaces

**Rules**:

- MUST be defined in the domain layer (`.d.ts` file)
- MUST return Result types for error handling
- MUST NOT contain implementation details
- MUST extend generic RepositoryInterface when applicable

**Example**:

```typescript
// File: src/shared/domain/repositories/RepositoryInterface.d.ts
export interface RepositoryInterface<T> {
  save(entity: T): Promise<Result<void, RepositoryErrorInterface>>;
  findById(id: string): Promise<Result<T, RepositoryErrorInterface>>;
  findAll(): Promise<Result<T[], RepositoryErrorInterface>>;
  delete(id: string): Promise<Result<void, RepositoryErrorInterface>>;
}

// File: src/collection/domain/repositories/GameRepositoryInterface.d.ts
export interface GameRepositoryInterface extends RepositoryInterface<Game> {
  // Add game-specific methods if needed
}
```

### Application Layer

The application layer orchestrates domain logic and coordinates use cases.

#### Use Case Handlers

**Rules**:

- MUST implement an interface
- MUST depend on domain interfaces, not implementations
- MUST use dependency injection
- MUST return Result types
- SHOULD be thin orchestrators (delegate to domain)

**Example**:

```typescript
// File: AddGameToCollectionHandlerInterface.d.ts
export interface AddGameToCollectionHandlerInterface {
  handle(command: AddGameToCollectionCommand): Promise<Result<void, ApplicationError>>;
}

// File: AddGameToCollectionHandler.ts
export class AddGameToCollectionHandler implements AddGameToCollectionHandlerInterface {
  constructor(
    @inject(TYPES.GameRepository)
    private readonly gameRepository: GameRepositoryInterface,
  ) {}

  async handle(command: AddGameToCollectionCommand): Promise<Result<void, ApplicationError>> {
    // 1. Create game entity (domain logic)
    const gameResult = Game.create({
      id: command.id,
      title: command.title,
      // ... other props
    });

    if (gameResult.isError()) {
      return Result.fail(this.mapToApplicationError(gameResult.getError()));
    }

    // 2. Save via repository
    const game = gameResult.getValue();
    return await this.gameRepository.save(game);
  }
}
```

### Infrastructure Layer

The infrastructure layer provides implementations for domain interfaces.

#### Repository Implementations

**Rules**:

- MUST implement domain repository interface
- MUST use DTOs for persistence
- MUST use mappers to convert between DTOs and domain entities
- MUST handle all infrastructure errors (wrap in Result)
- MUST be registered in DI container

**Example**:

```typescript
// File: IndexedDBGameRepositoryInterface.d.ts
export interface IndexedDBGameRepositoryInterface extends GameRepositoryInterface {
  // Infrastructure-specific methods if needed (usually none)
}

// File: IndexedDBGameRepository.ts
export class IndexedDBGameRepository implements GameRepositoryInterface {
  constructor(
    @inject(TYPES.IndexedDB)
    private readonly db: IndexedDBInterface,
  ) {}

  async save(game: Game): Promise<Result<void, RepositoryErrorInterface>> {
    try {
      const dto = GameMapper.toDTO(game);
      const database = await this.db.getDatabase();
      const transaction = database.transaction('games', 'readwrite');
      const store = transaction.objectStore('games');

      await new Promise<void>((resolve, reject) => {
        const request = store.put(dto);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      return Result.ok();
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: unknown): Result<void, RepositoryErrorInterface> {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      return Result.fail(new QuotaExceededError('Storage quota exceeded'));
    }
    return Result.fail(new UnknownError(error instanceof Error ? error.message : 'Unknown error'));
  }
}
```

#### DTOs (Data Transfer Objects)

**Rules**:

- SHOULD be classes (not interfaces or types)
- MUST use only primitive types (string, number, boolean, null)
- MUST have readonly properties
- MUST have a constructor for initialization
- MAY omit interface implementation (DTOs are data containers)

**Example**:

```typescript
// ✅ GOOD - Class DTO with readonly primitives
export class GameDTO {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly platform: string,
    public readonly format: string,
    public readonly purchaseDate: string | null,
    public readonly status: string,
  ) {}
}

// ❌ BAD - Interface or type DTO
export interface GameDTO {
  id: string;
  title: string;
  // ...
}
```

#### Mappers

**Rules**:

- MUST be static classes with static methods
- MUST implement bidirectional conversion (toDTO, toDomain)
- MUST handle validation errors in toDomain
- MUST return Result from toDomain

**Example**:

```typescript
export class GameMapper {
  static toDTO(game: Game): GameDTO {
    return new GameDTO(
      game.getId(),
      game.getTitle(),
      game.getDescription(),
      game.getPlatform(),
      game.getFormat(),
      game.getPurchaseDate()?.toISOString() ?? null,
      game.getStatus(),
    );
  }

  static toDomain(dto: GameDTO): Result<Game, ValidationError> {
    return Game.create({
      id: dto.id,
      title: dto.title,
      description: dto.description,
      platform: dto.platform,
      format: dto.format,
      purchaseDate: dto.purchaseDate ? new Date(dto.purchaseDate) : null,
      status: dto.status,
    });
  }
}
```

---

## Error Handling

### Result Pattern

**ALWAYS** use the Result pattern for operations that can fail:

```typescript
// ✅ GOOD - Using Result pattern
async save(game: Game): Promise<Result<void, RepositoryErrorInterface>> {
  try {
    // ... implementation
    return Result.ok();
  } catch (error) {
    return Result.fail(new UnknownError('Failed to save game'));
  }
}

// ❌ BAD - Throwing exceptions
async save(game: Game): Promise<void> {
  // ... implementation
  throw new Error('Failed to save game');
}
```

### Error Classes

**Rules**:

- MUST implement error interface (in `.d.ts` file)
- MUST extend Error class
- MUST provide meaningful error messages
- SHOULD include context (e.g., entity ID, field name)

**Example**:

```typescript
// File: NotFoundErrorInterface.d.ts
export interface NotFoundErrorInterface extends RepositoryErrorInterface {
  readonly type: 'NotFound';
  readonly entityId: string;
}

// File: NotFoundError.ts
export class NotFoundError extends Error implements NotFoundErrorInterface {
  readonly type = 'NotFound' as const;

  constructor(
    message: string,
    readonly entityId: string,
  ) {
    super(message);
    this.name = 'NotFoundError';
  }
}
```

---

## Dependency Injection

### Service Registration

**Rules**:

- MUST register implementations in `serviceCollection.ts`
- MUST bind to interfaces, not concrete classes
- MUST use symbols as identifiers
- MUST specify lifecycle (singleton, transient, scoped)

**Example**:

```typescript
// File: types.ts
export const TYPES = {
  IndexedDB: Symbol.for('IndexedDB'),
  GameRepository: Symbol.for('GameRepository'),
};

// File: serviceCollection.ts
import { Container } from 'inversify';

export const configureServices = (container: Container): void => {
  // Infrastructure services
  container
    .bind<IndexedDBInterface>(TYPES.IndexedDB)
    .toDynamicValue(() => new IndexedDB('GameCollectionDB', 1, 'games'))
    .inSingletonScope();

  // Repositories
  container
    .bind<GameRepositoryInterface>(TYPES.GameRepository)
    .toDynamicValue(ctx => new IndexedDBGameRepository(ctx.container.get<IndexedDBInterface>(TYPES.IndexedDB)))
    .inSingletonScope();
};
```

### Constructor Injection

**ALWAYS** use constructor injection with `@inject` decorator:

```typescript
export class AddGameToCollectionHandler implements AddGameToCollectionHandlerInterface {
  constructor(
    @inject(TYPES.GameRepository)
    private readonly gameRepository: GameRepositoryInterface,
  ) {}
}
```

---

## File Organization

### Naming Conventions

- **Interfaces**: `FooInterface.d.ts` (always suffix with `Interface`)
- **Classes**: `Foo.ts` (PascalCase, matches class name)
- **DTOs**: `FooDTO.ts` (suffix with `DTO`)
- **Mappers**: `FooMapper.ts` (suffix with `Mapper`)
- **Value Objects**: `Foo.ts` (PascalCase, descriptive name)

### Directory Structure

Follow the Clean Architecture layer structure:

```
src/
├── shared/                      # Shared kernel (cross-cutting)
│   ├── domain/
│   │   ├── repositories/
│   │   │   ├── RepositoryInterface.d.ts
│   │   │   └── error/
│   │   │       ├── NotFoundErrorInterface.d.ts
│   │   │       ├── NotFoundError.ts
│   │   │       └── ...
│   │   └── result/
│   │       └── Result.ts
│   └── infrastructure/
│       └── persistence/
│           ├── IndexedDBInterface.d.ts
│           └── IndexedDB.ts
└── collection/                  # Bounded context
    ├── domain/
    │   ├── entities/
    │   │   ├── GameInterface.d.ts
    │   │   └── Game.ts
    │   ├── value-objects/
    │   │   ├── GameTitleInterface.d.ts
    │   │   └── GameTitle.ts
    │   └── repositories/
    │       └── GameRepositoryInterface.d.ts
    ├── application/
    │   └── use-cases/
    │       ├── AddGameToCollectionHandlerInterface.d.ts
    │       └── AddGameToCollectionHandler.ts
    └── infrastructure/
        └── persistence/
            ├── IndexedDBGameRepository.ts
            ├── dtos/
            │   └── GameDTO.ts
            └── mappers/
                └── GameMapper.ts
```

---

## Code Quality Checklist

Before committing code, verify:

- [ ] All classes implement an interface
- [ ] All interfaces use `Interface` suffix (not `I` prefix)
- [ ] All interfaces and types are in `.d.ts` files
- [ ] DTOs are classes with readonly primitive properties
- [ ] All public methods have JSDoc comments
- [ ] Result pattern is used for error handling
- [ ] No infrastructure dependencies in domain layer
- [ ] Dependency injection is used properly
- [ ] SOLID principles are respected
- [ ] Code is DRY, KISS, and YAGNI compliant
- [ ] Tests are written and passing

---

## Common Anti-Patterns to Avoid

### ❌ Interface with `I` Prefix

```typescript
// BAD
export interface IGameRepository { ... }
```

### ❌ Interface in `.ts` File

```typescript
// BAD - GameRepository.ts
export interface GameRepositoryInterface { ... }
export class GameRepository implements GameRepositoryInterface { ... }
```

### ❌ Class Without Interface

```typescript
// BAD
export class GameRepository {
  // No interface implementation
}
```

### ❌ DTO as Interface

```typescript
// BAD
export interface GameDTO {
  id: string;
  title: string;
}
```

### ❌ Throwing Exceptions Instead of Result

```typescript
// BAD
async save(game: Game): Promise<void> {
  if (!game) {
    throw new Error('Game is required');
  }
}
```

### ❌ Domain Depending on Infrastructure

```typescript
// BAD - Domain entity importing from infrastructure
import { IndexedDB } from '@Infrastructure/persistence/IndexedDB';

export class Game {
  constructor(private db: IndexedDB) {} // WRONG!
}
```

---

## Examples

### Complete Feature Implementation

See the Game persistence feature as a reference implementation:

1. **Domain Layer**:
   - `GameInterface.d.ts` - Entity interface
   - `Game.ts` - Entity implementation
   - `GameRepositoryInterface.d.ts` - Repository contract

2. **Infrastructure Layer**:
   - `IndexedDBGameRepository.ts` - Repository implementation
   - `GameDTO.ts` - DTO class
   - `GameMapper.ts` - Bidirectional mapper

3. **DI Configuration**:
   - `types.ts` - Type symbols
   - `serviceCollection.ts` - Service registration

---

## References

- [Clean Architecture (Uncle Bob)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://www.domainlanguage.com/ddd/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Result Pattern](../docs/result-pattern.md)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)

---

**These instructions must be followed for all code in the domain, application, and infrastructure layers.**
