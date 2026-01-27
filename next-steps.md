# 🚀 Next Steps - lab-clean-architecture-react

**PRD validation date**: January 17, 2026

---

## 📋 Recommended Steps

### Phase 0: API Research Sprint ✅ COMPLETE

**Timeline**: January 21-22, 2026 (2 days)
**Tools**: WebStorm HTTP Client, web research
**Agent**: Analyst Agent
**Status**: ✅ **COMPLETE**

**Objective**: Validate the availability and feasibility of external APIs before starting implementation.

**Research Completed**:
- ✅ **IGDB** - Game metadata (SELECTED: Partial FR support, 4 req/sec free tier)
- ✅ **RAWG** - Alternative metadata (EVALUATED: English only, backup option)
- ✅ **PSN Trophies** - psn-api library (DEFERRED POST-MVP: Reverse-engineered, ban risk)
- ✅ **Xbox Achievements** - No free option (DEFERRED POST-MVP: XAPI.us £5/month)
- ✅ **Price Tracking** - IsThereAnyDeal API (DEFERRED POST-MVP: Focus on core MVP)
- ✅ **General Marketplaces** - eBay/Amazon/Leboncoin (NOT SUITABLE: No price history or approval required)

**Delivered Artifacts**:
- ✅ [Metadata API Research](/_bmad-output/planning-artifacts/research/technical-api-metadata-jeux-research-2026-01-21.md) - IGDB selected
- ✅ [Price Tracking Research](/_bmad-output/planning-artifacts/research/technical-price-tracking-wishlist-research-2026-01-22.md) - DEFERRED POST-MVP
- ✅ HTTP Client tests (http_client/igdb/auth.http, games.http) - IGDB validated
- ✅ Go/No-Go decisions documented per API

**Key Decisions**:
1. ✅ **IGDB for Metadata** - MVP will auto-fetch game data (title, cover, genre, platform)
2. ⏸️ **Trophies DEFERRED** - Manual entry only in MVP, psn-api researched for future
3. ⏸️ **Price Tracking DEFERRED** - Manual wishlist in MVP, IsThereAnyDeal researched for future
4. ✅ **Manual-First MVP** - Core CRUD + search without complex external APIs

**Pivot Applied**: Manual-first approach for MVP (no trophy sync, no automated price alerts)

---

### Phase 1: Technical Architecture ✅ COMPLETE

**Timeline**: January 26, 2026 (1 day)
**Agent**: Architect Agent (Winston)
**Workflow**: `workflow create-architecture`
**Status**: ✅ **COMPLETE**

**Objective**: Define the Clean Architecture structure before writing any code.

**Delivered artifacts**:
- ✅ Complete Architecture Decision Document (`_bmad-output/planning-artifacts/architecture.md`)
- ✅ Clean Architecture + DDD Bounded Contexts hybrid structure
- ✅ 10 core architectural decisions (DB schema, migrations, validation, cache, errors, PWA, DI, events, tests, performance)
- ✅ 15+ implementation patterns (naming, structure, format, communication)
- ✅ Complete project structure (200+ file paths documented)
- ✅ 3 bounded contexts defined (Collection, Wishlist, Maintenance)
- ✅ Project context file for AI agent consistency (`project-context.md`)

**Key decisions made**:
- ✅ Single IndexedDB with 5 stores (allows future migration to separate DBs)
- ✅ Manual migrations with code (documented in DECISIONS.md/MIGRATIONS.md)
- ✅ Hybrid validation (React Hook Form UI + Value Objects domain)
- ✅ Permanent cache with ICacheStrategy interface
- ✅ Result<T, E> pattern for error handling
- ✅ PWA App Shell pattern (50MB configurable cache for covers)
- ✅ Manual DI registration (NO decorators in domain layer)
- ✅ Event Bus for cross-context communication
- ✅ Dedicated tests/ folder (unit/, integration/, e2e/, visual/)
- ✅ Route-based lazy loading with React.lazy
- ✅ Arrow functions only, no default exports, no index.ts files
- ✅ Path aliases per context (@Collection/, @Wishlist/, @Maintenance/, @Shared/, @App/)

---

### Phase 2: UX Design ✅ COMPLETE

**Timeline**: 3-5 days (COMPLETED: January 21, 2026)
**Agent**: UX-Designer Agent
**Workflow**: `workflow create-ux-design`

