# Architecture Decision Records (ADRs)

This document serves as the **main index** for all architectural decisions made for the **lab-clean-architecture-react** project.

> **📂 All ADRs are now located in:** [`docs/architecture/adr/`](./docs/architecture/adr/)

---

## Quick Reference - All ADRs

| ADR                                                                                    | Title                       | Status      | Date       | Description                                                                         |
| -------------------------------------------------------------------------------------- | --------------------------- | ----------- | ---------- | ----------------------------------------------------------------------------------- |
| [ADR-001](./docs/architecture/adr/ADR-001-starter-template-selection.md)               | Starter Template Selection  | ✅ Accepted | 2026-01-14 | Use @pplancq/react-app for Rsbuild foundation and architectural freedom             |
| [ADR-002](./docs/architecture/adr/ADR-002-clean-architecture-ddd.md)                   | Clean Architecture + DDD    | ✅ Accepted | 2026-01-22 | Hybrid architecture with bounded contexts for scalability                           |
| [ADR-003](./docs/architecture/adr/ADR-003-indexeddb-storage-strategy.md)               | IndexedDB Storage           | ✅ Accepted | 2026-01-22 | Offline-first storage with structured data and fast queries                         |
| [ADR-004](./docs/architecture/adr/ADR-004-result-either-pattern.md)                    | Result/Either Pattern       | ✅ Accepted | 2026-02-03 | Type-safe error handling for domain operations                                      |
| [ADR-005](./docs/architecture/adr/ADR-005-inversifyjs-dependency-injection.md)         | InversifyJS DI              | ✅ Accepted | 2026-02-02 | Dependency injection for loose coupling between layers                              |
| [ADR-006](./docs/architecture/adr/ADR-006-pwa-from-day-one.md)                         | PWA from Day One            | ✅ Accepted | 2026-02-05 | Offline capabilities, installable app, performance optimization                     |
| [ADR-007](./docs/architecture/adr/ADR-007-no-typescript-decorators.md)                 | No TypeScript Decorators    | ✅ Accepted | 2026-02-09 | Manual DI binding to maintain domain purity and avoid decorator side effects        |
| [ADR-008](./docs/architecture/adr/ADR-008-result-pattern-usage-convention.md)          | Result Pattern Convention   | ✅ Accepted | 2026-02-09 | When to use Result vs throw: business errors vs programming errors                  |
| [ADR-009](./docs/architecture/adr/ADR-009-symbol-based-service-identifiers.md)         | Symbol-based Service IDs    | ✅ Accepted | 2026-02-23 | Symbols as DI identifiers to avoid coupling and circular imports                    |
| [ADR-010](./docs/architecture/adr/ADR-010-dto-date-type-conventions.md)                | DTO Date Type Conventions   | ✅ Accepted | 2026-02-23 | `Date` in application DTOs, `string \| null` in infrastructure DTOs                 |
| [ADR-011](./docs/architecture/adr/ADR-011-map-centric-store-auto-trigger.md)           | Map-Centric Store           | ✅ Accepted | 2026-03-02 | Observable store with Map-based state and auto-triggered fetches via queueMicrotask |
| [ADR-012](./docs/architecture/adr/ADR-012-page-layout-ownership-and-folder-pattern.md) | Page Layout Ownership       | ✅ Accepted | 2026-03-09 | Pages as autonomous layout-owning components + `<Name>/<Name>.tsx` convention       |
| [ADR-013](./docs/architecture/adr/ADR-013-in-memory-repository-for-transient-data.md)  | In-Memory Repository        | ✅ Accepted | 2026-03-11 | Synchronous `Result<T, never>` + referential stability for transient data           |
| [ADR-014](./docs/architecture/adr/ADR-014-infrastructure-id-generator.md)              | Infrastructure ID Generator | ✅ Accepted | 2026-03-11 | `IdGeneratorInterface` in domain, `CryptoIdGenerator` in infrastructure             |
| [ADR-015](./docs/architecture/adr/ADR-015-domain-validation-error-hierarchy.md)        | Domain Validation Errors    | ✅ Accepted | 2026-03-11 | `DomainValidationError` subclasses instead of plain error objects                   |

