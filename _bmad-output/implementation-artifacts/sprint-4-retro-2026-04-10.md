# Sprint 4 Retrospective — UI Catch-up & Toast System

**Sprint:** Sprint 4 (2026-03-10 → 2026-03-23)
**Retrospective Date:** 2026-04-10 *(+18 days after official end — deliberate pause)*
**Goal:** Implement Epic 9 P0 components required for Epic 2 pages, deliver Epic 8 Toast System, apply pages-folder pattern
**Team:** Paul (Solo Developer)
**Facilitator:** Bob (Scrum Master)

---

## Executive Summary

Sprint 4 achieved **~67% committed delivery** — 6 of 9 committed items closed. Epic 8 (Toast System) was delivered **100% in a single day**, demonstrating the force-multiplier effect of established Clean Architecture patterns. Epic 9 P0 components saw partial delivery: FormatToggle and AppShell shipped within the sprint window; Badge+BadgeRow was completed during the post-sprint pause (merged 2026-04-10). GameCover and GameCard remain open. A deliberate personal break (2026-03-23 → 2026-04-10) extended the effective sprint duration — this is expected and healthy for a solo side project run at full intensity. Paul went 100% on the sprint and hit a natural saturation point; attending to other priorities was the right call.

**Highlights:**
- ✅ Epic 8 Toast System: 3/3 stories delivered in 1 day (100%)
- ✅ 9.0 FormatToggle delivered (2026-03-13)
- ✅ 9.1 AppShell delivered (2026-03-17)
- ✅ 9.5 Badge+BadgeRow delivered (2026-04-10 — complex component, higher quality than estimated)
- ⚠️ Inversify v8 upgrade mid-sprint absorbed energy and disrupted momentum
- ❌ 9.4 GameCover and 9.6 GameCard not delivered (P0 carry-overs → Sprint 5)
- ❌ pages-folder-pattern-fix not delivered
- ❌ All 5 stretch goals not started
- 📌 TypeScript v6 upgrade (PR #222) handled during pause — smart deferral

---

## Sprint 4 Completion Status

### Committed Items — 6/9 (~67%)

| # | Item | Issue | PR | Merged | Notes |
|---|------|-------|----|--------|-------|
| 8.1 | Toast System Core Module | #118 | #175 | 2026-03-12 | ✅ Delivered Day 3 |
| 8.2 | Ports & Adapters + DI Bridge | #119 | #176 | 2026-03-12 | ✅ Delivered Day 3 |
| 8.3 | Migrate Notifications to Toast | #120 | #177 | 2026-03-12 | ✅ Delivered Day 3 |
| 9.0 | FormatToggle | #131 | #181 | 2026-03-13 | ✅ Delivered Day 4 |
| 9.1 | AppShell | #129 | #191 | 2026-03-17 | ✅ Delivered Day 8 |
| 9.5 | Badge + BadgeRow | #132 | #235 | 2026-04-10 | ✅ Delivered post-pause (retro day) |
| 9.4 | GameCover | #134 | — | — | ❌ Carry-over → Sprint 5 |
| 9.6 | GameCard | #136 | — | — | ❌ Carry-over → Sprint 5 |
| — | pages-folder-pattern-fix | — | — | — | ❌ Carry-over → Sprint 5 |

### Stretch Goals — 0/5 (not started)

| Item | Issue | Reason |
|------|-------|--------|
| 9.2 TopBar | #130 | No capacity after committed work + pause |
| 9.3 BurgerMenuDrawer | #133 | No capacity |
| 9.8 SearchInput | #137 | No capacity |
| 9.9 FilterChip | #139 | No capacity |
| 9.10 SortSelect | #140 | No capacity |

---

## Velocity Trend

| Sprint | Committed | Delivered | Rate | Notes |
|--------|-----------|-----------|------|-------|
| Sprint 1 | 8 | 8 | 100% | Foundation — well-scoped |
| Sprint 2 | 6 | 6* | ~100% | *2 carry-over Sonar items resolved |
| Sprint 3 | 8 | 8 | 100% | Epic 2 complete — GamesStore multiplier |
| **Sprint 4** | **9** | **6** | **~67%** | ⬇️ Pause + mid-sprint upgrade friction + UI estimation gap |

---

## What Went Well

### 🚀 Epic 8 Toast System — 3 Stories in 1 Day

The entire Toast Notification System (Core, Ports & Adapters bridge, migration) was delivered on Day 3 of the sprint. This is a direct consequence of the Clean Architecture foundation: the Ports & Adapters pattern was already established, the DI container was in place, and tests followed naturally. Zero rework.

Paul's note: *"For a real-world app, the implementation could have been simpler while staying clean. But this is the purpose of the lab — push the Clean Architecture concepts to their limits and understand the trade-offs."* This intentional over-engineering is a feature, not a defect: the lab is a research vehicle.

**Lesson:** When architecture is properly established, implementation becomes assembly. The lab validated that pushing the patterns further than production would require is the right approach for deep learning.

### ✅ Badge+BadgeRow Quality Over Speed

Badge+BadgeRow (estimated M = 1 day) was delivered as a production-quality component with:
- CSS Container Queries for responsive behavior without media queries
- 5 brand-configured variants (PS5, Xbox, Nintendo, Physical, Digital)
- Full accessibility audit

The apparent 18-day delivery window is misleading: the component was started before the pause, then resumed gradually after the break. The net active development time was not 3 weeks. The quality is durable and won't need rework — the right trade-off for a lab focused on doing things right.

### 📦 TypeScript v6 Deferred to Pause

The decision to handle the TypeScript v6 upgrade (PR #222) during the pause — not mid-sprint — was correct. Keeping the sprint focused on features and deferring major toolchain upgrades to inter-sprint windows is sound discipline.

---

## What Didn't Go Well

### ⚠️ Inversify v8 Upgrade Mid-Sprint

PRs #192 and #195 (Inversify v8 migration) landed on Day 8 of the sprint (2026-03-18). This was a **Renovate bot PR** — an automatic dependency update triggered by the bot configured at project start to keep libraries up-to-date. Paul's recollection is that the upgrade itself was not particularly complex.

The friction was more subtle: any mid-sprint dependency upgrade, even a smooth one, introduces context-switching overhead and a moment of uncertainty. The bot is working as intended.

**Action (mild):** When a Renovate PR lands mid-sprint on a core dependency (DI container, bundler, test runner), prefer merging it on Day 1 of the *next* sprint rather than mid-sprint — unless the fix is urgent. A timing preference, not a process failure.

### ❌ Badge+BadgeRow Timing vs. Estimation

Badge+BadgeRow was estimated at M (1 day). The apparent delivery time (start of sprint → retro day) is distorted by the pause: the component was started before the break and resumed very gradually afterward. The net active development effort is not a 3-week block.

That said, the component did require more thought than a typical M: container queries, brand variants, accessibility audit. Whether it was truly underestimated or simply spread across a discontinuous timeline is unclear — the data is not reliable enough to draw a firm conclusion.

**Observation:** For future UI components with brand theming + responsive + a11y, lean toward L as a default estimate. But don't over-index on this sprint's timing data.

### ❌ GameCard Dependency Not Made Explicit

GameCard (9.6) had a de facto dependency on Badge+BadgeRow (9.5). This dependency was not explicitly tracked in the sprint plan. Had it been visible, GameCard might have been deprioritized earlier in favor of unblocking GameCover (9.4), which has no Badge dependency.

**Action:** Explicit dependency tracking for UI component stories in Sprint 5 planning.

---

## Key Technical Observations

### Notable Events (Sprint Window + Pause)

| Date | Event | Impact |
|------|-------|--------|
| 2026-03-12 | Epic 8 Toast (3 stories) | ✅ Positive — architecture payoff |
| 2026-03-13 | FormatToggle merged | ✅ Quick win |
| 2026-03-17 | AppShell merged | ✅ On track |
| 2026-03-18 | Inversify v8 upgrade | ⚠️ Mid-sprint friction |
| 2026-03-23 | Sprint end — pause begins | 📌 Deliberate personal break |
| 2026-03-31 | TypeScript v6 upgrade (PR #222) | ✅ Good timing (inter-sprint) |
| 2026-04-10 | Badge+BadgeRow merged (PR #235) | ✅ Unblocks GameCard |
| 2026-04-10 | Sprint 4 Retrospective | 📋 This document |

---

## Action Items for Sprint 5

### P0 Carry-overs (Must Complete First)

1. **9.6 GameCard** (#136) — **UNBLOCKED as of today** (Badge merged). Day 1 priority for Sprint 5.
2. **9.4 GameCover** (#134) — XS quick win. Complete alongside GameCard.
3. **pages-folder-pattern-fix** — Structural refactor. Clean-up before Epic 3 UI work.

### Process Improvements

| # | Action | Owner | When |
|---|--------|-------|------|
| 1 | Renovate PRs on core deps: prefer merging on Day 1 of next sprint, not mid-sprint | Paul | Sprint 5 kickoff |
| 2 | UI components with brand theming / responsive / a11y → default estimate L | Bob (sprint planning) | Sprint 5 planning |
| 3 | Explicit dependency mapping for UI component stories | Bob (sprint planning) | Sprint 5 planning |
| 4 | Keep UI stories small and iterative — "good enough" > "perfect" for the lab UI | Paul | Ongoing |

---

## Lab Focus Note

Paul's primary interest in this project is the **Clean Architecture research** — pushing the patterns, validating the abstractions, and understanding the trade-offs. UI development is a necessary step to end up with a working, presentable application, but it is not the core motivation.

This is a healthy and honest framing. It means:
- UI sprints (like Sprint 4) will naturally feel less energizing than architecture-heavy ones
- Saturation risk is higher when working through a UI backlog solo
- It's fine to keep UI stories small, ship them iteratively, and not over-polish

The lab's goal is to have a *good enough* UI that demonstrates the Clean Architecture in action — not to build a pixel-perfect design system.

---

## Looking Ahead

With Badge+BadgeRow delivered today, the blocker for GameCard is removed. Sprint 5 should:

1. Knock out the 3 carry-overs (GameCard, GameCover, pages-folder) immediately
2. Complete remaining Epic 9 P0 components (TopBar, BurgerMenuDrawer) to fully close the Epic 2 → Epic 9 integration gap
3. Potentially begin Epic 2 final integration pass once all P0 UI components are in place

The project's Clean Architecture foundation continues to pay dividends. The Toast delivery in a single day is proof that the investment in Epics 1–2 is compounding.

---

*Sprint 4 Retrospective — Generated 2026-04-10*
*Facilitator: Bob (Scrum Master) | Project: lab-clean-architecture-react*
