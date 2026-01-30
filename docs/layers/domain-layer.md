# Domain Layer

## What is the Domain Layer?

The **Domain Layer** is the **heart of your application** where all business logic and rules reside. It is the **most important** and **most protected** layer in Clean Architecture.

> **Core Principle:** The Domain Layer must be **100% pure** - no external dependencies, no frameworks, no infrastructure concerns.

## Why Domain Purity Matters

### Portability

Pure domain code can be:

- Moved to any platform (Node.js, Deno, browser)
- Reused in different applications
- Tested without any setup or mocks

### Testability

Domain entities are the easiest to test:

```typescript
// No database, no HTTP, no framework - just pure logic
const game = new Game('id-123', 'The Legend of Zelda', new Date('1986-02-21'));
expect(game.getTitle()).toBe('The Legend of Zelda');
expect(game.isReleasedAfter(new Date('1985-01-01'))).toBe(true);
```

### Longevity

Frameworks come and go. Business rules remain.

- React → Vue → Svelte? Domain stays the same.
- REST → GraphQL → gRPC? Domain stays the same.
- SQL → NoSQL → IndexedDB? Domain stays the same.

---

## Domain Layer Contents

### 1. Entities

**Definition:** Objects with identity and lifecycle.

**Characteristics:**

- Have a unique identifier (ID)
- Can change state over time
- Contain business logic and validation

**Example:**

```typescript
// src/collection/domain/Game.ts
export class Game {
  constructor(
    private readonly id: string,
    private title: string,
    private readonly releaseDate: Date,
  ) {
    this.validateTitle(title);
  }

  private validateTitle(title: string): void {
    if (title.trim().length === 0) {
      throw new Error('Game title cannot be empty');
    }
    if (title.length > 200) {
      throw new Error('Game title cannot exceed 200 characters');
    }
  }

  getId(): string {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }

  updateTitle(newTitle: string): void {
    this.validateTitle(newTitle);
    this.title = newTitle;
  }

  isReleasedAfter(date: Date): boolean {
    return this.releaseDate > date;
  }
}
```

### 2. Value Objects

**Definition:** Immutable objects defined by their attributes, not identity.

**Characteristics:**

- No unique identifier
- Immutable (create new instances for changes)
- Equality based on values, not reference
- Contain validation logic

**Example:**

```typescript
// src/collection/domain/GameTitle.ts
export class GameTitle {
  private readonly value: string;

  constructor(title: string) {
    this.validate(title);
    this.value = title.trim();
  }

  private validate(title: string): void {
    if (title.trim().length === 0) {
      throw new Error('Game title cannot be empty');
    }
    if (title.length > 200) {
      throw new Error('Game title cannot exceed 200 characters');
    }
  }

  toString(): string {
    return this.value;
  }

  equals(other: GameTitle): boolean {
    return this.value === other.value;
  }
}
```

### 3. Domain Services

**Definition:** Operations that don't naturally fit into entities or value objects.

**When to use:**

- Logic involves multiple entities
- Stateless operations
- Business rules spanning aggregates

**Example:**

```typescript
// src/collection/domain/CollectionService.ts
import { Game } from './Game';
import { Console } from './Console';

export class CollectionService {
  calculateCollectionValue(games: Game[], pricingStrategy: IPricingStrategy): number {
    return games.reduce((total, game) => {
      return total + pricingStrategy.getPrice(game);
    }, 0);
  }

  canAddGameToConsole(game: Game, console: Console): boolean {
    // Business rule: Game must be compatible with console
    return console.getSupportedFormats().includes(game.getFormat());
  }
}
```

### 4. Repository Interfaces

**Definition:** Contracts for data persistence, defined in Domain but implemented in Infrastructure.

**Example:**

```typescript
// src/collection/domain/IGameRepository.ts
import { Game } from './Game';

export interface IGameRepository {
  save(game: Game): Promise<void>;
  findById(id: string): Promise<Game | null>;
  findAll(): Promise<Game[]>;
  delete(id: string): Promise<void>;
}
```

**Important:** The Domain defines the **contract**, Infrastructure provides the **implementation**.

### 5. Domain Events

**Definition:** Events representing something significant that happened in the domain.

**Example:**

```typescript
// src/collection/domain/events/GameAddedToCollection.ts
export class GameAddedToCollection {
  constructor(
    public readonly gameId: string,
    public readonly collectionId: string,
    public readonly addedAt: Date,
  ) {}
}
```

---

## Absolute Rules for Domain Purity

### ✅ ALLOWED

1. **TypeScript primitives and utilities**

   ```typescript
   string, number, boolean, Date
   Record, Partial, Pick, Omit, etc.
   ```

2. **Other domain entities/value objects**

   ```typescript
   import { Game } from './Game';
   import { GameTitle } from './GameTitle';
   ```

3. **Shared domain primitives**

   ```typescript
   import { EntityId } from '../../../shared/domain/EntityId';
   ```

4. **Pure TypeScript libraries (rare exceptions)**
   - Only if absolutely necessary
   - Must be pure functions (no side effects)
   - Example: `uuid` for ID generation (consider alternatives)

### ❌ FORBIDDEN

1. **React or any UI framework**

   ```typescript
   ❌ import React from 'react';
   ❌ import { useState } from 'react';
   ```

2. **External libraries**

   ```typescript
   ❌ import axios from 'axios';
   ❌ import { format } from 'date-fns';
   ❌ import _ from 'lodash';
   ```

3. **Framework decorators**

   ```typescript
   ❌ import { injectable } from 'inversify';
   ❌ import { IsNotEmpty } from 'class-validator';
   ```

