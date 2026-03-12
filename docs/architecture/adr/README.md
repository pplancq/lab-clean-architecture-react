# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records (ADRs) for the Game Collection Manager project.

## What is an ADR?

An Architecture Decision Record (ADR) captures an important architectural decision made along with its context and consequences. ADRs help:

- **Document why decisions were made** (not just what was decided)
- **Prevent future debates** about already-decided topics
- **Onboard new team members** by explaining the reasoning behind choices
- **Track evolution** of architecture over time

## ADR Format

Each ADR follows this structure:

- **Status:** Accepted, Proposed, Deprecated, Superseded
- **Date:** When the decision was made
- **Context:** What is the issue we're seeing that is motivating this decision?
- **Decision:** What is the change that we're proposing/doing?
- **Consequences:** What becomes easier or more difficult to do because of this change?

## All ADRs

| ADR                                                              | Title                                             | Status      | Date       | Epic                    |
| ---------------------------------------------------------------- | ------------------------------------------------- | ----------- | ---------- | ----------------------- |
| [ADR-001](./ADR-001-starter-template-selection.md)               | Starter Template Selection (@pplancq/react-app)   | ✅ Accepted | 2026-01-14 | Pre-Epic 1              |
| [ADR-002](./ADR-002-clean-architecture-ddd.md)                   | Clean Architecture + DDD Bounded Contexts         | ✅ Accepted | 2026-01-22 | Pre-Epic 1              |
| [ADR-003](./ADR-003-indexeddb-storage-strategy.md)               | IndexedDB Storage Strategy                        | ✅ Accepted | 2026-01-22 | Pre-Epic 1              |
| [ADR-004](./ADR-004-result-either-pattern.md)                    | Result/Either Pattern for Error Handling          | ✅ Accepted | 2026-02-03 | Epic 1                  |
| [ADR-005](./ADR-005-inversifyjs-dependency-injection.md)         | InversifyJS for Dependency Injection              | ✅ Accepted | 2026-02-02 | Epic 1                  |
| [ADR-006](./ADR-006-pwa-from-day-one.md)                         | PWA from Day One                                  | ✅ Accepted | 2026-02-05 | Epic 1                  |
| [ADR-007](./ADR-007-no-typescript-decorators.md)                 | No TypeScript Decorators for Dependency Injection | ✅ Accepted | 2026-02-09 | Epic 1 Retro            |
| [ADR-008](./ADR-008-result-pattern-usage-convention.md)          | Result Pattern Usage Convention                   | ✅ Accepted | 2026-02-09 | Epic 1 Retro            |
| [ADR-009](./ADR-009-symbol-based-service-identifiers.md)         | Symbol-based Service Identifiers for DI           | ✅ Accepted | 2026-02-23 | Epic 2 Retro            |
| [ADR-010](./ADR-010-dto-date-type-conventions.md)                | Date Type Conventions in Application DTOs         | ✅ Accepted | 2026-02-23 | Epic 2 Retro            |
| [ADR-011](./ADR-011-map-centric-store-auto-trigger.md)           | Map-Centric Store with Auto-Triggered Fetches     | ✅ Accepted | 2026-03-02 | Epic 2 Story 2.6        |
| [ADR-012](./ADR-012-page-layout-ownership-and-folder-pattern.md) | Page Layout Ownership and Folder Pattern          | ✅ Accepted | 2026-03-09 | Epic 2 Retro / Sprint 4 |
| [ADR-013](./ADR-013-in-memory-repository-for-transient-data.md)  | In-Memory Repository for Transient Data           | ✅ Accepted | 2026-03-11 | Issue #118 Toast        |
| [ADR-014](./ADR-014-infrastructure-id-generator.md)              | Infrastructure ID Generator Abstraction           | ✅ Accepted | 2026-03-11 | Issue #118 Toast        |
| [ADR-015](./ADR-015-domain-validation-error-hierarchy.md)        | Domain Validation Error Hierarchy                 | ✅ Accepted | 2026-03-11 | Issue #118 Toast        |

## Pending ADRs

| Topic                               | Priority | Target Epic |
| ----------------------------------- | -------- | ----------- |
| PWA Architecture Pattern (detailed) | P2       | Epic 2+     |

## References

- [ADR GitHub Organization](https://adr.github.io/)
- [Michael Nygard's ADR Template](https://github.com/joelparkerhenderson/architecture-decision-record/blob/main/templates/decision-record-template-by-michael-nygard/index.md)
- [MADR - Markdown ADR](https://adr.github.io/madr/)