**Status**: ✅ **COMPLETE**

**Delivered artifacts**:
- ✅ Complete UX Design Specification (`_bmad-output/planning-artifacts/ux-design-specification.md`)
- ✅ Mobile-first responsive strategy (320px-1440px, shelter-ui breakpoints)
- ✅ 4 critical user journey flows documented (Verify Ownership, Add Game, Browse Collection, Console Maintenance)
- ✅ Component strategy: 17 shelter-ui components + 12 custom components fully specified
- ✅ UX consistency patterns (buttons, feedback, forms, navigation, empty states, search/filters)
- ✅ Responsive design & accessibility strategy (WCAG 2.1 AA+, "ARIA less is best")
- ✅ Design direction: Elevated Cards with Platform Identity (hybrid Direction 3+5+8)
- ✅ Visual foundation: Colors, typography (shelter-ui: Raleway/Nunito/Oswald/JetBrains Mono), spacing (8px grid)
- ✅ Design directions mockups (`ux-design-directions.html`)
- ✅ 4-sprint implementation roadmap (Foundation → Collection UI → Maintenance → Polish)

**Key decisions**:
- Design system: shelter-ui (custom Sass/CSS Modules, no Tailwind)
- Platform colors: PS5=#006FCD, Xbox=#107C10, Nintendo=#E60012, PC=#888888
- Emotional goals: Serenity + Confidence ("control tower" metaphor)
- Testing: Vitest (code), Vitest Browser (components), Playwright (e2e), Axe (accessibility)
- Implementation: Mobile-first media queries, `rem` units (ps-to-rem()), semantic HTML first

---

### Phase 3: Epic Breakdown + GitHub Issues ✅ COMPLETE

**Timeline**: January 27, 2026 (1 day)
**Agent**: PM Agent (John)
**Workflow**: `workflow create-epics-and-stories`
**Status**: ✅ **COMPLETE**

**Objective**: Turn FRs into epics and implementable user stories, then create GitHub Issues.

**Delivered artifacts**:
- ✅ Complete Epic & Story Breakdown (`_bmad-output/planning-artifacts/epics.md`)
- ✅ 6 epics organized by user value (not technical layers)
- ✅ 46 implementation-ready stories with detailed acceptance criteria
- ✅ 100% coverage of 37 functional requirements validated
- ✅ Accessibility integrated transversally in all stories (FR28-FR32)
- ✅ Story dependencies validated (sequential, no forward dependencies)
- ✅ Epic independence validated (each epic is standalone)
- ✅ **52 GitHub Issues created** (6 epics + 46 stories)
- ✅ 20-label system deployed (type, priority, epic context, functional, contributors)
- ✅ 4 GitHub Issue templates + PR template created

