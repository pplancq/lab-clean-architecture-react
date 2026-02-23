# ADR-010: Date Type Conventions in Application DTOs

**Status:** ✅ Accepted  
**Date:** 2026-02-23  
**Deciders:** Paul (Lead Developer)  
**Related Epic:** Epic 2 - Game Collection Infrastructure  
**Related Stories:** Story 2.2 - IndexedDB Persistence, Story 2.3 - AddGame Use Case  
**Related ADR:** ADR-002 (Clean Architecture layers)

---

## Context

Data Transfer Objects (DTOs) carry data between architectural layers. The project uses two categories of DTOs:

- **Application DTOs** (e.g., `AddGameDTO`): Transfer data from the Presentation layer (React, React Hook Form) to the Application layer (use cases).
- **Infrastructure DTOs** (e.g., `GameDTO`): Transfer data from the Application layer to the Infrastructure layer (IndexedDB, REST APIs, serialized storage).

For date fields, TypeScript/JavaScript offers multiple representations:

| Type                 | Example                  | Serializable | Notes                                              |
| -------------------- | ------------------------ | ------------ | -------------------------------------------------- |
| `Date`               | `new Date('2026-02-23')` | ❌           | Native JS object, not JSON/IndexedDB-safe          |
| `string` ISO 8601    | `'2026-02-23'`           | ✅           | Portable, timezone-explicit, universally supported |
| `number` (timestamp) | `1740268800000`          | ✅           | Compact but unreadable                             |

Without a clear convention, different DTOs may use inconsistent date representations, causing implicit conversions and potential timezone bugs across layers.

---

## Decision

The date type depends on the **serialization boundary** being crossed:

| Layer Boundary               | DTO Type                             | Date Field Type  | Reason                                                   |
| ---------------------------- | ------------------------------------ | ---------------- | -------------------------------------------------------- |
| Presentation → Application   | Application DTO (e.g., `AddGameDTO`) | `Date \| null`   | Same JS runtime — no serialization needed                |
| Application → Infrastructure | Infrastructure DTO (e.g., `GameDTO`) | `string \| null` | Crosses serialization boundary (IndexedDB, API, network) |

---

### Rule 1: Application DTOs use `Date | null`

Application DTOs transfer data between the Presentation layer and the Application layer. Both run in the same JavaScript runtime — no serialization occurs. Using native `Date` objects is ergonomic, avoids redundant string parsing, and leverages the full JS Date API where needed.

```typescript
// ✅ CORRECT: Application DTO — Presentation to Application layer
export class AddGameDTO {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly platform: string,
    public readonly format: string,
    public readonly purchaseDate: Date | null, // Native Date — same runtime, no serialization
    public readonly status: string,
  ) {}
}
```

---

### Rule 2: Infrastructure DTOs use `string | null` (ISO 8601)

Infrastructure DTOs transfer data across a serialization boundary to IndexedDB, REST APIs, or any persistent storage. `Date` objects are not natively serializable — JSON serializes them to strings, and IndexedDB stores them as-is but retrieves them inconsistently across environments. ISO 8601 strings (`'YYYY-MM-DD'`) are portable, timezone-safe, and unambiguous.

```typescript
// ✅ CORRECT: Infrastructure DTO — Application to Infrastructure layer
export class GameDTO {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly platform: string,
    public readonly format: string,
    public readonly purchaseDate: string | null, // ISO 8601 — crosses serialization boundary
    public readonly status: string,
  ) {}
}
```

---

### Rule 3: The Mapper owns all `Date ↔ string` conversions

The **Mapper** is the single responsible unit for converting between `Date` (domain/application) and `string` (infrastructure). This centralizes conversion logic and prevents it from leaking into use cases, repositories, or UI components.