---

## By Category

### Foundation & Architecture (ADR-001, ADR-002)

- **ADR-001:** Starter template choice (Rsbuild, TypeScript strict)
- **ADR-002:** Clean Architecture + DDD Bounded Contexts structure

### Infrastructure & Storage (ADR-003, ADR-006)

- **ADR-003:** IndexedDB for offline-first data persistence
- **ADR-006:** PWA with Service Worker for offline capabilities

### Error Handling (ADR-004, ADR-008)

- **ADR-004:** Result/Either pattern implementation
- **ADR-008:** Convention for when to use Result vs throw

### Dependency Management (ADR-005, ADR-007, ADR-009)

- **ADR-005:** InversifyJS for dependency injection
- **ADR-007:** No decorators - manual binding only
- **ADR-009:** Symbol-based service identifiers to avoid coupling

### State Management (ADR-011)

- **ADR-011:** Map-centric observable store with auto-triggered fetches

### UI & Layout (ADR-012)

- **ADR-012:** Page layout ownership — pages as autonomous layout-owning components

### Toast Bounded Context (ADR-013, ADR-014, ADR-015)

- **ADR-013:** In-memory repository with `Result<T, never>` and referential stability
- **ADR-014:** `IdGeneratorInterface` abstraction for infrastructure-agnostic ID generation
- **ADR-015:** `DomainValidationError` hierarchy replacing plain error objects

---

## By Epic

### Pre-Epic 1 (Planning Phase)

- ADR-001: Starter Template Selection
- ADR-002: Clean Architecture + DDD
- ADR-003: IndexedDB Storage

### Epic 1 (Foundation & PWA)

- ADR-004: Result/Either Pattern
- ADR-005: InversifyJS DI
- ADR-006: PWA from Day One

### Epic 1 Retrospective

- ADR-007: No TypeScript Decorators (extends ADR-005)
- ADR-008: Result Pattern Convention (extends ADR-004)

### Epic 2 Retrospective

- ADR-009: Symbol-based Service Identifiers (extends ADR-005)
- ADR-010: DTO Date Type Conventions (extends ADR-002)

### Epic 2 — Story 2.6

- ADR-011: Map-Centric Store with Auto-Triggered Fetches

### Epic 2 Retro / Sprint 4

- ADR-012: Page Layout Ownership and Folder Pattern

### Issue #118 — Toast Bounded Context

- ADR-013: In-Memory Repository for Transient Data
- ADR-014: Infrastructure ID Generator Abstraction
- ADR-015: Domain Validation Error Hierarchy

---

## ADR Status Legend

- ✅ **Accepted:** Decision is implemented and active
- 🚧 **Proposed:** Under discussion, not yet implemented
- ⚠️ **Deprecated:** Superseded by another ADR
- 🔄 **Superseded:** Replaced by a newer ADR

---

## How to Create a New ADR

1. Create a new file: `docs/architecture/adr/ADR-XXX-title.md`
2. Use the standard template (see existing ADRs)
3. Include: Status, Date, Context, Decision, Consequences
4. Update this index (DECISIONS.md) with summary
5. Update `docs/architecture/adr/README.md`

---

## Related Documentation

- **Architecture docs:** [`docs/architecture/`](./docs/architecture/)
- **ADR directory:** [`docs/architecture/adr/`](./docs/architecture/adr/)
- **Planning artifacts:** [`_bmad-output/planning-artifacts/`](./_bmad-output/planning-artifacts/)
- **Epic retrospectives:** [`_bmad-output/implementation-artifacts/`](./_bmad-output/implementation-artifacts/)

---

**Last Updated:** 2026-03-12  
**Total ADRs:** 15 (All Accepted)  
**Author:** Paul (with AI assistance)  
**Project:** lab-clean-architecture-react