**Epic Structure**:
1. **Epic 1: Foundation, Clean Architecture & PWA Setup** ([#7](https://github.com/pplancq/lab-clean-architecture-react/issues/7)) - 7 stories
   - FRs: FR23-FR27, FR33-FR37
   - Stories: #1, #2, #3, #4, #5, #6, #52 (all P0)
   - Sizes: 2 XS, 5 S
   - Delivers: Functional project with Clean Arch, PWA installable, CI/SonarCloud/GitHub Copilot ready

2. **Epic 2: Core Game Collection Management with IndexedDB** ([#8](https://github.com/pplancq/lab-clean-architecture-react/issues/8)) - 8 stories
   - FRs: FR1, FR4-FR7, FR18-FR20
   - Stories: #9-#16 (all P0)
   - Sizes: 6 S, 2 M
   - Delivers: Complete CRUD + offline persistence

3. **Epic 3: Search, Filter & Sort Collection** ([#17](https://github.com/pplancq/lab-clean-architecture-react/issues/17)) - 6 stories
   - FRs: FR8-FR12
   - Stories: #18-#23 (all P1)
   - Sizes: 4 S, 1 M, 1 L
   - Delivers: Fast search (<10s store moment), filters, sorting

4. **Epic 4: Game Metadata Enrichment via External APIs** ([#24](https://github.com/pplancq/lab-clean-architecture-react/issues/24)) - 6 stories
   - FRs: FR2-FR3
   - Stories: #25-#30 (all P1)
   - Sizes: 1 S, 4 M, 1 L
   - Delivers: IGDB integration, auto-import metadata, cover art caching

5. **Epic 5: Wishlist Management & Prioritization** ([#31](https://github.com/pplancq/lab-clean-architecture-react/issues/31)) - 9 stories (including 6 sub-stories)
   - FRs: FR13-FR17
   - Stories: #32-#40 (6x P1, 3x P2)
   - Story #36 decomposed into sub-stories: #46-#51
   - Sizes: 1 XS, 3 S, 5 M
   - Delivers: Complete wishlist CRUD, priorities, move to collection, event bus

6. **Epic 6: Data Portability & Backup** ([#43](https://github.com/pplancq/lab-clean-architecture-react/issues/43)) - 4 stories
   - FRs: FR21-FR22
   - Stories: #41, #42, #44, #45 (all P2)
   - Sizes: 1 S, 3 L
   - Delivers: Export/import JSON, conflict resolution

**Story Breakdown:**
- **Total Issues:** 52 (6 epics + 46 stories)
- **By Priority:** 14 P0 (critical), 18 P1 (important), 14 P2 (nice-to-have)
- **By Size:** 2 XS, 13 S, 17 M, 6 L, 0 XL (all stories appropriately sized)
- **Story #36 Decomposition:** XL story split into 6 manageable stories (#46-#51)
- **New Infrastructure:** Story #52 added for CI + SonarCloud + GitHub Copilot Agent support

**Key Decisions**:
- Stories sized for single dev agent completion (~1 week with 5h/week)
- Acceptance criteria use Given/When/Then format
- Each epic delivers complete standalone value
- Accessibility (FR28-FR32) integrated in ALL stories, not separate epic
- PWA in Foundation (Epic 1) forces proper architecture from start
- IndexedDB integrated with Collection (Epic 2), not separate
- No XL stories remaining - all decomposed for sprint-sized delivery

**GitHub Implementation**:
- ✅ Epic = GitHub Issue with `epic` label
- ✅ Story = Sub-issue linked to parent epic
- ✅ 4 Issue templates (Epic, Story, Bug, Enhancement) in English
- ✅ PR template with Clean Architecture sections
- ✅ 20-label system: type, priority, epic context, functional, contributors
- ✅ Labels deployed via `setup-labels.sh` script
- ✅ All issues have detailed acceptance criteria in Given/When/Then format

---

### Phase 4a: Sprint Planning ✅ COMPLETE

**Timeline**: January 27, 2026 (1 hour)
**Agent**: SM Agent (Bob, Scrum Master)
**Status**: ✅ **COMPLETE**

**Objective**: Initialize Sprint 1 with proper Scrum structure before coding begins.

**Delivered artifacts**:
- ✅ Sprint 1 created in sprint-status.yaml (27 jan → 13 fév 2026)
- ✅ 15 P0 stories assigned to Sprint 1 (Epic 1 + Epic 2)
- ✅ All stories moved to `ready-for-dev` status
- ✅ Epic 1 and Epic 2 moved to `in-progress` status
- ✅ Sprint goal defined: "Establish technical foundations (Clean Architecture, PWA, IndexedDB) and implement core collection management"
- ✅ Sprint capacity: 12 days (~2.5 weeks)
- ✅ GitHub Project Iterations field activated
- ✅ Complete sprint metrics documented (P0-P2 breakdown, XS-XL sizes)

**Sprint 1 Scope:**
- **Duration:** 2.5 weeks (27 jan → 13 fév 2026)
- **Capacity:** 12 working days
- **Stories:** 15 P0 stories (Epic 1: 7 stories, Epic 2: 8 stories)
- **Epic 1 (3.5 days):** Foundation, Clean Architecture & PWA Setup - Stories #1-6, #52
- **Epic 2 (8.5 days):** Core Game Collection Management with IndexedDB - Stories #9-16
- **Objective:** "Establish technical foundations (Clean Architecture, PWA, IndexedDB) and implement core collection management"
- **Deliverables:**
  - Installable PWA with offline-first capability
  - Complete CRUD collection management
  - Clean Architecture with DI and error handling
  - CI/CD Pipeline with SonarCloud

**Key Decisions:**
- ✅ Combined Epic 1 + Epic 2 in Sprint 1 (both P0, foundational)
- ✅ All 15 stories sized and prioritized (12 days total effort)
- ✅ GitHub Project metadata synchronized (P0-P2 priorities, XS-XL sizes)
- ✅ Sprint tracking file: `_bmad-output/implementation-artifacts/sprint-status.yaml`

---

### Phase 4b: Development Setup ⏭️ NEXT

**Timeline**: 1-2 days
**Yourself** (no agent, technical setup)
**Status**: ⏭️ **READY TO START**

**Initial setup**:
- [ ] Clone starter template: `@pplancq/dev-tools/react-template`
- [ ] Setup Rsbuild configuration
- [ ] Configure TypeScript (strict mode)
- [ ] Setup React Router (Browser History)
- [ ] Configure IndexedDB with `idb` library
- [ ] Setup testing framework (Jest + React Testing Library)
- [ ] Configure ESLint + Prettier
- [ ] Setup Git hooks (pre-commit, pre-push)
- [ ] Initialize DECISIONS.md, LEARNINGS.md, REGRETS.md

**PWA Setup**:
- [ ] Install Rsbuild PWA Plugin
- [ ] Configure Service Worker (app shell caching)
- [ ] Test MSW + PWA coexistence (resolve conflict if needed)
- [ ] Document strategy in DECISIONS.md

**DI Setup**:
- [ ] Install InversifyJS
- [ ] Setup DI container
- [ ] Create initial bindings (examples)

---

### Phase 5: MVP Development (Weeks 1-10)

**Week 1-4: Game Collection Management**
- [ ] Domain entities (Game, GameId, Platform)
- [ ] CRUD Use Cases (AddGame, EditGame, DeleteGame, GetGames)
- [ ] Repository Interface + IndexedDB Adapter
- [ ] React components (GameList, GameForm)
- [ ] **Shipping Goal**: Fully functional end-to-end CRUD

**Week 5-6: Search & Filtering**
- [ ] Use Cases (SearchGames, FilterGames, SortGames)
- [ ] Optimized IndexedDB queries
- [ ] UI search bar + filters
- [ ] **Shipping Goal**: Operational search and filtering

**Week 7-8: Wishlist Management**
- [ ] Wishlist Use Cases
- [ ] Priority management
- [ ] Wishlist → Collection conversion
- [ ] **Shipping Goal**: Functional wishlist

**Week 9-10: PWA Fundamentals**
- [ ] Finalized Service Worker
- [ ] Full offline support
- [ ] Install prompt
- [ ] **Shipping Goal**: Installable and offline-ready app

---

## 🎯 Shipping Discipline

**Golden rules**:
- ✅ **1 feature shipped per week** (no compromise)
- ✅ **Max 1 day of architecture per feature** (strict time-boxing)
- ✅ **"Good enough" code > Perfect code** (pragmatism)
- ✅ **5h/week max** (no burnout)
- ✅ **Weekends OFF** (unless naturally motivated)

**Kill Switches**:
- ⚠️ If architecture blocks shipping >2 weeks → Simplify
- ⚠️ If PWA takes >2 weeks → Pivot to LocalStorage
- ⚠️ If APIs unavailable → Pivot to manual-first

**Real-time documentation**:
- 📝 DECISIONS.md - Update every decision (within 24h)
- 📝 LEARNINGS.md - Weekly reflection every Friday (15min)
- 📝 REGRETS.md - Mistakes documented without shame

---

## 📊 Continuous Validation

**Every 2 weeks**:
- [ ] Team demo (safe feedback)
- [ ] LinkedIn/Twitter post (architecture insights)
- [ ] GitHub push with detailed commit message

**Monthly**:
- [ ] Blog post (500-1000 words, 1 specific learning)
- [ ] Demo video (5min, optional)

**Quarterly**:
- [ ] "3 months of Clean Arch React" summary post
- [ ] Conference submission (Devoxx/DevFest)

---

## 📚 Quick References

- **Product Requirements Document (PRD)**: [_bmad-output/planning-artifacts/prd.md](_bmad-output/planning-artifacts/prd.md)
- **Product Brief**: [_bmad-output/planning-artifacts/product-brief-lab-clean-architecture-react-2026-01-14.md](_bmad-output/planning-artifacts/product-brief-lab-clean-architecture-react-2026-01-14.md)
- **UX Design Specification**: [_bmad-output/planning-artifacts/ux-design-specification.md](_bmad-output/planning-artifacts/ux-design-specification.md)
- **Architecture Document**: [_bmad-output/planning-artifacts/architecture.md](_bmad-output/planning-artifacts/architecture.md)
- **Epics & Stories**: [_bmad-output/planning-artifacts/epics.md](_bmad-output/planning-artifacts/epics.md)
- **Brainstorming Session**: [_bmad-output/analysis/brainstorming-session-2026-01-14.md](_bmad-output/analysis/brainstorming-session-2026-01-14.md)

---

## 🚦 Ready to Start?

**GitHub Board**: [View all 52 issues](https://github.com/pplancq/lab-clean-architecture-react/issues)

**Immediate recommended action**:

1. ✅ **Phase 0 API Research** (COMPLETE) - API feasibility validated
2. ✅ **Phase 1 Architecture Design** (COMPLETE) - Clean Arch structure defined
3. ✅ **Phase 2 UX Design** (COMPLETE) - Mobile-first spec, component strategy ready
4. ✅ **Phase 3 Epic Breakdown + GitHub Issues** (COMPLETE) - 6 epics, 46 stories, 52 issues created
5. ✅ **Phase 4a Sprint Planning** (COMPLETE) - Sprint 1 initialized with 15 P0 stories
6. ⏭️ **Phase 4b Development Setup** (1-2 days, NEXT) - Initialize with @pplancq/react-app
7. **Phase 5 Sprint 1 Coding** - Epic 1 + Epic 2 complete (15 stories P0, 12 days)

**Phase 0 API Research Complete**:
- ✅ IGDB metadata API selected (partial FR support, free tier)
- ⏸️ Trophy sync deferred post-MVP (psn-api researched, ban risk)
- ⏸️ Price tracking deferred post-MVP (IsThereAnyDeal researched)
- ✅ Manual-first MVP approach validated

**Phase 1 Architecture Complete**:
- ✅ Clean Architecture + DDD Bounded Contexts structure
- ✅ 10 core architectural decisions documented
- ✅ 15+ implementation patterns for consistency
- ✅ Complete project structure (200+ files mapped)
- ✅ Project context for AI agents (`project-context.md`)
- ✅ Manual DI registration (NO decorators in domain)
- ✅ Event Bus for cross-context communication
- ✅ Result<T, E> pattern for type-safe errors

**Phase 2 UX Specification Complete**:
- ✅ Component implementation (12 custom + 17 shelter-ui)
- ✅ Responsive breakpoints (mobile/tablet/desktop strategy)
- ✅ Accessibility requirements (WCAG AA, keyboard nav, screen readers)
- ✅ Interaction patterns (buttons, forms, navigation, feedback)
- ✅ Visual design (colors, typography, spacing tokens)

**Phase 3 Epic Breakdown + GitHub Issues Complete**:
- ✅ 6 epics organized by user value (Foundation, Collection, Search, API, Wishlist, Backup)
- ✅ 46 implementation-ready stories with detailed acceptance criteria
- ✅ 100% coverage of 37 functional requirements
- ✅ Accessibility integrated transversally (not separate epic)
- ✅ Story dependencies validated (sequential flow, no forward deps)
- ✅ Each epic delivers standalone value
- ✅ **52 GitHub Issues created** (6 epics + 46 stories)
- ✅ All stories sized: 2 XS, 13 S, 17 M, 6 L, 0 XL
- ✅ All stories prioritized: 14 P0, 18 P1, 14 P2
- ✅ Story #36 decomposed into 6 sub-stories (#46-#51)
- ✅ CI + SonarCloud + GitHub Copilot story added (#52)
- ✅ 20-label system deployed
- ✅ Issue templates (Epic, Story, Bug, Enhancement) created

**Phase 4a Sprint Planning Complete**:
- ✅ Sprint 1 initialized (27 jan → 13 fév 2026, 12 working days)
- ✅ 15 P0 stories assigned to Sprint 1 (Epic 1: 7 stories, Epic 2: 8 stories)
- ✅ Sprint goal defined: "Establish technical foundations and implement core collection management"
- ✅ All stories moved to `ready-for-dev` status
- ✅ Epic 1 and Epic 2 moved to `in-progress` status
- ✅ GitHub Project Iterations activated
- ✅ Complete sprint metrics: 12 days capacity, P0-P2 breakdown, XS-XL sizes
- ✅ Sprint tracking: `_bmad-output/implementation-artifacts/sprint-status.yaml`

**Next Immediate Action**: Phase 4b Development Setup (1-2 days)

**Command to start**: Initialize with `@pplancq/react-app` template

**Good luck! 🚀**
