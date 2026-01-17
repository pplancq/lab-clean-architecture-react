# 🚀 Next Steps - lab-clean-architecture-react

**PRD validation date**: January 17, 2026

---

## 📋 Recommended Steps

### Phase 0: API Research Sprint (MANDATORY - Before any code)

**Timeline**: 2-3 days max
**Tools**: WebStorm HTTP Client
**Agent**: Analyst Agent

**Objective**: Validate the availability and feasibility of external APIs before starting implementation.

**APIs to validate**:
- ✅ **IGDB** - Game metadata (title, cover art, genre, platform)
- ✅ **RAWG** - Alternative/complement to IGDB
- ✅ **PSN (PlayStation Network)** - Sync trophies and playtime
- ✅ **Xbox Live** - Sync achievements and playtime
- ✅ **Steam** - Sync achievements and playtime
- ✅ **Price Monitoring Services** - Wishlist price tracking

**Deliverables**:
- Documented HTTP requests for each API (WebStorm HTTP Client)
- Captured and analyzed response examples
- Evaluation of quotas/rate limits/pricing
- **Go/No-Go decision per API**

**Contingency**: If >50% of APIs are unavailable/paid → Pivot to manual-first MVP

---

### Phase 1: Technical Architecture

**Timeline**: 1 week
**Agent**: Architect Agent
**Workflow**: `workflow create-architecture`

**Objective**: Define the Clean Architecture structure before writing any code.

**Expected deliverables**:
- Layered architecture (Domain, Use Cases, Infrastructure, Presentation)
- Structure diagrams
- Patterns to use (Repository, Adapter, Use Case)
- State management strategy (Query Core + InversifyJS)
- Detailed folder structure
- Naming conventions and code standards

**Critical decisions to make**:
- [ ] Resolve PWA + MSW Service Workers conflict (30min spike)
- [ ] Final data fetching choice (Standard Fetch vs Query Core)
- [ ] DI structure with InversifyJS
- [ ] Testing strategy (unit, integration, e2e)

---

### Phase 2: UX Design (Optional but recommended)

**Timeline**: 3-5 days
**Agent**: UX-Designer Agent
**Workflow**: `workflow create-ux-design`

**Objective**: Turn User Journeys into wireframes and prototypes.

**Expected deliverables**:
- Mobile-first wireframes (smartphone prioritized)
- User flows for the 3 documented journeys
- Basic design system (components, colors, typography)
- Accessibility patterns (WCAG AA compliance)
- Interactive prototypes (Figma/Excalidraw)

**Working base**:
- 37 Functional Requirements from the PRD
- 3 detailed User Journeys
- Constraints: Mobile-first, touch-friendly (44x44px), full-screen PWA

**Note**: Can be done in parallel with architecture if you want to move faster.

---

### Phase 3: Epic Breakdown

**Timeline**: 2-3 days
**Agent**: PM Agent (me!)
**Workflow**: `workflow create-epics-and-stories`

**Objective**: Turn FRs into epics and implementable user stories.

**Expected deliverables**:
- Epics organized by feature area
- User stories with acceptance criteria
- Complexity estimation (story points or T-shirt sizes)
- MVP vs Post-MVP prioritization
- Suggested sprint planning (features per week)

**Recommendation**: To be done AFTER Architecture and UX for richer, more realistic stories.

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

1. **Phase 0 API Research** (2-3 days) - Validate API feasibility BEFORE coding
2. **Architecture Design** (1 week) - Solid Clean Arch structure
3. **Development Setup** (1-2 days) - Ready environment
4. **Week 1 Coding** - First functional CRUD

**Good luck! 🚀**
