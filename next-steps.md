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

### Phase 3: Epic Breakdown ⏭️ NEXT

**Timeline**: 2-3 days
**Agent**: PM Agent
**Workflow**: `workflow create-epics-and-stories`
**Status**: ⏭️ **READY TO START**

**Objective**: Turn FRs into epics and implementable user stories.

**Expected deliverables**:
- Epics organized by feature area (Collection, Wishlist, Maintenance)
- User stories with acceptance criteria
- Complexity estimation (story points or T-shirt sizes)
- MVP vs Post-MVP prioritization
- Suggested sprint planning (features per week)

**Context available**:
- ✅ Complete architecture decisions and patterns
- ✅ UX design specification with component strategy
- ✅ 3 bounded contexts with mapped requirements
- ✅ Technical constraints and implementation patterns

---

### Phase 4: Development Setup

**Timeline**: 1-2 days
**Yourself** (no agent, technical setup)

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

- **Full PRD**: [docs/prd.md](./prd.md)
- **Product Brief**: [docs/product-brief.md](./product-brief.md)
- **Brainstorming Session**: [../_bmad-output/analysis/brainstorming-session-2026-01-14.md](../_bmad-output/analysis/brainstorming-session-2026-01-14.md)

---

## 🚦 Ready to Start?

**Immediate recommended action**:

1. ✅ **Phase 0 API Research** (COMPLETE) - API feasibility validated
2. ✅ **Phase 1 Architecture Design** (COMPLETE) - Clean Arch structure defined
3. ✅ **Phase 2 UX Design** (COMPLETE) - Mobile-first spec, component strategy ready
4. ⏭️ **Phase 3 Epic Breakdown** (2-3 days) - Transform FRs into implementable stories
5. **Phase 4 Development Setup** (1-2 days) - Initialize with @pplancq/react-app
6. **Phase 5 Week 1 Coding** - First functional CRUD with architectural patterns

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

**UX Specification Ready to Guide**:
- ✅ Component implementation (12 custom + 17 shelter-ui)
- ✅ Responsive breakpoints (mobile/tablet/desktop strategy)
- ✅ Accessibility requirements (WCAG AA, keyboard nav, screen readers)
- ✅ Interaction patterns (buttons, forms, navigation, feedback)
- ✅ Visual design (colors, typography, spacing tokens)

**Next Immediate Action**: Phase 3 Epic Breakdown (2-3 days)

**Command to start**: `workflow create-epics-and-stories`

**Good luck! 🚀**