4. **Infrastructure code**

   ```typescript
   ❌ import { GameRepositoryIndexedDB } from '../infrastructure/GameRepositoryIndexedDB';
   ```

5. **Application code**

   ```typescript
   ❌ import { AddGameToCollection } from '../application/AddGameToCollection';
   ```

6. **Node.js modules**
   ```typescript
   ❌ import fs from 'fs';
   ❌ import http from 'http';
   ```

---

## Common Pitfalls and Solutions

### Pitfall 1: "I need to format a date"

**❌ BAD:**

```typescript
import { format } from 'date-fns';

export class Game {
  getFormattedReleaseDate(): string {
    return format(this.releaseDate, 'yyyy-MM-dd');
  }
}
```

**✅ GOOD:**

```typescript
// Domain: Return raw Date, let UI format it
export class Game {
  getReleaseDate(): Date {
    return this.releaseDate;
  }
}

// UI: Format the date
const formattedDate = format(game.getReleaseDate(), 'yyyy-MM-dd');
```

### Pitfall 2: "I need to validate with a library"

**❌ BAD:**

```typescript
import { IsEmail } from 'class-validator';

export class User {
  @IsEmail()
  private email: string;
}
```

**✅ GOOD:**

```typescript
export class Email {
  private readonly value: string;

  constructor(email: string) {
    this.validate(email);
    this.value = email;
  }

  private validate(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
  }

  toString(): string {
    return this.value;
  }
}
```

### Pitfall 3: "I need to call an API"

**❌ BAD:**

```typescript
import axios from 'axios';

export class Game {
  async fetchMetadata(): Promise<void> {
    const response = await axios.get(`/api/games/${this.id}`);
    this.metadata = response.data;
  }
}
```

**✅ GOOD:**

```typescript
// Domain: Define the contract
export interface IGameMetadataService {
  fetchMetadata(gameId: string): Promise<GameMetadata>;
}

// Infrastructure: Implement with axios
export class GameMetadataServiceHTTP implements IGameMetadataService {
  async fetchMetadata(gameId: string): Promise<GameMetadata> {
    const response = await axios.get(`/api/games/${gameId}`);
    return response.data;
  }
}
```

### Pitfall 4: "I need to persist data"

**❌ BAD:**

```typescript
import { openDB } from 'idb';

export class Game {
  async save(): Promise<void> {
    const db = await openDB('GameDB', 1);
    await db.put('games', this);
  }
}
```

**✅ GOOD:**

```typescript
// Domain: Define repository interface
export interface IGameRepository {
  save(game: Game): Promise<void>;
}

// Infrastructure: Implement with IndexedDB
export class GameRepositoryIndexedDB implements IGameRepository {
  async save(game: Game): Promise<void> {
    const db = await openDB('GameDB', 1);
    await db.put('games', { id: game.getId(), title: game.getTitle() });
  }
}
```

---

## Testing Domain Layer

### Unit Tests Should Be Simple

```typescript
// tests/unit/collection/domain/Game.test.ts
import { describe, it, expect } from 'vitest';
import { Game } from '@/collection/domain/Game';

describe('Game', () => {
  it('should create a valid game', () => {
    const game = new Game('id-123', 'Zelda', new Date('1986-02-21'));

    expect(game.getId()).toBe('id-123');
    expect(game.getTitle()).toBe('Zelda');
  });

  it('should throw error for empty title', () => {
    expect(() => {
      new Game('id-123', '', new Date());
    }).toThrow('Game title cannot be empty');
  });

  it('should update title when valid', () => {
    const game = new Game('id-123', 'Zelda', new Date());

    game.updateTitle('The Legend of Zelda');

    expect(game.getTitle()).toBe('The Legend of Zelda');
  });
});
```

**Notice:**

- No mocks
- No setup/teardown
- Pure logic testing
- Fast execution (<1ms per test)

---

## Domain Layer Checklist

Before committing domain code, verify:

- [ ] Zero `import` statements from external libraries
- [ ] No React imports
- [ ] No axios, lodash, or utility libraries
- [ ] No framework decorators (@injectable, @IsNotEmpty)
- [ ] No database or HTTP code
- [ ] Only imports from same domain or shared domain
- [ ] All business rules are in domain entities/services
- [ ] Repository interfaces defined (not implementations)
- [ ] All tests run without mocks or external dependencies

---

## Benefits of Domain Purity

### 1. Testability

```typescript
// 100% test coverage with zero mocks
const game = new Game('id', 'title', new Date());
expect(game.isValid()).toBe(true);
```

### 2. Portability

```typescript
// Same domain code works in Node.js, Deno, browser, React Native
export class Game {
  /* ... */
}
```

### 3. Framework Independence

```typescript
// Switch from React to Vue? Domain stays identical
export class Game {
  /* ... */
}
```

### 4. Business Logic Clarity

```typescript
// No framework noise, pure business rules
export class Game {
  canBeRentedTo(user: User): boolean {
    return user.getAge() >= this.getMinimumAge();
  }
}
```

---

## Summary

The Domain Layer is:

- ✅ **Pure:** No external dependencies
- ✅ **Focused:** Business logic only
- ✅ **Testable:** Simple unit tests
- ✅ **Portable:** Works anywhere TypeScript runs
- ✅ **Long-lived:** Survives framework changes

**Remember:** If you're tempted to import a library into the Domain, ask yourself: "Is this **really** business logic, or is it a technical concern?"

If it's technical → move it to Infrastructure.

---

## References

- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design - Eric Evans](https://www.domainlanguage.com/ddd/)
- [Dependency Rules](../architecture/dependency-rules.md)
- [Folder Structure](../architecture/folder-structure.md)
