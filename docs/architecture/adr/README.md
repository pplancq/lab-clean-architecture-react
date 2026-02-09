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

| ADR                                                      | Title                                             | Status      | Date       | Epic         |
| -------------------------------------------------------- | ------------------------------------------------- | ----------- | ---------- | ------------ |
| [ADR-001](./ADR-001-starter-template-selection.md)       | Starter Template Selection (@pplancq/react-app)   | ✅ Accepted | 2026-01-14 | Pre-Epic 1   |
| [ADR-002](./ADR-002-clean-architecture-ddd.md)           | Clean Architecture + DDD Bounded Contexts         | ✅ Accepted | 2026-01-22 | Pre-Epic 1   |
| [ADR-003](./ADR-003-indexeddb-storage-strategy.md)       | IndexedDB Storage Strategy                        | ✅ Accepted | 2026-01-22 | Pre-Epic 1   |
| [ADR-004](./ADR-004-result-either-pattern.md)            | Result/Either Pattern for Error Handling          | ✅ Accepted | 2026-02-03 | Epic 1       |
| [ADR-005](./ADR-005-inversifyjs-dependency-injection.md) | InversifyJS for Dependency Injection              | ✅ Accepted | 2026-02-02 | Epic 1       |
| [ADR-006](./ADR-006-pwa-from-day-one.md)                 | PWA from Day One                                  | ✅ Accepted | 2026-02-05 | Epic 1       |
| [ADR-007](./ADR-007-no-typescript-decorators.md)         | No TypeScript Decorators for Dependency Injection | ✅ Accepted | 2026-02-09 | Epic 1 Retro |
| [ADR-008](./ADR-008-result-pattern-usage-convention.md)  | Result Pattern Usage Convention                   | ✅ Accepted | 2026-02-09 | Epic 1 Retro |

## Pending ADRs

| Topic                               | Priority | Target Epic |
| ----------------------------------- | -------- | ----------- |
| PWA Architecture Pattern (detailed) | P2       | Epic 2+     |
| IndexedDB Schema Migration Strategy | P1       | Epic 2      |
| Component Architecture Pattern      | P1       | Epic 2      |

## References

- [ADR GitHub Organization](https://adr.github.io/)
- [Michael Nygard's ADR Template](https://github.com/joelparkerhenderson/architecture-decision-record/blob/main/templates/decision-record-template-by-michael-nygard/index.md)
- [MADR - Markdown ADR](https://adr.github.io/madr/)