```typescript
export class GameMapper {
  // Domain Entity → Infrastructure DTO  (Date → ISO string)
  static toDTO(game: Game): GameDTO {
    return new GameDTO(
      game.getId(),
      game.getTitle(),
      game.getDescription(),
      game.getPlatform(),
      game.getFormat(),
      game.getPurchaseDate()?.toISOString().split('T')[0] ?? null, // Date → 'YYYY-MM-DD'
      game.getStatus(),
    );
  }

  // Infrastructure DTO → Domain Entity  (ISO string → Date)
  static toDomain(dto: GameDTO): Result<Game, ValidationError> {
    return Game.create({
      id: dto.id,
      title: dto.title,
      description: dto.description,
      platform: dto.platform,
      format: dto.format,
      purchaseDate: dto.purchaseDate ? new Date(dto.purchaseDate) : null, // 'YYYY-MM-DD' → Date
      status: dto.status,
    });
  }
}
```

---

## Examples

### ✅ CORRECT: React Hook Form → Application DTO → Use Case

```typescript
// GameForm.tsx — Presentation layer
const handleSubmit = async (formData: GameFormData) => {
  const dto = new AddGameDTO(
    crypto.randomUUID(),
    formData.title,
    formData.description,
    formData.platform,
    formData.format,
    formData.purchaseDate ? new Date(formData.purchaseDate) : null, // string input → Date
    formData.status,
  );
  await addGameUseCase.execute(dto); // Use case receives Date — correct
};
```

### ❌ INCORRECT: Using `string` in Application DTO

```typescript
// ❌ BAD: String in Application DTO forces parsing inside the use case
export class AddGameDTO {
  constructor(
    public readonly purchaseDate: string | null, // Wrong — forces date parsing in business logic
  ) {}
}

// Use case now polluted with infrastructure concerns:
const date = dto.purchaseDate ? new Date(dto.purchaseDate) : null; // Should not be here
```

### ❌ INCORRECT: Using `Date` in Infrastructure DTO

```typescript
// ❌ BAD: Date object at the serialization boundary
export class GameDTO {
  constructor(
    public readonly purchaseDate: Date | null, // Unsafe — IndexedDB/JSON serialization is inconsistent
  ) {}
}
// IndexedDB may store the Date correctly but return it as a string on retrieval,
// causing silent type inconsistencies that are hard to debug.
```

---

## Consequences

### Positive

✅ **Ergonomic Presentation layer:** React Hook Form → Application DTO uses native `Date` (no redundant parsing in business logic)  
✅ **Safe storage boundary:** ISO 8601 strings are portable across IndexedDB, JSON serialization, and REST APIs  
✅ **Single conversion point:** Mappers own all `Date ↔ string` conversions — no leakage into use cases or UI  
✅ **Clear layer contract:** The DTO type signals which boundary is being crossed  
✅ **Timezone safety:** ISO 8601 `'YYYY-MM-DD'` avoids timezone offset issues from `Date.toISOString()` (which outputs UTC)

### Negative

⚠️ **Two DTOs for the same entity:** `AddGameDTO` and `GameDTO` have similar fields but different date types — developers must be aware of which to use  
⚠️ **Mapper conversion required:** Extra code in mapper methods for every date field

### Mitigation

- **Naming convention:** `AddGameDTO` (command/input), `GameDTO` (persistence/storage) — different purposes are evident from the name
- **Inline documentation:** Both DTO files carry comments explaining the date handling choice
- **Mapper tests:** All `Date ↔ string` conversions are covered by mapper unit tests

---

## Related Decisions

- [ADR-002](./ADR-002-clean-architecture-ddd.md): Clean Architecture + DDD (establishes layer boundaries)
- [ADR-008](./ADR-008-result-pattern-usage-convention.md): Result Pattern Usage Convention

---

## References

- Application DTO: `src/collection/application/dtos/AddGameDTO.ts`
- Infrastructure DTO: `src/collection/infrastructure/persistence/dtos/GameDTO.ts`
- Mapper implementation: `src/collection/infrastructure/persistence/mappers/GameMapper.ts`
- Clean Architecture layers: `docs/architecture/dependency-rules.md`
- Epic 2 Retrospective: `_bmad-output/implementation-artifacts/epic-2-retro-2026-02-23.md`

---

## Revision History

| Date       | Version | Author | Changes                                             |
| ---------- | ------- | ------ | --------------------------------------------------- |
| 2026-02-23 | 1.0     | Paul   | Initial ADR creation following Epic 2 retrospective |
