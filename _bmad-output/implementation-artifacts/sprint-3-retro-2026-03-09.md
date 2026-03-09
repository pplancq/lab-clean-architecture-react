# Sprint 3 Retrospective — Complete Collection CRUD & UX Foundation

**Sprint:** Sprint 3 (2026-02-24 → 2026-03-09)
**Epic:** #8 — Core Game Collection Management (final stories 2.5–2.8)
**Retrospective Date:** 2026-03-09
**Type:** Sprint Retrospective + Epic 2 Completion
**Team:** Paul (Solo Developer)
**Facilitator:** Bob (Scrum Master)

---

## Executive Summary

Sprint 3 achieved **100% committed delivery** — all 8 committed items closed. Epic 2 is now **fully complete**. The GamesStore architecture proved to be a force-multiplier: once established as a high-level orchestrator, the remaining CRUD stories flowed rapidly. The sprint also produced an unexpected but valuable output: a full UX session with Sally yielding wireframe v4 and Epic 9 (17 stories). Technical debt surfaced mid-sprint (#164) was identified, created, and resolved within the same sprint.

**Highlights:**
- ✅ 8/8 committed stories delivered (100% velocity)
- ✅ Epic 2 FULLY COMPLETE (8/8 stories across Sprint 2–3)
- ✅ Triple Sonar kill on Day 1 (Sprint 2 carry-overs resolved immediately)
- ✅ TS #164 born and closed within the sprint
- ✅ UX session with Sally → Wireframe v4 + Epic 9 (17 stories created)
- ⚠️ Stretch goals not started (ADR-011, pages-folder-fix, shelter-ui migrations)
- ⚠️ UI layer remains behind — catch-up sprint needed before Epic 3

---

## Sprint 3 Completion Status

### Committed Items — 8/8 (100%)

| # | Item | Issue | PR | Merged | Notes |
|---|------|-------|----|--------|-------|
| Sonar | globalThis fix | #62 | #124 | 2026-02-24 (Day 1) | Carry-over from Sprint 2 |
| Sonar | Top-level await | #65 | #126 | 2026-02-24 (Day 1) | Carry-over from Sprint 2 |
| Sonar | IndexedDB Error objects | #106 | #125 | 2026-02-24 (Day 1) | Discovered Sprint 2, resolved Sprint 3 Day 1 |
| 2.5 | GetGames + GameList | #13 | #152 | 2026-02-27 | Observable Store + `useSyncExternalStore` |
| 2.6 | GetGameById + GameDetail | #14 | #157 | 2026-03-02 | Map-centric store, `isLazy` pattern, ADR-011 |
| 2.7 | EditGame Use Case + UI | #15 | #159 | 2026-03-03 | `setEntry` unified writes, hybrid error model |
| 2.8 | DeleteGame + Confirmation | #16 | #163 | 2026-03-05 | Native `<dialog>`, no external dep |
| TS | AddGame → GamesStore | #164 | #165 | 2026-03-05 | Born mid-sprint, closed mid-sprint |

### Stretch Goals — 0/4 (not started, expected given capacity)

| Item | Issue | Reason not started |
|------|-------|--------------------|
| ADR-011 page/layout ownership | — | Deprioritized after UX session scope expanded |
| pages-folder-pattern-fix | — | Time consumed by other subjects |
| Migrate SelectField to shelter-ui | #116 | Deferred |
| Migrate TextAreaField to shelter-ui | #115 | Deferred |

### Unplanned Work Completed

| Item | Notes |
|------|-------|
| UX session with Sally | Wireframe v4 (969 elements, 5 screens × 3 breakpoints) |
| Epic 9 creation | 17 stories #129–#145 created + GitHub issues + sprint-status updated |
| Theme configuration | `chore(ui): add theme configuration and UI component templates` (2026-02-25) |

---

## Sprint Timeline

```
Feb 24 (Day 1)  : ✅ Sonar #62 + #65 + #106 — PR #124, #126, #125 (triple kill!)
Feb 25 (Day 2)  : 📐 UX Session with Sally — Wireframe v4 + Epic 9 (17 stories)
                  🎨 Theme configuration committed
Feb 27 (Day 4)  : ✅ Story 2.5 GetGames + GamesStore — PR #152
Mar 02 (Day 7)  : ✅ Story 2.6 GetGameById + Map-centric store ADR — PR #157
Mar 03 (Day 8)  : ✅ Story 2.7 EditGame — PR #159
Mar 05 (Day 10) : ✅ Story 2.8 DeleteGame — PR #163
                  ✅ TS #164 AddGame → GamesStore — PR #165
Mar 06–08       :    Automated dependency updates (Renovate + Dependabot)
```

**Key observation:** The GamesStore architecture established in Story 2.5 unlocked rapid delivery of 2.6, 2.7, and 2.8 — three stories merged in 3 days.

---

## What Went Well

### 1. GamesStore — The Architecture Game-Changer

The `GamesStore` as a high-level orchestrator (not a simple state container) transformed the application layer. Once the store was established with `useSyncExternalStore`, the remaining CRUD stories (2.6, 2.7, 2.8) became straightforward: each use case plugged into a pre-built observable infrastructure. The components became pure consumers with no responsibility for data lifecycle.

Key patterns that proved their value:
- `queueMicrotask` for auto-trigger (fetch launched after current render, no component-side `useEffect`)
- `isLazy` to distinguish partial (list) vs complete (detail) data — prevents unnecessary re-fetches
- `commit(gamesChanged)` for stable references — avoids unnecessary re-renders during loading transitions
- `useGamesSelector` vs `useGamesStore` separation — granular subscriptions vs action dispatch

### 2. Triple Sonar Kill on Day 1

Three Sonar issues (two carry-overs from Sprint 2, one discovered during Sprint 2) were resolved on the very first day. Clearing debt before opening new features sets a clean foundation and demonstrates consistent hygiene discipline.

### 3. Mid-Sprint Technical Debt Identified, Scoped, and Resolved

Story #164 (`AddGame → GamesStore` integration) was identified as a gap mid-sprint, immediately created as an issue, estimated, added to the sprint commitment, and closed in the same sprint (PR #165, Mar 5). The debt lifecycle from discovery to resolution took less than 2 weeks. This is the ideal behavior for technical debt management.

### 4. Session UX with Sally — Epic 9 Born Proactively

The UX session (Feb 24–25) was not just a wireframe exercise — it produced:
- Wireframe v4 (969 elements, 5 screens × 3 breakpoints, fully responsive)
- Atomic Design component inventory
- GitHub Epic #128 with 17 linked stories (#129–#145)
- New issue template for UI stories
- Sprint-status.yaml updated with Epic 9

This transforms the upcoming UI catch-up sprint from "ad-hoc" to "fully specified".

### 5. Native `<dialog>` for ConfirmDialog (Story 2.8)

Using the native `<dialog>` element rather than a custom modal implementation provided focus trap, `aria-modal`, and `::backdrop` for free — no external dependency, no complex ARIA wiring, fully WCAG 2.2 / RGAA 4 compliant. This is the correct architectural choice.

### 6. Hybrid Error Model — Observable + Imperative

The distinction between entity state (via `commit`, observable) and mutation errors (via `Promise<Result>`, imperative) was validated across three stories (2.6, 2.7, 2.8). Mutation errors are transient — they don't need to pollute the store state and require no cleanup. The pattern is now a documented convention.

### 7. Iterative Architectural Clarity (Story 2.7)

Story 2.7 evolved through multiple refactoring passes during implementation: use case that recreated the entity → entity update methods → `setEntry` unified writes. Each iteration improved readability without breaking tests. The behavioral test suite served as a reliable safety net for this style of progressive refinement.

---

## What Didn't Go Well / Improvement Areas

### 1. UI Layer Significantly Behind

The UI is currently below the quality standard set by the wireframes. Components like `GameList`, `GameDetail`, `EditGame` exist but were built without the benefit of the v4 wireframes (which weren't created yet). The consequence: the next sprint must be a UI catch-up before Epic 3 can begin productively.

**Root cause:** Architecture-first approach was correct for stability, but created a visible gap between the functional layer and the visual layer. This was an anticipated trade-off, not an oversight.

### 2. Stretch Goals Carried Over (2nd Sprint)

ADR-011, pages-folder-pattern-fix, and shelter-ui migrations have now been deferred across two consecutive sprints (Sprint 2 and Sprint 3). Items that are never started are signals — either they need to be formally committed in the next sprint, or explicitly de-prioritized.

### 3. `AddGame` Notification to GamesStore Still Pending

After completing `GamesStore`, `AddGameUseCase` still does not notify the store after a successful add. The game list does not auto-refresh after adding a game. This was flagged as "HIGH priority — blocking for basic UX" in the story notes but not resolved as part of this sprint. It must be prioritized.

---

## Key Architectural Decisions Made This Sprint

| Decision | Story | Summary |
|----------|-------|---------|
| GamesStore as high-level orchestrator | 2.5 | Auto-trigger via `queueMicrotask`, `useSyncExternalStore`, no public fetch methods |
| Map-centric store with `isLazy` | 2.6 | Distinguishes partial vs complete game data in the store map |
| `hasError + error` uniform pattern | 2.6 | `error: null + hasError: true` = 404; `error: 'msg' + hasError: true` = technical error |
| Hybrid error model | 2.6/2.7 | Observable for entity state, imperative for transient mutation errors |
| `setEntry` unified write method | 2.7 | Single method for all map writes, `commit?:boolean` optional |
| `private static` = anti-pattern | 2.8 | Instance method with `eslint-disable` is correct; `private static` bypasses `class-methods-use-this` |
| Native `<dialog>` for modals | 2.8 | Focus trap + `aria-modal` for free, no library required |
| `<T,>` trailing comma in `.tsx` | 2.5 | Required for generics in TSX files to avoid JSX ambiguity |

---

## Technical Debt Backlog (from Story Notes)

| Priority | Item | Source | Notes |
|----------|------|--------|-------|
| 🔴 HIGH | AddGame → GamesStore notification | Story 2.5/2.6 | List doesn't refresh after add — blocking UX |
| 🟠 MED | Pagination strategy | Story 2.5 | Dedicated story: classic / infinite / hybrid |
| 🟠 MED | Cache/TTL/Refetch for GamesStore | Story 2.6 | TS recommended: `isStale`, `invalidate(id?)`, TTL |
| 🟡 LOW | Optimistic Update for EditGame | Story 2.7 | Apply → persist → rollback model |
| 🟡 LOW | ConfirmDialog → shelter-ui | Story 2.8 | Migrate during UI catch-up sprint |
| 🟡 LOW | GameCover placeholder | Story 2.5 | Needed when game covers are added |
| 🟡 LOW | ADR-011: Page/Layout Ownership | Sprint 3 deferred | Post-Sally session decision pending |
| 🟡 LOW | pages-folder-pattern-fix | Sprint 3 deferred | Home + AddGame → `<Name>/<Name>.tsx` |

---

## Next Sprint Proposal (Sprint 4) — UI Catch-Up

**Goal:** Bridge the gap between the functional Epic 2 layer and the wireframe v4 design. Build the P0 components from Epic 9 that are required for the Collection screens.

**Rationale:** Epic 2 (Collection CRUD) is feature-complete at the use case level but the UI presentation does not match the validated wireframes. Rather than building Epic 3 on a UI foundation that will require rework, Sprint 4 should stabilize the UI layer first.

### Approach
1. **Implement Epic 9 P0 components** needed by Epic 2 screens (GameList, GameDetail, AddGame, EditGame)
2. **Integrate those components** into existing Epic 2 pages
3. **Fix AddGame → GamesStore notification** (HIGH tech debt, blocking UX)
4. **Pick up remaining Epic 9 stories** if additional Epic 9 components are identified as blockers

### Epic 9 P0 Candidates for Sprint 4

| Story | Issue | Component | Used by Epic 2? |
|-------|-------|-----------|-----------------|
| 9.0 | #130 | FormatToggle | ✅ AddGame form |
| 9.1 | #129 | AppShell | ✅ All pages |
| 9.2 | #131 | TopBar | ✅ All pages |
| 9.3 | #132 | BurgerMenuDrawer | ✅ Mobile nav |
| 9.4 | #133 | GameCover | ✅ GameCard, GameDetail |
| 9.5 | #134 | Badge + BadgeRow | ✅ Platform/Status display |
| 9.6 | #135 | GameCard | ✅ GameList |

**Note:** The P1 components (FilterChip, SearchInput, SortSelect, FilterBar) are needed for Epic 3. They can either be carried into Sprint 4 as stretch, or form the core of Sprint 5.

---

## Actions for Next Sprint Planning

| # | Action | Owner | Priority |
|---|--------|-------|----------|
| 1 | Formally commit ADR-011 or de-prioritize it | Bob + Paul | Before SP |
| 2 | Create story: AddGame → GamesStore notification | Bob | Sprint 4 committed |
| 3 | Plan Sprint 4 as UI catch-up (Epic 9 P0 + Epic 2 integration) | Bob | Sprint 4 |
| 4 | Evaluate pages-folder-pattern-fix: commit or defer indefinitely | Paul | Sprint 4 |
| 5 | Create TS story: Cache/TTL/Refetch for GamesStore | Bob | Sprint 4 stretch or Sprint 5 |

---

## Metrics

| Metric | Sprint 3 | Sprint 2 | Sprint 1 |
|--------|----------|----------|----------|
| Committed delivered | 8/8 (100%) | 6/7 (86%) | 8/8 (100%) |
| Stretch delivered | 0/4 (0%) | 0/3 (0%) | n/a |
| Unplanned completed | 3 items | 1 item | 2 items |
| Sonar issues resolved | 3 | 2 | 0 |
| New epics discovered | 1 (Epic 9) | 0 | 0 |
| ADRs created | 0 (ADR-011 pending) | 2 (ADR-009, ADR-010) | 3 |
| Stories with dev notes | 4 | 4 | 5 |

---

## Satisfaction

> *Paul:* "Je suis plutôt satisfait de l'implémentation et la tournure que prend ce lab autour de la clean archi. L'UI est à revoir, mais maintenant que l'on a un wireframe fait avec l'UX cela devrait aller bien mieux."

The architectural foundation (Clean Architecture + GamesStore + Result pattern) is solid. The upcoming UI catch-up sprint will close the visual gap without requiring any domain or application layer changes — which is precisely the promise of Clean Architecture: UI is replaceable without touching business logic.

---

*Facilitated by Bob (Scrum Master) — 2026-03-09*
