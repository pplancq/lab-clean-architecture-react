---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish']
inputDocuments:
  - '_bmad-output/planning-artifacts/product-brief-lab-clean-architecture-react-2026-01-14.md'
  - '_bmad-output/analysis/brainstorming-session-2026-01-14.md'
documentCounts:
  briefCount: 1
  researchCount: 0
  brainstormingCount: 1
  projectDocsCount: 0
workflowType: 'prd'
classification:
  projectType: 'web_app'
  projectTypeLabel: 'Web App (SPA React + PWA mobile-first)'
  domain: 'gaming'
  domainLabel: 'Gaming (Collection Management Tool)'
  complexity: 'medium'
  complexityReason: 'Technical complexity (PWA, offline-first, multi-source sync, external APIs) without regulatory compliance'
  projectContext: 'greenfield'
technicalStack:
  frontend: 'React SPA + PWA (starter: https://github.com/pplancq/dev-tools)'
  stateManagement: 'React Query'
  storage: 'IndexedDB (browser-based, no backend for MVP)'
  backendFuture: 'NestJS (if needed later - demonstrates Clean Architecture flexibility)'
  architecture: 'Clean Architecture (core experimental focus)'
nextSteps:
  apiResearch:
    required: true
    timing: 'After PRD completion, before MVP implementation'
    agent: 'Analyst Agent'
    purpose: 'Validate availability and feasibility of external APIs'
    apisToValidate:
      - name: 'IGDB'
        purpose: 'Game metadata enrichment'
        validationNeeded: 'Free tier? Quotas? API quality?'
      - name: 'RAWG'
        purpose: 'Game metadata enrichment (alternative/complement)'
        validationNeeded: 'Free tier? Quotas? Coverage?'
      - name: 'PSN (PlayStation Network)'
        purpose: 'Trophy sync, playtime tracking'
        validationNeeded: 'Official API? Community APIs (PSNProfiles)? Scraping needed?'
      - name: 'Xbox Live'
        purpose: 'Achievement sync, playtime tracking'
        validationNeeded: 'Official API? Community APIs (TrueAchievements)? Scraping needed?'
      - name: 'Steam'
        purpose: 'Achievement sync, playtime tracking'
        validationNeeded: 'Official API available? Free? Quotas?'
      - name: 'Price Monitoring Services'
        purpose: 'Wishlist price tracking and alerts'
        validationNeeded: 'APIs for digital stores (PSN, Xbox, Steam)? Retro market tracking?'
    ifApisUnavailable: 'Return to PM Agent to adjust MVP scope - may need to prioritize manual entry or reduce sync features'
---

# Product Requirements Document - lab-clean-architecture-react

**Author:** Paul
**Date:** 2026-01-15

---

## Assumptions, Risks & Mitigation Strategies

This lab project operates on several critical assumptions. Success is redefined to embrace uncertainty and honest documentation.

### Critical Assumptions & Risk Management

#### 1. External APIs Availability (HIGH RISK)

**Assumption:** Free APIs exist for metadata enrichment, trophy sync, and price tracking

**Mitigation Strategy:**
- **Core non-negotiable:** Manual entry for title, description, playtime (recensement works without APIs)
- **Optional features:** Trophy sync & price tracking = **abandon if no free API available**
- **Future-proof architecture:** Design with "API ports" - can plug paid APIs later when/if budget allows
- **Technical validation required:** Research APIs completion BEFORE committing features to MVP scope
- **Fallback elegance:** Manual entry must be well-designed, not treated as inferior experience

**Success Redefined:** App works with manual entry + demonstrates Clean Architecture flexibility for future API integration

---

#### 2. PWA Offline-First Complexity (MEDIUM RISK)

**Assumption:** PWA Service Workers are manageable within reasonable development time

**Confidence Level:** Medium-High ("Je doute un peu" - believes it's doable but prepared for reality)

**Plan B - Progressive Approach:**
- **Phase 1:** Online-first SPA (fastest to validate)
- **Phase 2:** LocalStorage for offline-light (offline without full PWA complexity)
- **Phase 3:** Full PWA with Service Workers (if Phase 2 proves valuable and time permits)

**Kill Switch:** If PWA takes >2 weeks of implementation time, pivot to LocalStorage and **document why**

**Success Metric:** Working offline capability via simplest viable approach (LocalStorage = success, doesn't need to be full PWA)

---

#### 3. Daily Personal Usage (MEDIUM RISK)

**Assumption:** App becomes genuinely useful tool for personal game collection management

**Honest Priority Hierarchy:**
- **Primary (80%):** Clean Architecture learning and documentation
- **Secondary (20%):** Personal utility

**Paul's Acceptance:** "Si j'arrive à prouver des insights Clean Arch, je n'aurais pas tout perdu"

**Mitigation Approach:**
- Prioritize features that solve **real personal pain** (killer features first)
- Weekly usage self-check: "Am I opening this app naturally?"
- **Honest documentation:** "I built it but didn't use it daily" = **valid lab insight**
- Document **why** it wasn't used (UX friction? Feature mismatch? Architecture overhead?)

**Success Redefined:** Solid architectural insights = success even without daily personal use. Both outcomes are valuable data points.

---

#### 4. Clean Architecture Development Velocity (LOW-MEDIUM RISK)

**Assumption:** Clean Architecture boilerplate won't kill productivity and developer motivation

**Paul's Confidence:** High - "Je suis sûr que la Clean Archi peut vraiment aider"

**Expected Reality:** More files = normal, proves separation of concerns and testability

**DX Innovation Opportunity:**
- AI prompts to generate boilerplate files
- CLI commands for scaffolding (UseCase, Entity, Repository, Adapter templates)
- VS Code snippets for common patterns
- "Rien n'est impossible" - tooling can dramatically improve DX

**Lab Output Options:**
- **Success:** Clean Arch improves velocity after initial learning curve
- **Failure:** Clean Arch IS too slow - document why and when it becomes overhead
- **Both are valuable insights for presentations**

**Success Metric:** Track development velocity per feature - proving it works OR proving it doesn't = both are valid conference content

**Honest Documentation:** If abandoned mid-project because too slow, that's **gold content** for Devoxx: "Here's where it broke down and why"

---

#### 5. Conference Acceptance (LOW RISK)

**Assumption:** Devoxx/DevFest or similar conferences accept presentation proposal

**Paul's Realistic View:** "Déçu mais aussi soulagé" - honest about public speaking anxiety balanced with desire to share

**Multiple Distribution Channels (Conference-Independent):**
- **Blog posts** - Written format for those who prefer reading
- **Social media** - Short insights and code snippets (Twitter, LinkedIn)
- **YouTube tutorials** - Video walkthroughs of architectural patterns discovered
- **Team internal training** - Share learnings with current team first
- **Open source documentation** - Comprehensive GitHub README and wiki

**Priority Approach:** **Open Source First**
- Document as if 1,000 developers will read it on GitHub
- Conference presentation = **bonus**, not primary goal
- Written documentation has longer shelf-life than one-time talk

**Success Metric:** Quality and depth of shared learnings, not venue prestige or audience size

**Hidden Truth:** Conference rejection might be a relief (less anxiety) while still achieving knowledge-sharing goals

---

### Success Philosophy

This project redefines success to embrace uncertainty and honest experimentation:

✅ **Proving Clean Architecture works for React** = Success
✅ **Proving Clean Architecture is overkill for React** = **ALSO Success** (if well documented)
✅ **Daily app usage** = Success multiplier (but not required)
✅ **Conference acceptance** = Nice bonus (but not primary goal)
✅ **Sharing honest lessons learned** = **Core success metric**

**The only true failure:** Not documenting the journey, whether it succeeds or fails.

---

## Development Guardrails & Project Execution Strategy

To prevent common side project failure modes, this lab implements strict guardrails and forcing functions.

### Phase 0: API Research Sprint (MANDATORY - Before Any Code)

**Timeline:** 2-3 days maximum
**Agent:** Analyst Agent
**Tool:** WebStorm HTTP Client for API testing

**Deliverables:**
- HTTP request scenarios documented for each API
- Response samples captured and analyzed
- Pricing/quota limits confirmed
- Data quality assessment (is it usable?)
- **Go/No-Go decision** per API

**Success Criteria:**
- ✅ Each API has working HTTP request example
- ✅ Free tier confirmed or API marked as "cut from MVP"
- ✅ Feature dependency matrix updated based on API availability

**Kill Switch:** If >50% of planned APIs are unavailable/paid → **Pivot to manual-first MVP** before writing code

---

### Feature Tiers with Kill Switches

Features organized by dependency and abandonment criteria.

#### **Tier 0 - Core Non-Negotiable (Manual-First)**

**Must Have:**
- ✅ Add/Edit/Delete games (manual entry)
- ✅ Core fields: Title, Description, Genre, Platform, Format (Physical/Digital)
- ✅ List view with search/filter/sort
- ✅ Basic cover art upload

**Architecture Focus:**
- Entity design (`Game`)
- Repository pattern (IndexedDB adapter)
- Basic CRUD Use Cases
- Simple React components

**Success Gate:** Must be **fully functional end-to-end by Week 4**

**Kill Switch:** If not working by Week 4 → Pause project, reassess architecture approach

---

#### **Tier 1 - API-Dependent (Conditional on Phase 0)**

**Depends on API Validation:**
- ⚠️ Metadata auto-fetch (IGDB/RAWG)
- ⚠️ Trophy sync (PSN/Xbox/Steam)
- ⚠️ Cover art auto-download

**Include Only If:**
- Phase 0 confirms free API availability
- Acceptable quotas/rate limits
- Data quality meets needs

**Kill Switch:** If APIs unavailable/paid → **CUT from MVP**, ship manual-only version

**Fallback Strategy:**
- Manual entry remains first-class experience
- Architecture designed with "API ports" for future paid API integration
- Document: "Features cut due to API economics - here's how we'd add them later"

---

#### **Tier 2 - Progressive Enhancement**

**Add After Tier 0+1 Proven:**
- 🔄 Offline PWA (Service Workers)
- 🔄 Price tracking & wishlist alerts
- 🔄 Play Readiness Score
- 🔄 Maintenance tracking system

**Complexity Budget:** Max 2 weeks per feature

**Kill Switch:** If any feature takes >2 weeks → **Defer to post-MVP**, document complexity lessons

**Success Metric:** Each feature ships in <2 weeks or gets cut. No exceptions.

---

### Weekly Shipping Discipline

**The Golden Rule: One Shippable Feature Per Week**

**Week 1:** Add game manually + display in list ✅ WORKING
**Week 2:** Search/filter working ✅ WORKING
**Week 3:** Edit/delete working ✅ WORKING
**Week 4:** Cover art upload ✅ WORKING

**Red Flag Protocol:**
- If week ends without shippable feature → **Emergency retrospective**
- Question: "Why didn't this ship? Architecture paralysis? Scope creep? Over-engineering?"
- Action: Adjust scope or approach for next week

**Code Quality Pragmatism:**
- "Good enough" code that works > Perfect code that's incomplete
- ✅ Ship functional but imperfect
- ✅ Refactor next week based on learnings
- ❌ Don't hold releases for architectural purity

**Paul's Self-Acknowledgment:** "Je suis très critique sur mon code" → Counter with **pragmatic shipping discipline**

---

### Architecture Time-Boxing

**Design Budget: Maximum 1 Day Per Feature**

**Allowed:**
- ✅ Sketch entity relationships
- ✅ Define use case interface
- ✅ Choose repository adapter pattern
- ✅ Document decision in `DECISIONS.md`

**Not Allowed:**
- ❌ Debating patterns >2 hours
- ❌ Researching "perfect" solution for days
- ❌ Refactoring before feature works

**Decision Tiebreaker:**
- If debating between 2 valid approaches >2 hours → **Flip a coin, pick one, move forward**
- Document: "Chose X over Y because [reason]. Will revisit if problems emerge."
- Iterate later if needed

**Refactoring Window:**
- ✅ Allowed AFTER feature is working
- ✅ Max 20% of next week's time
- ❌ Never refactor incomplete features

---

### Documentation in Real-Time

**Critical Files (Update Weekly):**

**`DECISIONS.md`** - Architecture Decision Log
- Date each decision
- What was chosen and why
- Alternatives considered
- Trade-offs accepted
- **Update while decision is fresh** (not weeks later)

**`LEARNINGS.md`** - Weekly Insights
- What worked this week
- What was harder than expected
- What would I do differently
- Clean Arch insights (good and bad)
- **Add every Friday** - 15min reflection

**`REGRETS.md`** - Honest Mistakes Log
- Decisions I'd change now
- Over-engineered parts
- Under-engineered parts
- **No shame** - these are gold for presentations

**Documentation Principle:**
- 📝 Document while hot (within 24h of decision)
- 📝 Imperfect documentation > No documentation
- 📝 Bullet points > Perfect prose
- 📝 Screenshots + code snippets > Long explanations

---

### Sharing Cadence & Forcing Functions

**Public Accountability (Builds Momentum):**

**Bi-Weekly (Every 2 Weeks):**
- **Team demo:** Show current state to team (safe feedback)
- **LinkedIn/Twitter post:** "This week I implemented X using Clean Arch pattern Y"
- **GitHub push:** Commit with detailed message explaining architectural choices

**Monthly:**
- **Blog post:** 500-1000 words on one specific learning
  - Example: "How I Implemented Repository Pattern in React"
  - Example: "Trophy Sync: When Clean Architecture Helped (And When It Hurt)"
- **Video demo (optional):** 5min walkthrough if motivated

**Quarterly:**
- **Synthesis post:** "3 Months of Clean Arch React - Here's What I Learned"
- **Conference submission:** Submit to Devoxx/DevFest (forces content synthesis)

**Why Share Early:**
- External feedback reveals blind spots
- Public commits = accountability
- Community finds bugs you missed = free QA
- Builds audience for eventual conference talk

**Mindset:** "Imperfect but shared" beats "Perfect but hidden"

---

### Sustainable Pace (Anti-Burnout Protocol)

**The Paul-Approved Work Rhythm:**

**Maximum Investment:** 5 hours/week
- **Weekdays:** ~1 hour/day (5 days = 5h)
- **Weekends:** OFF (unless genuinely motivated that day)
- **No guilt:** If life happens, skip a week

**Energy Management:**
- ✅ Work when energized and curious
- ✅ Stop when frustrated or tired
- ❌ Never force "I should work on the lab"
- ❌ Never sacrifice sleep/health/relationships

**Pause Protocol:**
- If >2 weeks without commits → **Totally OK**
- Document pause: "Taking break for [reason]"
- Return when motivation naturally returns
- **No shame, no guilt**

**Abandon Option:**
- Abandon = **valid outcome** (if documented)
- "I stopped because X" = conference-worthy insight
- Better to abandon with learnings than zombie-code forward

**Success Metric:**
- Project is fun > Project is complete
- Learning is happening > Features are shipping
- Sharing insights > Finishing everything

---

### Feature Prioritization Matrix (API-Aware)

Based on Phase 0 API research results:

| Feature | Manual OK? | API Nice-to-Have? | API Mandatory? | MVP Tier |
|---------|------------|-------------------|----------------|----------|
| Add/Edit/Delete Game | ✅ YES | Metadata fetch | ❌ NO | Tier 0 |
| Search/Filter/Sort | ✅ YES | - | ❌ NO | Tier 0 |
| Cover Art | ✅ Manual upload | Auto-download | ❌ NO | Tier 0 |
| Trophy Sync | ⚠️ Limited | ✅ YES | ❌ NO | Tier 1 |
| Price Tracking | ❌ NO (not useful manual) | - | ✅ YES | Tier 2 (cut if no API) |
| Play Readiness | ✅ YES | Install status | ❌ NO | Tier 2 |
| Maintenance | ✅ YES | - | ❌ NO | Tier 2 |
| Wishlist | ✅ YES | Price alerts | ❌ NO | Tier 2 |

**Decision Rule:**
- ✅ Manual OK = include in MVP regardless of APIs
- ⚠️ API Nice-to-Have = include if Phase 0 validates, graceful degradation to manual
- ❌ API Mandatory = **CUT from MVP** if Phase 0 fails

**Pragmatic Scope:**
- Ship Tier 0 first
- Add Tier 1 only if APIs validated
- Defer Tier 2 until Tier 0+1 proven

---

### Summary: The Guardrails in Action

**Before Code (Phase 0):**
- ✅ Research & test ALL APIs with WebStorm HTTP Client
- ✅ Document findings
- ✅ Adjust MVP scope based on reality

**During Development:**
- ✅ Ship one feature per week
- ✅ Time-box architecture decisions (max 1 day)
- ✅ "Good enough" code > perfect paralysis
- ✅ Document decisions weekly (DECISIONS.md, LEARNINGS.md)

**Sharing:**
- ✅ Bi-weekly public updates (social media, team demos)
- ✅ Monthly blog posts
- ✅ Quarterly synthesis

**Sustainability:**
- ✅ Max 5h/week
- ✅ Weekends OFF unless motivated
- ✅ Pause/abandon = valid options

**Philosophy:**
Working software with documented learnings > Perfect architecture that never ships.

---

## Architecture Decision Records (ADRs)

Key architectural decisions with trade-offs, rationale, and Clean Architecture implications.

### ADR-001: Data Fetching Strategy - Evaluate React Query Need vs Standard Fetch

**Date:** 2026-01-15
**Status:** To Be Decided (requires evaluation)
**Deciders:** Paul

#### Context

Need data fetching strategy for external APIs (IGDB, PSN, etc.) and local IndexedDB reads.

**React Query features:**
- Cache management
- Automatic retries
- Request deduplication
- Background refetching
- Optimistic updates
- Query invalidation

**Question:** Are these features necessary for this lab's use cases?

#### Paul's Insight

"React Query n'a rien à prouver, je connais bien cette lib. Mais si c'est juste pour faire des fetch sans cache/retry, autant faire un fetch standard."

**Critical point:** React Query hooks vont à l'encontre de Clean Architecture
- `useQuery` direct dans composants = violation de séparation
- **Solution:** Utiliser **@tanstack/query-core** (pas les hooks React)
- Injection via **InversifyJS** dans les Use Cases
- React hooks = thin wrapper au-dessus de Query Core

#### Decision Options

**Option A: Standard Fetch + Manual Cache**
```typescript
// Domain layer
interface GameRepository {
  fetchMetadata(title: string): Promise<GameMetadata>;
}

// Infrastructure layer
class IGDBAdapter implements GameRepository {
  async fetchMetadata(title: string): Promise<GameMetadata> {
    const response = await fetch(`/api/igdb/search?q=${title}`);
    return response.json();
  }
}
```

**Pros:**
- ✅ Zero dependencies
- ✅ Clean Architecture pure
- ✅ Simple, predictable

**Cons:**
- ❌ No caching (re-fetch same data multiple times)
- ❌ No retry logic
- ❌ Manual error handling

---

**Option B: Query Core + InversifyJS (Clean Arch compliant)**
```typescript
// Infrastructure layer - Query Core wrapper
import { QueryClient } from '@tanstack/query-core';

class QueryCoreGameRepository implements GameRepository {
  constructor(private queryClient: QueryClient) {}

  async fetchMetadata(title: string): Promise<GameMetadata> {
    return this.queryClient.fetchQuery({
      queryKey: ['game-metadata', title],
      queryFn: () => fetch(`/api/igdb/search?q=${title}`).then(r => r.json()),
      staleTime: 1000 * 60 * 60, // 1h cache
    });
  }
}

// Dependency Injection container
container.bind<GameRepository>('GameRepository')
  .to(QueryCoreGameRepository);

// Use Case (clean, no React dependency)
class FetchGameMetadataUseCase {
  constructor(@inject('GameRepository') private repo: GameRepository) {}

  async execute(title: string): Promise<GameMetadata> {
    return this.repo.fetchMetadata(title);
  }
}

// React presentation layer - thin wrapper
function useGameMetadata(title: string) {
  const useCase = container.get<FetchGameMetadataUseCase>('FetchGameMetadataUseCase');
  // Minimal React adapter
}
```

**Pros:**
- ✅ Cache + retry + deduplication
- ✅ Clean Architecture respected (Query Core in infra, not React hooks in domain)
- ✅ InversifyJS = proper DI pattern

**Cons:**
- ⚠️ More complex setup
- ⚠️ @tanstack/query-core + inversify dependencies

---

**Option C: React Query Hooks (Pragmatic, less Clean Arch)**
```typescript
// Presentation layer - direct hooks
function useGameMetadata(title: string) {
  return useQuery({
    queryKey: ['game-metadata', title],
    queryFn: () => fetch(`/api/igdb/search?q=${title}`).then(r => r.json()),
  });
}
```

**Pros:**
- ✅ Fast to implement
- ✅ Standard React pattern

**Cons:**
- ❌ Violates Clean Architecture (presentation layer calls infra directly)
- ❌ Hard to swap React Query later

#### Proposed Decision

**Start with Option A (Standard Fetch)** for initial features
- Prove Clean Architecture first with simplest possible infra
- Document: "Here's Clean Arch without framework magic"

**Evaluate need for caching after 2-3 features:**
- If re-fetching same API data becomes painful → **Option B (Query Core + InversifyJS)**
- Document: "Here's when we needed caching and how we added it cleanly"

**Never use Option C** - defeats lab purpose

#### Consequences

- ✅ Lab demonstrates Clean Arch with and without caching framework
- ✅ InversifyJS shows proper DI in React/TypeScript
- ⚠️ More setup work if we adopt Query Core later
- 📝 **Document decision point:** "Week X: Switched to Query Core because [reason]"

#### Open Questions

- Does this lab need aggressive caching? (APIs have quotas?)
- Is manual cache (Map/WeakMap) sufficient for MVP?
- InversifyJS learning curve worth it for lab?

---

### ADR-002: Storage Strategy - IndexedDB First, Flexible Backend Later

**Date:** 2026-01-15
**Status:** Accepted
**Deciders:** Paul (with architect panel input)

#### Decision

**Phase 1:** IndexedDB with `idb` library (local-first, no backend)
**Phase 2 (if needed):** Firebase Firestore OR NestJS backend OR keep IndexedDB forever

#### Rationale

**Why IndexedDB first:**
- ✅ Zero backend complexity = 100% focus on Clean Arch React patterns
- ✅ Offline-first natural
- ✅ Migration to backend = **proof** that Repository pattern works
- ✅ Sufficient for thousands of games

**Backend decision deferred:**
- Firebase Firestore = easiest scaling (backend-as-a-service, real-time sync)
- NestJS = full control, server-side jobs (price scraping, trophy sync)
- Keep IndexedDB = if single-device usage sufficient

**Paul's insight:** "Firebase pourrait suffire pour scale sans gérer un backend"

#### Implementation

**Repository Interface (Domain - storage-agnostic):**
```typescript
interface GameRepository {
  save(game: Game): Promise<void>;
  findById(id: GameId): Promise<Game | null>;
  findAll(filters?: GameFilters): Promise<Game[]>;
  delete(id: GameId): Promise<void>;
}
```

**Phase 1: IndexedDB Adapter**
```typescript
import { openDB, IDBPDatabase } from 'idb';

class IndexedDBGameRepository implements GameRepository {
  private dbPromise: Promise<IDBPDatabase>;

  constructor() {
    this.dbPromise = openDB('game-collection', 1, {
      upgrade(db) {
        const store = db.createObjectStore('games', { keyPath: 'id' });
        store.createIndex('title', 'title');
        store.createIndex('platform', 'platform');
      },
    });
  }

  async save(game: Game): Promise<void> {
    const db = await this.dbPromise;
    await db.put('games', this.toDTO(game));
  }

  private toDTO(game: Game): GameDTO {
    // Entity → Storage DTO mapping
  }

  private toDomain(dto: GameDTO): Game {
    // Storage DTO → Entity mapping
  }
}
```

**Phase 2a: Firebase Adapter (if multi-device sync needed)**
```typescript
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

class FirestoreGameRepository implements GameRepository {
  private db = getFirestore();

  async save(game: Game): Promise<void> {
    const gamesRef = collection(this.db, 'games');
    await setDoc(doc(gamesRef, game.id.value), this.toDTO(game));
  }
  // ... same interface, different implementation
}
```

**Phase 2b: NestJS HTTP Adapter (if server jobs needed)**
```typescript
class HTTPGameRepository implements GameRepository {
  constructor(private httpClient: HttpClient) {}

  async save(game: Game): Promise<void> {
    await this.httpClient.post('/api/games', this.toDTO(game));
  }
  // ... same interface, different implementation
}
```

#### Migration Triggers

**Firebase Firestore when:**
- Multi-device sync required (play on desktop, check on mobile)
- Real-time updates desired
- Don't want to manage backend infrastructure

**NestJS Backend when:**
- Server-side scheduled jobs (trophy sync, price scraping)
- Complex backend logic
- Need full API control

**Stay IndexedDB when:**
- Single-device usage sufficient
- Privacy preference (data stays local)
- Simple use cases

#### Consequences

**Positive:**
- ✅ Simplest possible MVP (no backend)
- ✅ **Proves Repository pattern** when swapping storage
- ✅ Flexibility to choose backend based on actual needs
- ✅ Offline-first by default

**Negative:**
- ⚠️ IndexedDB ~50MB limit (sufficient for thousands of games)
- ⚠️ No multi-device sync in Phase 1
- ⚠️ Migration work if backend added (but that's the lab learning!)

**Lab Documentation:**
- Track effort to swap IndexedDB → Firebase
- Document: "Changed 1 file (repository adapter), 0 Use Cases touched"
- This is the proof that Clean Architecture works

---

### ADR-003: PWA Strategy - Early Adoption to Force Clean Separation

**Date:** 2026-01-15
**Status:** Proposed (with MSW investigation required)
**Deciders:** Paul

#### Context

**Initial recommendation:** Delay PWA to Phase 3 (after architecture proven)

**Paul's challenge:** "PWA dès le début peut AIDER la séparation des responsabilités"

**Paul is right.** PWA constraints force better architecture:
- Offline/online strategy MUST be in Repository layer
- Service Worker = infrastructure concern, invisible to domain
- If Use Cases work offline/online transparently → Clean Arch success

#### Decision

**Implement PWA from Week 1** (not deferred)

**Why early PWA strengthens Clean Architecture:**
- Forces offline-first thinking from the start
- Repository MUST handle online/offline/sync seamlessly
- Use Cases stay clean (they don't know about network state)
- Service Worker = infrastructure detail, properly separated

#### Critical Investigation Required

**MSW (Mock Service Worker) Conflict:**

Paul uses MSW for dev mocking. MSW also uses Service Worker.

**Question:** Can MSW (dev) and PWA SW (prod) coexist?

**Investigation needed:**
- MSW in development mode only?
- PWA SW in production only?
- Can 2 Service Workers register simultaneously?
- MSW has `quiet` mode for production builds?

**Research task:** Test MSW + Vite PWA Plugin compatibility

**Possible solutions:**
1. MSW dev-only, PWA SW prod-only (separate scopes)
2. MSW `browser` mode without SW (falls back to XHR intercept)
3. Conditional SW registration based on env

**Blocker status:** Must resolve before PWA implementation

#### Implementation Strategy

**Week 1: Basic PWA Setup**
```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.igdb\.com\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 24h
              },
            },
          },
        ],
      },
    }),
  ],
});
```

**Repository handles offline/online transparently:**
```typescript
class OfflineFirstGameRepository implements GameRepository {
  constructor(
    private localDB: IDBGameRepository,
    private remoteAPI: IGDBAdapter,
    private syncQueue: SyncQueue
  ) {}

  async save(game: Game): Promise<void> {
    // Always save locally first (instant UX)
    await this.localDB.save(game);

    // Try sync to remote if online
    if (navigator.onLine) {
      try {
        await this.remoteAPI.sync(game);
      } catch (error) {
        // Queue for background sync
        this.syncQueue.enqueue({ type: 'save', game });
      }
    } else {
      // Offline - queue for later
      this.syncQueue.enqueue({ type: 'save', game });
    }
  }
}

// Use Case is CLEAN - no knowledge of offline/online
class AddGameUseCase {
  constructor(private repo: GameRepository) {}

  async execute(data: AddGameDTO): Promise<Game> {
    const game = Game.create(data);
    await this.repo.save(game); // Works online or offline!
    return game;
  }
}
```

#### Consequences

**Positive:**
- ✅ **Stronger Clean Architecture proof** (offline/online transparent to domain)
- ✅ PWA constraints force better separation early
- ✅ Users get offline capability from day 1
- ✅ Lab demonstrates Clean Arch under real constraints

**Negative:**
- ⚠️ MSW conflict must be resolved (investigation required)
- ⚠️ Service Worker debugging complexity early
- ⚠️ Sync queue logic adds complexity

**Lab Documentation Opportunity:**
- Document: "PWA forced us to design Repository properly"
- Show offline/online works without Use Case changes
- This is GOLD for presentation: "Swapped online → offline without touching business logic"

#### Open Questions

**BLOCKER:** MSW + PWA Service Worker compatibility?
- Test in dev environment
- Document workaround if needed
- Fallback: MSW without SW in dev?

**Architecture questions:**
- Sync queue strategy (immediate retry vs background sync API)?
- Conflict resolution when offline changes sync?
- How to handle failed syncs in UI?

#### Next Steps

1. **Research:** Test MSW + Vite PWA Plugin (30min spike)
2. **Document:** MSW/PWA coexistence strategy in `DECISIONS.md`
3. **Implement:** Basic PWA if no blockers
4. **Track:** Time spent on PWA setup vs value gained

---

## Success Criteria

### User Success (Paul, le Collectionneur)

**Primary Success Moment - "Le Plaisir du Collectionneur":**

Au moins **3 moments en 6 mois** où :
1. Tu trouves un jeu de collection intéressant (pas trop cher, pépite)
2. Tu utilises l'app naturellement pour l'ajouter à ta collection
3. Tu joues effectivement à ce jeu et **prends du plaisir**

**Success Indicator:** "Ça vallait le coup" - l'app t'a aidé à capturer et profiter de tes découvertes gaming

**Usage Consistency:**
- Utilisation **naturelle** de l'app (sans te forcer)
- Ouvrir l'app devient un réflexe avant d'acheter ou de choisir quoi jouer
- L'app répond à un besoin réel, pas théorique

**Emotional Success:**
- Satisfaction de voir ta collection organisée
- Soulagement de ne pas racheter un jeu déjà possédé
- Joie de retrouver un jeu oublié grâce au système de rappel d'entretien

---

### Lab Success (Apprentissage & Impact)

**Learning Success - Maîtrise Clean Architecture:**
- Compréhension profonde de **quand** Clean Arch aide vs **quand** c'est overkill
- Capacité à expliquer avec confiance les trade-offs architecturaux
- Documentation honnête des **succès ET échecs** architecturaux
- Au moins **3-4 patterns Clean Arch** bien implémentés et documentés

**Presentation Success - Dépassement Personnel:**

**Le vrai succès =** Avoir le courage de :
1. ✅ Aller **au bout du lab** (terminer ce qui est commencé)
2. ✅ Vaincre **l'angoisse** de présenter devant un public
3. ✅ Partager **honnêtement** (pas du marketing, de vraies leçons)

**Engagement Audience (si présentation):**
- Déclencher une **foulle de questions** pendant/après le talk
- Au moins **5 personnes** viennent te voir pour discuter
- Au moins **1 personne** dit explicitement "Merci, ça va m'aider"
- Questions de qualité = l'audience a compris et est intéressée

**Flexibilité:** La forme finale (Devoxx, blog, vidéo, team talk) sera déterminée par les learnings du lab - c'est OK de ne pas savoir maintenant.

---

### Community Success (Héritage)

**Minimum Viable Impact:**

Au moins **1 développeur** dit "Ce lab m'a été utile" (direct feedback)

**Reach Goal - Adoption Réelle:**

Au moins **1 projet** (dans ton équipe ou communauté) adopte des principes Clean Arch en citant ce lab comme référence ou inspiration

**Open Source Quality:**
- **Repository GitHub** bien structuré et compréhensible
- **Documentation README** détaillée avec architecture expliquée
- **Exemples de code commentés** montrant les patterns implémentés
- **App fonctionnelle** que d'autres peuvent tester/cloner
- **Learnings documentés** (DECISIONS.md, LEARNINGS.md, REGRETS.md)

**Multi-Channel Distribution:**
- GitHub (code + documentation)
- Blog posts / articles
- Talks / présentations
- Vidéos / tutorials (optionnel)
- Social media (LinkedIn, Twitter) - insights courts

**Philosophy:** "Un dev aidé" vaut plus que "mille stars GitHub passives"

---

### Technical Success

**Clean Architecture Proof - Repository Pattern:**
- ✅ Swap IndexedDB → Backend (Firebase ou NestJS) en changeant **1 seul fichier** (l'adapter)
- ✅ **0 Use Cases touchés** lors du swap
- ✅ Documentation du temps nécessaire et des difficultés rencontrées

**Development Velocity:**
- Features implémentées plus **rapidement** au fil du temps (pas plus lentement)
- Architecture **aide** au lieu de **ralentir** après la courbe d'apprentissage
- Confiance croissante : "Je sais où mettre ce code" au lieu de "Où dois-je mettre ça ?"

**Code Quality & Maintainability:**
- Codebase reste **navigable** à 6 mois (ne devient pas "sac de nœuds")
- Ajout de features au mois 6 aussi **propre** qu'au mois 1
- Refactorings possibles sans peur de tout casser

**Architecture Validation:**
- Use Cases **purs** (aucune dépendance infrastructure)
- Entities **métier** (business logic, pas technique)
- Adapters **swappables** (interfaces respectées)
- UI **découplée** (peut changer sans toucher domain)

**Success OR Failure - Both Valid:**
- ✅ Si Clean Arch fonctionne bien = succès, à documenter
- ✅ Si Clean Arch est trop lourd = AUSSI un succès si bien documenté
- **Les deux outcomes ont de la valeur** pour la communauté

---

### Measurable Outcomes

**6-Month Success Checklist:**

**User Success:**
- [ ] Au moins 3 "moments de joie collectionneur" avec l'app
- [ ] Utilisation naturelle sans forcer (réflexe d'ouvrir l'app)
- [ ] Collection organisée et système d'entretien utilisé

**Learning Success:**
- [ ] 3-4 patterns Clean Arch implémentés et documentés
- [ ] DECISIONS.md + LEARNINGS.md + REGRETS.md maintenus
- [ ] Peut expliquer quand Clean Arch aide vs quand c'est overkill

**Sharing Success:**
- [ ] Au moins 1 article/blog publié
- [ ] Au moins 1 présentation (équipe, meetup, ou conférence)
- [ ] GitHub repo public avec README complet

**Community Impact:**
- [ ] Au moins 1 dev dit "c'était utile"
- [ ] Reach: 1 projet utilise Clean Arch grâce au lab

**Technical Proof:**
- [ ] Swap storage réussi (IndexedDB → autre) sans toucher Use Cases
- [ ] Velocity stable ou améliorée (pas dégradée)
- [ ] Codebase maintenable à 6 mois

**Personal Growth:**
- [ ] Lab terminé (pas abandonné à mi-parcours)
- [ ] Présenté publiquement malgré l'angoisse
- [ ] Fierté du travail accompli et partagé

---

## Product Scope

### MVP - Minimum Viable Product

**Core Features (Non-Negotiable):**

**1. Collection Management (Recensement)**
- Add/Edit/Delete games manually
- Core fields: Title, Description, Genre, Platform, Format (Physical/Digital), Purchase Date
- Cover art upload (manual)
- Search, filter, sort capabilities
- **Why MVP:** Foundation absolue - sans ça, rien d'autre n'a de sens
- **Success Metric:** Paul peut ajouter un jeu trouvé en <2 minutes

**2. Wishlist Management**
- Add/Remove games to wishlist
- Basic price tracking (manual entry or API if validated)
- Priority levels (must-have, nice-to-have)
- Notes per wishlist item (why I want this, max price)
- **Why MVP:** Complète le cycle collectionneur (want → own → play)
- **Success Metric:** Paul utilise la wishlist avant chaque achat potentiel

**3. Console & Collection Maintenance System**
- Create maintenance tasks per console/collection
- Complexity rating (⭐ to ⭐⭐⭐⭐⭐)
- Maintenance history with notes and photos
- Next maintenance reminder (flexible, not automated calendar)
- **Why MVP:** Forte motivation personnelle, feature unique différenciatrice
- **Success Metric:** Au moins 1 maintenance task complétée en 3 mois

**Enhanced Features (If APIs Validated in Phase 0):**

**4. Metadata Auto-Enrichment (Conditional)**
- Auto-fetch game details from IGDB/RAWG
- Cover art auto-download
- **Condition:** Only if Phase 0 API research validates free APIs
- **Fallback:** Manual entry remains first-class experience

**5. Trophy/Achievement Sync (Conditional)**
- Sync from PSN/Xbox/Steam
- Display completion status
- **Condition:** Only if Phase 0 validates API availability
- **Fallback:** Manual progress tracking

**Essential Non-Functional Requirements:**

**Clean Architecture Implementation:**
- Every feature demonstrates Clean Arch patterns
- Repository pattern for all data access
- Use Cases for all business logic
- Entities pure (no infrastructure dependencies)
- **Why:** This IS the lab - architecture is the experiment

**PWA Capabilities:**
- Offline-capable (LocalStorage or IndexedDB + Service Worker)
- Installable on mobile/desktop
- Responsive design (mobile-first)
- **Why:** Forces proper offline/online separation (Repository pattern proof)

**Documentation as You Build:**
- DECISIONS.md updated weekly
- LEARNINGS.md captures insights
- REGRETS.md documents mistakes
- Code comments explain "why" not "what"
- **Why:** Real-time documentation = honest, not reconstructed later

---

### Growth Features (Post-MVP)

**Deferred to V2.0+ (After MVP Success):**

**Enhanced Collection Features:**
- 🟢 Play Readiness Score (3-color system)
- 💿 Multi-version management (same game, multiple platforms)
- 📦 Physical storage location tracking
- 📊 Statistics & analytics dashboards

**Advanced Maintenance:**
- 🔧 Maintenance resource library (tutorials, professional contacts)
- 📅 Automated maintenance reminders
- 🟢🟡🔴 Console health dashboard

**Social & Discovery:**
- 👨‍👩‍👧‍👦 Family lending tracker
- 🎲 Random game night generator
- 🎯 Forgotten gems spotlight

**Technical Enhancements:**
- 🔄 Multi-device sync (requires backend)
- 🔔 Push notifications for price alerts
- 🤖 AI-powered insights & recommendations

**Why Deferred:**
- MVP already substantial for learning Clean Arch
- Core 3 features solve primary personal needs
- Post-MVP features can explore additional architectural patterns
- Allows iterative learning and refinement

---

### Vision (Future - Dream Version)

**Long-Term Possibilities:**

**Expanded Platform:**
- Movie & book collection management (same architecture, different domain)
- Universal collector's tool (gaming as first vertical)

**Advanced AI Features:**
- Personalized game recommendations based on play history
- Price prediction for collectibles
- Rarity detection and valuation

**Community Features:**
- Collection sharing with other collectors
- Trading/selling marketplace integration
- Collector community forums

**Enterprise/Commercial (If Validated):**
- White-label solution for specialty retailers
- Collection insurance integrations
- Professional grading service integrations

**Philosophy:** Dream big, ship small. Vision guides direction, MVP proves concept.

---

## User Journeys

### Journey 1: Paul - La Découverte de la Pépite

**Persona: Paul - Le Collectionneur Pragmatique**

*30-quelque chose, développeur React passionné, collectionneur multi-plateformes depuis l'adolescence. Collection de ~200 jeux accumulés sur 20 ans (PS1, PS2, PS3, PS4, PS5, Xbox 360, Steam). Frustré par le désordre de sa collection et les rachats accidentels.*

#### Opening Scene - Un samedi après-midi sur Leboncoin

Paul scroll Leboncoin en cherchant des jeux PS3 rétro. Il tombe sur une annonce : **"Silent Hill 2 PS2 - Version FR complète - 25€"**. Son cœur s'accélère - c'est un jeu qu'il cherche depuis des mois, et le prix est raisonnable pour une pièce collector.

**Mais le doute s'installe :** "Attends... est-ce que je l'ai déjà ?" Il se souvient vaguement d'avoir acheté Silent Hill quelque chose il y a 5 ans. Mais lequel ? Le 1 ? Le 3 ? Sur quelle plateforme ?

**Situation actuelle (sans l'app) :** Il devrait fouiller physiquement dans ses cartons au garage, vérifier sa liste Excel désorganisée, ou risquer d'acheter un doublon à 25€.

**Émotion :** Frustration + peur de gaspiller de l'argent.

#### Rising Action - Ouvrir l'app naturellement

Paul ouvre son app **lab-clean-architecture-react** sur son téléphone. Il tape "Silent Hill" dans la recherche.

**Résultat immédiat :** Liste filtrée s'affiche :
- Silent Hill 1 (PS1) - Possédé ✅
- Silent Hill 3 (PS2) - Possédé ✅
- Silent Hill 2 (PS2) - **Absent de la collection** ❌

**Relief immédiat :** "OK, je ne l'ai pas ! Je peux acheter sans risque."

Mais Paul va plus loin. Il ouvre sa **wishlist** dans l'app. Silent Hill 2 PS2 y est depuis 3 mois, avec sa note : *"Max 30€ pour version complète FR. Vérifier état boîtier."*

**Décision éclairée :** 25€ < 30€ max budget → **C'est un go !**

#### Climax - L'achat et l'ajout à la collection

Paul contacte le vendeur, négocie à 23€, récupère le jeu le lendemain.

**De retour chez lui, jeu en main :** Il ouvre l'app et ajoute le jeu à sa collection :
- Photo du boîtier (scan avec appareil photo)
- Titre : Silent Hill 2
- Plateforme : PS2
- Format : Physique
- Prix payé : 23€
- État : Excellent
- Date d'achat : 16 janvier 2026
- Notes : "Trouvaille Leboncoin - version FR complète comme je voulais !"

**Temps total pour l'ajout :** <2 minutes.

L'app retire automatiquement Silent Hill 2 de sa wishlist et l'ajoute à la collection.

#### Resolution - Le plaisir de jouer + fierté de collectionneur

**Le soir même :** Paul branche sa PS2 (qu'il a entretenue le mois dernier grâce à son système de rappel maintenance), lance Silent Hill 2, et joue 3 heures.

**Émotion finale :**
- ✅ Plaisir de jouer à un jeu qu'il cherchait depuis des mois
- ✅ Satisfaction d'avoir payé le bon prix (23€ vs budget 30€)
- ✅ Fierté : sa collection est organisée et consultable en 10 secondes
- ✅ Zéro stress : il sait exactement ce qu'il possède

**Success Statement:** "Putain, cette app vaut vraiment le coup. Sans elle, j'aurais soit raté cette pépite, soit acheté un doublon."

---

### Journey 2: Paul - L'Entretien de la Console Vintage

**Persona: Le même Paul - Propriétaire de matériel rétro fragile**

#### Opening Scene - La PS2 qui tousse

Un mercredi soir, Paul veut jouer à un jeu PS2. Il allume la console : **bruit de lecteur qui peine, jeu qui ne charge pas.**

**Émotion :** Panique. "Merde, elle va lâcher. Quand est-ce que je l'ai nettoyée la dernière fois ?"

Il ouvre l'app, section **Maintenance**. Il voit :
- **PS2 (console)** - Dernière maintenance : *3 octobre 2025 (3 mois)*
- **Statut :** 🟡 **Entretien recommandé bientôt**

**Réalisation :** "Ah oui, ça fait 3 mois. Pas étonnant qu'elle tousse."

#### Rising Action - Création de la tâche d'entretien

Paul crée une nouvelle tâche de maintenance :
- **Console :** PS2
- **Type :** Nettoyage lentille laser + dépoussiérage interne
- **Complexité :** ⭐⭐⭐ (moyen - nécessite ouverture console)
- **Ressources liées :** Lien YouTube vers tuto "Nettoyer PS2 slim"
- **Date prévue :** Ce week-end (18 janvier 2026)

L'app affiche le statut de la PS2 : 🔴 **En attente d'entretien urgent**.

#### Climax - L'entretien avec documentation

**Samedi matin :** Paul sort son tournevis, ouvre la PS2 en suivant le tuto YouTube.

**Pendant l'entretien :** Il prend 3 photos dans l'app :
1. **Avant :** Poussière accumulée sur la lentille
2. **Pendant :** Lentille nettoyée à l'alcool isopropylique
3. **Après :** Console rassemblée, test de lecture OK

Il complète la tâche dans l'app :
- **Date réalisée :** 18 janvier 2026
- **Notes :** "Lentille très sale après 3 mois. Nettoyage + dépoussiérage complet. Fonctionne nickel maintenant."
- **Photos :** 3 uploadées
- **Prochaine maintenance :** Dans 2-3 mois (alerte automatique)

Statut PS2 passe à : 🟢 **Bon état - entretenue récemment**

#### Resolution - Console sauvée + traçabilité

**Résultat immédiat :** La PS2 fonctionne parfaitement. Paul peut jouer à Silent Hill 2 sans problème.

**Valeur long-terme :**
- ✅ Historique complet de maintenance de la PS2 (avec photos et dates)
- ✅ Sauvegarde de matériel vintage précieux
- ✅ Rappel automatique pour ne plus oublier l'entretien
- ✅ Ressources YouTube sauvegardées (pas besoin de rechercher à nouveau)

**Success Statement:** "Ma PS2 a 20 ans et fonctionne encore grâce à l'entretien régulier. L'app m'empêche de l'oublier et documente tout. C'est exactement ce que je voulais."

---

### Journey 3: Alex - Le Développeur React qui Découvre le Lab

**Persona: Alex - Senior React Developer**

*28 ans, développeur React depuis 5 ans dans une scale-up. Frustré par les projets React qui deviennent des "sacs de nœuds" après 6 mois. Cherche des patterns d'architecture frontend solides. Sceptique sur Clean Architecture (trop backend-focused ?).*

#### Opening Scene - LinkedIn scroll & découverte

Alex scroll LinkedIn un mardi midi. Il voit un post de Paul :

> "🎮 J'expérimente Clean Architecture dans React avec un vrai projet : un Game Collection Manager.
>
> **Ce que je documente :** Quand ça aide, quand c'est overkill, les vrais trade-offs.
>
> Pas du marketing, des vraies leçons. Repo ouvert, code commenté, décisions expliquées.
>
> [lien GitHub]"

**Réaction d'Alex :** "Hmm, Clean Arch en React ? J'ai vu 100 articles théoriques mais jamais de vrai code en production. Voyons voir..."

#### Rising Action - Exploration du repo GitHub

Alex clique sur le lien GitHub. Il atterrit sur le README :

**Ce qu'il lit :**
- Clear explanation de la structure du projet
- "**Honest experimentation** - documenting successes AND failures"
- Architecture diagram claire (Domain → Use Cases → Infrastructure → Presentation)
- Links vers DECISIONS.md, LEARNINGS.md, REGRETS.md

**Curiosité piquée.** Alex explore le code :

```
/src/
  /domain/
    /entities/
      Game.ts          ← "Aucune dépendance infra, pur métier"
    /repositories/
      GameRepository.ts  ← "Interface, pas implémentation"
  /application/
    /use-cases/
      AddGameUseCase.ts  ← "Business logic, test unitaire facile"
  /infrastructure/
    /persistence/
      IndexedDBGameRepository.ts  ← "Implémentation concrète"
  /presentation/
    /components/
      GameList.tsx  ← "UI découplée"
```

**Alex ouvre `DECISIONS.md` :**

> **ADR-002: Storage Strategy - IndexedDB First**
>
> J'ai commencé avec IndexedDB. Si je migrate vers Firebase plus tard, je ne toucherai QUE IndexedDBGameRepository.ts. Les Use Cases restent intacts. **C'est le test ultime du Repository pattern.**

**Réaction d'Alex :** "Putain, c'est exactement ce que je cherche. Un vrai exemple avec de vraies décisions expliquées."

#### Climax - Le moment "Aha!"

Alex lit `LEARNINGS.md` - Semaine 4 :

> **Semaine 4 - Repository pattern en action**
>
> Cette semaine j'ai swap IndexedDB → Firebase pour tester.
>
> **Fichiers modifiés :** 1 (FirebaseGameRepository.ts - nouvel adapter)
> **Use Cases touchés :** 0
> **Tests cassés :** 0
> **Temps migration :** 2h
>
> **Lesson:** Le Repository pattern FONCTIONNE. L'inversion de dépendance n'est pas juste théorique.

**Le moment "Aha!" d'Alex :** "C'est pas du bullshit. Il a VRAIMENT fait le test. Et ça a marché."

Alex clone le repo, l'installe localement, explore le code en profondeur. Il teste l'app. Tout fonctionne.

#### Resolution - Impact sur le projet d'Alex

**Deux semaines plus tard :**

Alex propose à son équipe d'adopter Clean Architecture pour leur nouveau module React.

Il référence le lab de Paul dans sa proposition :
- Montre le code comme exemple
- Cite les ADRs pour justifier les choix
- Propose une structure similaire

**L'équipe accepte.** Alex commence l'implémentation en s'inspirant du lab.

**Un mois plus tard :** Alex ouvre une Issue GitHub sur le repo de Paul :

> "Merci pour ce lab. Mon équipe a adopté Clean Arch grâce à ton travail. On a pu refactorer un module legacy en 2 semaines. Le Repository pattern nous a sauvés. 🙏"

**Success Statement (Paul) :** "Un dev m'a dit que ça l'a aidé. Mission accomplie. Le lab a eu un impact réel."

---

### Journey Requirements Summary

#### Capabilities Revealed by User Journeys

**From Journey 1 (Découverte Pépite) - Collection Management Requirements:**

1. **Search & Filter System**
   - Fast text search across collection
   - Filter by platform, format (physical/digital), title
   - Instant results (<500ms)

2. **Wishlist Management**
   - Add/remove games to wishlist
   - Track max budget per item
   - Notes/context per wishlist item
   - Auto-remove from wishlist when added to collection

3. **Quick Game Addition**
   - Mobile-friendly input form
   - Photo upload for cover art
   - Essential fields only (title, platform, price, date, notes)
   - <2 minutes to complete addition

4. **Collection Verification**
   - "Do I own this?" check in <10 seconds
   - Visual confirmation (cover art, platform badge)

**From Journey 2 (Entretien Console) - Maintenance System Requirements:**

1. **Maintenance Task Management**
   - Create tasks per console/collection
   - Complexity rating (⭐ to ⭐⭐⭐⭐⭐)
   - Link external resources (YouTube tutorials)
   - Flexible scheduling (not rigid calendar)

2. **Maintenance History & Documentation**
   - Photo upload (before/during/after)
   - Text notes per completed task
   - Date tracking (last maintenance, next recommended)
   - Complete maintenance timeline per console

3. **Console Health Dashboard**
   - Visual status indicators (🟢🟡🔴)
   - Last maintenance date display
   - Alert for overdue maintenance

4. **Resource Library**
   - Save tutorial links per console type
   - Quick access during maintenance tasks

**From Journey 3 (Développeur Découvre Lab) - Open Source & Documentation Requirements:**

1. **Repository Documentation**
   - Clear README with architecture explanation
   - Architecture diagram (layers visualization)
   - Code structure explanation

2. **Decision Documentation**
   - DECISIONS.md with Architecture Decision Records
   - LEARNINGS.md with weekly insights
   - REGRETS.md with honest mistakes

3. **Code Quality for Learning**
   - Well-commented code explaining "why"
   - Clean separation of concerns visible in file structure
   - Test examples showing patterns

4. **Working Application**
   - Deployable/runnable example
   - Real functionality (not just skeleton)
   - Proves architecture works in practice

## Innovation & Novel Patterns

### Detected Innovation Areas

**1. Clean Architecture Laboratory in React Ecosystem**
- **Novel Aspect**: Systematic experimentation with Clean Architecture principles in React, a framework traditionally used with less formal architectural patterns
- **Unique Approach**: Using Query Core + InversifyJS to maintain strict separation of concerns, bypassing React Query hooks that would violate architectural boundaries
- **Dual Success Model**: Success defined as either proving Clean Architecture works in React OR documenting why it doesn't (both outcomes have educational value)
- **Technical Innovation**: Documenting the tension between React's ecosystem patterns (hooks, component coupling) and Clean Architecture principles (dependency inversion, use case isolation)

**2. Progressive Documentation as Learning Methodology**
- **Novel Aspect**: Treating documentation as a primary output, not just a byproduct
- **Honest Documentation Philosophy**: Capturing real decisions, trade-offs, and potential failures rather than retrospective success narratives
- **Architecture Decision Records in Real-Time**: Documenting ADRs during development, including uncertainty and evolution
- **Target**: Devoxx/DevFest presentation showcasing authentic developer experience vs. polished case study

**3. Progressive Dependency Inversion as Demonstration**
- **Novel Aspect**: Planned evolution from IndexedDB → Backend as a **pedagogical demonstration** of Clean Architecture benefits
- **Story Arc**: "Started with IndexedDB, added backend 6 months later, changed only Repository implementation without touching Use Cases"
- **Teaching Value**: Real-world proof that architectural investment pays off during technology migration
- **Concrete Example**: Migration from browser storage to cloud backend without rewriting business logic

### Market Context & Competitive Landscape

**Existing Solutions:**
- Game collection managers: Focused on features, not architecture
- React tutorials: Basic patterns without architectural depth
- Clean Architecture examples: Often use Java/Spring, rarely React
- Educational projects: Usually simplified, not "real" applications

**Differentiation:**
- **Hybrid Purpose**: 80% educational experiment, 20% functional tool (genuine use case prevents "toy example" syndrome)
- **Sustainable Pace**: 5h/week max, documenting how architecture enables part-time development
- **Authentic Constraints**: Real APIs, PWA complexity, production considerations
- **Community Value**: Shared learnings benefit React developers exploring architectural patterns

### Validation Approach

**Technical Validation:**
- Can Clean Architecture boundaries be maintained as complexity grows?
- Does dependency inversion actually simplify the IndexedDB → Backend migration?
- Can PWA + MSW + Clean Arch coexist without architectural compromises?
- Time-boxed architecture decisions (max 1 day per feature) - does it work?

**Educational Validation:**
- Does the documentation help other developers understand Clean Architecture in React?
- Community feedback metric: "At least one dev finds it useful" = success
- Presentation acceptance at Devoxx/DevFest validates educational value
- ADRs capture genuine decision-making process (not sanitized retrospectives)

**Execution Validation:**
- Can weekly shipping discipline be maintained with strict architecture?
- Does "good enough" code philosophy align with Clean Architecture principles?
- 5h/week sustainable pace - can architectural work fit within constraint?

### Risk Mitigation

**Risk 1: Architecture Paralysis**
- **Mitigation**: Time-boxing (max 1 day per feature for architecture decisions)
- **Guardrail**: Ship one feature per week, "good enough" > perfect
- **Kill Switch**: If architecture blocks shipping for 2 consecutive weeks, simplify

**Risk 2: Abandonment (Burnout)**
- **Mitigation**: Max 5h/week, weekends OFF unless motivated, no guilt on skip weeks
- **Philosophy**: Project is fun > project is complete
- **Success Redefinition**: Even incomplete project with good documentation = success

**Risk 3: Clean Architecture Proves Impractical**
- **Mitigation**: This is a VALID outcome if well-documented
- **Fallback**: Honest retrospective on why it didn't work in React context
- **Value**: Documentation of failure helps community avoid same path

**Risk 4: API Dependencies Break Development**
- **Mitigation**: Phase 0 API Research Sprint (2-3 days before coding)
- **Contingency**: Features marked conditional based on API availability
- **Fallback**: Manual entry always works (IGDB API can fail, app still useful)

## Web App Specific Requirements

### Project-Type Overview

**Lab Clean Architecture React** is a Client-Side Rendered (CSR) React Single Page Application (SPA) with Progressive Web App (PWA) capabilities, serving as both an educational experiment in Clean Architecture and a functional game collection manager for personal use.

**Technical Foundation:**
- **Framework**: React with Rsbuild as build tooling
- **Routing**: React Router with Browser History mode (no hash-based routing)
- **Rendering Strategy**: Client-Side Rendering exclusively (no SSR/SSG)
- **Progressive Enhancement**: PWA capabilities for offline functionality and installability

### Browser Support Matrix

**Target Browser Support:**
- **Philosophy**: Modern browsers only - no legacy browser support
- **Desktop Browsers**:
  - Chrome/Edge (latest versions, Chromium-based)
  - Firefox (latest versions)
  - Safari (latest versions)
- **Mobile Browsers**:
  - Safari iOS (latest versions)
  - Chrome Android (latest versions)
- **Version Support Window**: Last 2 years of browser versions
- **Rationale**: Personal use project allows focusing on modern web APIs without legacy constraints

**Browser Feature Requirements:**
- ES2020+ JavaScript support
- CSS Grid and Flexbox
- IndexedDB API (core storage mechanism)
- Service Worker API (for PWA offline capabilities)
- Fetch API and modern async/await patterns

**No Support For:**
- Internet Explorer (any version)
- Legacy Edge (pre-Chromium)
- Browsers older than 2 years

### Responsive Design Strategy

**Mobile-First Philosophy:**
- **Primary Target**: Mobile devices (smartphone usage for game collection on-the-go)
- **Progressive Enhancement**: Desktop experience builds on mobile foundation
- **Breakpoints**: Standard mobile-first breakpoints (mobile → tablet → desktop)

**Responsive Considerations:**
- Touch-friendly UI elements (44x44px minimum tap targets)
- Responsive images and lazy loading for game cover art
- Adaptive layouts for collection browsing (grid → list views)
- Bottom navigation patterns for mobile reachability

**PWA Mobile Experience:**
- Installable on home screen
- Full-screen app experience (no browser chrome)
- Native-like interactions and gestures

### Performance Targets

**Bundle Size Philosophy:**
- **Principle**: "Reasonable bundle size" - no frustration for users
- **Strategy**: Code-splitting and lazy loading for longer/heavier sections
- **Target**: Initial bundle < 200KB (gzipped), async chunks as needed

**Loading Performance:**
- **First Contentful Paint (FCP)**: < 1.5s on 3G connection
- **Time to Interactive (TTI)**: < 3s on 3G connection
- **Largest Contentful Paint (LCP)**: < 2.5s (Core Web Vital target)

**Runtime Performance:**
- **Route Transitions**: < 200ms with lazy loading indicators
- **List Scrolling**: 60fps with virtualization if needed (large collections)
- **Image Loading**: Progressive lazy loading with placeholders

**PWA Offline Performance:**
- **Cache Strategy**: Cache-First for static assets, Network-First for dynamic data
- **Offline Fallback**: Graceful degradation when external APIs unavailable
- **IndexedDB Queries**: Optimized for fast local reads (< 100ms for collection queries)

**Performance Monitoring:**
- Lighthouse CI integration for regression detection
- Core Web Vitals tracking in development
- Bundle size monitoring with Rsbuild build analysis

### SEO Strategy

**SEO Requirement: NONE**

**Rationale:**
- Personal use application (no public discoverability needed)
- Client-Side Rendering with no server-side rendering
- No marketing or user acquisition goals
- Collection data is private and local (IndexedDB)

**Meta Tags:**
- Basic meta tags for PWA manifest and browser compatibility
- No Open Graph or Twitter Card optimization
- No structured data (schema.org) implementation

**Future Consideration:**
- IF backend is added and data becomes shareable
- IF public collection sharing feature is implemented
- THEN re-evaluate SSR/SSG for SEO (likely overkill for personal tool)

### Accessibility Level

**Target Compliance: WCAG 2.1 Level AA (Minimum)**

**Philosophy:**
- **Commitment**: "Maximum accessibility in all apps - it becomes an automatism"
- **Goal**: Exceed AA baseline wherever practical
- **Approach**: Accessibility-first development, not retrofitted

**WCAG AA Requirements (Mandatory):**
- **Perceivable**:
  - Text contrast ratio ≥ 4.5:1 (normal text), ≥ 3:1 (large text)
  - Alternative text for all game cover images
  - Captions/transcripts if video content added
  - Color not sole differentiator for information

- **Operable**:
  - Full keyboard navigation (no mouse-only interactions)
  - Focus indicators visible and clear
  - No keyboard traps
  - Touch targets ≥ 44x44px (mobile)

- **Understandable**:
  - Consistent navigation patterns
  - Clear error messages and validation feedback
  - Predictable UI behavior
  - Form labels and instructions

- **Robust**:
  - Semantic HTML5 elements
  - ARIA attributes where needed (not overused)
  - Valid HTML structure
  - Screen reader testing (VoiceOver on iOS/Mac, NVDA on Windows)

**Beyond AA (Aspirational AAA Elements):**
- Enhanced contrast (≥ 7:1 where feasible)
- Sign language interpretation for tutorial content (if video guides created)
- Reduced motion preference respected (`prefers-reduced-motion`)
- Dark mode with proper contrast maintenance

**Accessibility Testing Strategy:**
- **Automated**: axe-core integration in development
- **Manual**: Keyboard-only navigation testing per feature
- **Screen Reader**: VoiceOver/NVDA testing for critical flows
- **Real-World**: Personal use provides ongoing accessibility validation

**Accessibility as Architectural Principle:**
- Semantic HTML enforced in component design
- Accessible form patterns from React Hook Form
- Focus management in SPA routing transitions
- ARIA live regions for dynamic content updates

### Technical Architecture Considerations

**State Management:**
- **Local State**: React hooks (useState, useReducer) for UI state
- **Server State**: TanStack Query Core with InversifyJS DI (NOT React Query hooks)
- **Persistent State**: IndexedDB via `idb` library wrapper

**Data Fetching Strategy:**
- **Development**: Mock Service Worker (MSW) for API mocking
- **Production**: Fetch API or Query Core for external APIs
- **Offline**: IndexedDB as source of truth, sync when online (if backend added)

**PWA Architecture:**
- **Service Worker**: Rsbuild PWA Plugin for automated SW generation
- **Caching Strategy**:
  - **App Shell**: Cache-First (HTML, CSS, JS bundles)
  - **Game Cover Images**: Cache-First with size limits
  - **API Data**: Network-First with fallback to IndexedDB
- **Update Strategy**: Prompt user for app updates (no silent reload)

**Real-Time Capabilities (Future - Post-MVP):**
- **Technology**: Server-Sent Events (SSE) preferred over WebSocket
- **Use Cases**: Backend data sync, collaborative features (if multi-user added)
- **Rationale**: SSE is simpler, modern, and sufficient for one-way server→client updates

**Bundle Optimization:**
- **Code Splitting**: Route-based lazy loading (React.lazy + Suspense)
- **Tree Shaking**: ES modules and Rsbuild's optimized builds
- **Image Optimization**: WebP format with fallbacks, lazy loading with Intersection Observer
- **Dependency Auditing**: Regular review of package sizes

### Implementation Considerations

**Development Workflow:**
- **Dev Server**: Rsbuild with HMR (Hot Module Replacement)
- **API Testing**: WebStorm HTTP Client for external API validation
- **Mocking**: MSW for development without backend dependencies

**PWA + MSW Conflict Investigation (Required):**
- **Blocker**: Both use Service Workers - potential conflict
- **Investigation**: 30-minute spike to test coexistence
- **Options**: MSW dev-only + PWA prod-only, or MSW without SW fallback
- **Documentation**: Findings captured in DECISIONS.md

**Deployment Strategy:**
- **Static Hosting**: Netlify, Vercel, or GitHub Pages
- **PWA Requirements**: HTTPS mandatory for Service Worker
- **Build Output**: Optimized production bundle with hashed filenames

**Browser Storage Considerations:**
- **IndexedDB Quotas**: Monitor storage usage, handle quota errors
- **Data Migration**: Version schema for IndexedDB structure changes
- **Backup/Export**: JSON export functionality for user data portability

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach: Hybrid Learning + Problem-Solving MVP (50/50)**

**Learning Component (50%):**
- Validate Clean Architecture viability in React ecosystem
- Prove dependency inversion enables technology migration
- Document real architectural decisions (ADRs in real-time)
- Demonstrate sustainable architecture with 5h/week constraint

**Problem-Solving Component (50%):**
- Functional game collection manager for personal use
- Real-world use case prevents "toy example" syndrome
- Genuine utility drives continued engagement and learning

**Resource Requirements:**
- **Team Size**: Solo developer (Paul)
- **Time Commitment**: Maximum 5 hours/week
- **Development Pace**: 1 feature shipped per week
- **Architecture Time-Boxed**: Maximum 1 day per feature for architectural decisions
- **MVP Timeline**: 8-10 weeks (assuming consistent weekly progress)

**Success Definition for MVP:**
- ✅ **Functional**: Can track personal game collection with real data
- ✅ **Architectural**: Clean Architecture boundaries maintained, dependency inversion demonstrated
- ✅ **Shipped**: Weekly releases, "good enough" code over perfection
- ✅ **Documented**: ADRs capture genuine decision process, honest documentation of trade-offs

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
1. **Paul-Collectionneur**: Add games to collection, browse library, manage wishlist
2. **Alex-Developer** (partial): Explore codebase architecture, understand Clean Arch patterns

**Must-Have Capabilities:**

**1. Game Collection Management (Weeks 1-4)**
- **Manual Entry**: Add game with title, platform, purchase date, status
- **External API Integration**: Search and import from IGDB or RAWG (conditional on Phase 0 API validation)
- **Cover Art**: Display and cache game cover images
- **CRUD Operations**: Create, Read, Update, Delete games
- **Storage**: IndexedDB as primary data source
- **Validation**: Clean Architecture with Repository pattern, Use Cases isolated from UI

**2. Search & Filtering (Weeks 5-6)**
- **Text Search**: Search by game title
- **Filter by Platform**: PlayStation, Xbox, Nintendo, PC, etc.
- **Filter by Status**: Physical, Digital, Wishlist
- **Sort Options**: By title, platform, purchase date
- **Performance**: Client-side filtering with IndexedDB queries

**3. Wishlist Management (Weeks 7-8)**
- **Add to Wishlist**: Mark games as "wanted"
- **Priority Levels**: High, Medium, Low priority
- **Wishlist View**: Dedicated view for wishlist items
- **Convert to Owned**: Move wishlist item to collection when purchased

**4. PWA Fundamentals (Weeks 9-10)**
- **Offline Support**: App works without network (IndexedDB-first architecture)
- **Installable**: Can be installed on mobile home screen
- **Service Worker**: Cache static assets (app shell pattern)
- **Responsive Design**: Mobile-first UI with touch-friendly interactions

**MVP Scope Boundaries (What's NOT in MVP):**
- ❌ Maintenance tracking (loans, sales) → Phase 2
- ❌ Price history and tracking → Phase 2
- ❌ Collection statistics and analytics → Phase 2
- ❌ Backend synchronization → Phase 3
- ❌ Multi-user/sharing features → Phase 3
- ❌ Advanced filtering (genre, release date, ratings) → Phase 2

**Phase 0 Prerequisite (Before MVP Development):**
- **API Research Sprint**: 2-3 days validating IGDB, RAWG, and other external APIs
- **Decision Point**: If APIs unavailable, fallback to manual entry only (simplifies MVP)
- **Deliverable**: Go/No-Go decision per API with WebStorm HTTP Client documentation

### Post-MVP Features

**Phase 2: Growth Features (Months 3-6)**

**Enhanced Collection Management:**
- Maintenance System: Track loans (who borrowed, when, return date)
- Sales Tracking: Record sold games with price and date
- Advanced Filtering: Genre, release year, ESRB rating, metacritic score
- Bulk Operations: Import/export collection as JSON
- Custom Tags: User-defined tags for organization

**Collection Insights:**
- Basic Statistics: Total games, by platform, by status
- Collection Value: Estimated total value (if price data available)
- Acquisition Timeline: Visualize collection growth over time

**API Enhancements (if Phase 0 successful):**
- Multiple API Sources: IGDB + RAWG fallback
- Price History Tracking: Monitor game prices from tracking services
- Auto-sync: Periodic checks for updated game metadata

**Phase 3: Expansion & Platform Evolution (Months 6-12)**

**Backend Migration (Pedagogical Demonstration):**
- **Objective**: Prove Clean Architecture dependency inversion works
- **Story Arc**: "Started with IndexedDB, migrated to backend 6 months later, changed only Repository implementation"
- **Backend Options**: Firebase or NestJS custom backend
- **Migration Strategy**: Dual-write during transition, then cutover
- **Documentation**: Detailed case study for Devoxx presentation

**Advanced Features:**
- Real-Time Sync: Server-Sent Events (SSE) for multi-device sync
- Cloud Backup: Automatic collection backup to backend
- Sharing Features: Share collection or wishlist via public link
- Recommendations: "Games you might like" based on collection

**Platform Expansion:**
- Additional Game Platforms: Retro consoles, mobile games
- Integration Ecosystem: Steam API, PlayStation Network API (if available)
- Community Features: Compare collections with friends (if multi-user backend added)

### Risk Mitigation Strategy

**Technical Risks:**

**Risk: External API Dependency Failure**
- **Likelihood**: Medium (APIs may be rate-limited, require authentication, or be unreliable)
- **Impact**: High (reduces MVP functionality significantly)
- **Mitigation**:
  - Phase 0 API Research Sprint validates APIs before committing to features
  - Fallback to manual entry maintains core functionality
  - API integration designed as optional enhancement (dependency inversion)
- **Contingency**: If APIs fail, MVP still delivers collection management with manual entry

**Risk: Clean Architecture Over-Engineering**
- **Likelihood**: Medium-High (perfectionism tendency + architectural focus)
- **Impact**: High (blocks shipping, causes burnout)
- **Mitigation**:
  - Architecture time-boxed to max 1 day per feature
  - "Good enough" code philosophy over architectural purity
  - Weekly shipping discipline forces pragmatic decisions
- **Kill Switch**: If architecture blocks shipping for 2 consecutive weeks, simplify to standard React patterns, document why Clean Arch didn't work (still valuable outcome)

**Risk: PWA + MSW Service Worker Conflict**
- **Likelihood**: Medium (both use Service Workers)
- **Impact**: Medium (affects development workflow or PWA functionality)
- **Mitigation**:
  - 30-minute spike to test coexistence before committing
  - Document findings in DECISIONS.md
  - Options: MSW dev-only, PWA prod-only, or MSW without SW
- **Contingency**: If conflict unresolvable, use MSW without Service Worker or skip MSW entirely

**Market Risks:**

**Risk: Educational Value Not Achieved**
- **Likelihood**: Low-Medium (depends on documentation quality)
- **Impact**: Medium (affects community success criteria)
- **Mitigation**:
  - Real-time ADR documentation captures genuine decision process
  - Honest documentation of failures as valuable as successes
  - Target "at least one dev finds it useful" is modest bar
- **Validation**: Community feedback, Devoxx/DevFest acceptance

**Resource Risks:**

**Risk: Scope Creep Beyond Sustainable Pace**
- **Likelihood**: High (ambitious feature set + perfectionism)
- **Impact**: High (burnout, project abandonment)
- **Mitigation**:
  - Strict 5h/week maximum commitment
  - Weekends OFF unless genuinely motivated
  - No guilt on skip weeks
  - 1 feature/week shipping discipline
- **Philosophy**: "Project is fun > project is complete"
- **Success Redefinition**: Even incomplete project with good documentation = success

**Risk: Motivation Loss / Burnout**
- **Likelihood**: Medium (long-term personal project)
- **Impact**: Critical (project abandonment)
- **Mitigation**:
  - Sustainable pace (5h/week max)
  - Tangible weekly progress (shipped features)
  - Dual success model (technical success OR educational success)
  - Community engagement (Devoxx presentation goal)
- **Early Warning Signs**: Missing 2+ consecutive weeks, dreading development sessions
- **Circuit Breaker**: If burnout detected, pause project, reassess scope, or pivot to documentation-only

**Risk: Technology Stack Evolution**
- **Likelihood**: Low (React ecosystem is stable)
- **Impact**: Medium (may need to update dependencies)
- **Mitigation**:
  - Use stable, mature libraries (React Router, React Hook Form)
  - Dependency inversion isolates framework dependencies
  - Regular dependency audits (quarterly)
- **Benefit**: Technology migration (IndexedDB → Backend) is part of the educational goal

## Functional Requirements

### Game Collection Management

- **FR1**: User can manually add a game to their collection with title, platform, purchase date, and ownership status
- **FR2**: User can search for games via external API (IGDB or RAWG) and import game details
- **FR3**: User can view game cover art for each game in their collection
- **FR4**: User can edit game details in their collection
- **FR5**: User can delete games from their collection
- **FR6**: User can mark a game's ownership status (Physical, Digital, or Wishlist)
- **FR7**: User can view their complete game collection as a browsable list

### Search & Discovery

- **FR8**: User can search their collection by game title (text search)
- **FR9**: User can filter their collection by platform (PlayStation, Xbox, Nintendo, PC, etc.)
- **FR10**: User can filter their collection by ownership status (Physical, Digital, Wishlist)
- **FR11**: User can sort their collection by title, platform, or purchase date
- **FR12**: System can perform client-side search and filtering using IndexedDB queries

### Wishlist Management

- **FR13**: User can add a game to their wishlist
- **FR14**: User can assign priority level to wishlist items (High, Medium, Low)
- **FR15**: User can view dedicated wishlist view showing only wanted games
- **FR16**: User can convert wishlist item to owned when purchased
- **FR17**: User can remove items from wishlist

### Data Persistence & Offline Support

- **FR18**: System can store all collection data locally in IndexedDB
- **FR19**: User can access and manage their collection while offline
- **FR20**: System can cache game cover art for offline viewing
- **FR21**: User can export their collection data as JSON file
- **FR22**: User can import collection data from JSON file (for backup/restore)

### Progressive Web App Experience

- **FR23**: User can install the application on their mobile device home screen
- **FR24**: User can access the application in full-screen mode (no browser chrome)
- **FR25**: System can cache static assets (app shell) for instant loading
- **FR26**: User can receive notifications when app updates are available
- **FR27**: User can interact with touch-friendly UI elements on mobile devices

### Accessibility & User Experience

- **FR28**: User can navigate the entire application using keyboard only
- **FR29**: Screen reader users can access all functionality with proper ARIA labels
- **FR30**: User can view content with WCAG AA compliant color contrast
- **FR31**: User can trigger reduced motion mode for animations (respects `prefers-reduced-motion`)
- **FR32**: User can access the application on modern mobile and desktop browsers (last 2 years)

### Educational & Documentation (Lab-Specific)

- **FR33**: Developer can explore codebase to understand Clean Architecture implementation in React
- **FR34**: Developer can review Architecture Decision Records (ADRs) documenting key technical choices
- **FR35**: Developer can examine Repository pattern implementation with IndexedDB
- **FR36**: Developer can study dependency inversion examples (Query Core + InversifyJS)
- **FR37**: Developer can access honest documentation of trade-offs and architectural decisions

## Non-Functional Requirements

### Performance

- **NFR1**: Initial page load completes First Contentful Paint (FCP) within 1.5 seconds on 3G connection
- **NFR2**: Time to Interactive (TTI) occurs within 3 seconds on 3G connection
- **NFR3**: Largest Contentful Paint (LCP) occurs within 2.5 seconds (Core Web Vital target)
- **NFR4**: Route transitions between views complete within 200ms with visual loading indicator
- **NFR5**: Collection list scrolling maintains 60fps frame rate
- **NFR6**: Initial bundle size remains under 200KB (gzipped), with additional features loaded asynchronously
- **NFR7**: IndexedDB read queries for collection browsing complete within 100ms
- **NFR8**: Game cover image loading uses progressive lazy loading with placeholder to prevent layout shift

### Security & Privacy

- **NFR9**: Application served exclusively over HTTPS (required for Service Worker and PWA)
- **NFR10**: Collection data stored in browser IndexedDB is isolated per origin (browser security model)
- **NFR11**: External API calls (IGDB, RAWG) do not expose user collection data
- **NFR12**: JSON export function warns user about data privacy before downloading sensitive information
- **NFR13**: No analytics or tracking scripts collect user behavior data (privacy-first approach)

### Reliability & Offline Resilience

- **NFR14**: Application functions fully offline after initial load (IndexedDB-first architecture)
- **NFR15**: Service Worker caches app shell with 99% cache hit rate for static assets
- **NFR16**: Application gracefully handles network failures when external APIs unavailable
- **NFR17**: IndexedDB quota errors are caught and presented to user with data export option
- **NFR18**: Application state remains consistent after browser crash or unexpected closure

### Accessibility

- **NFR19**: Application meets WCAG 2.1 Level AA compliance (minimum target)
- **NFR20**: All interactive elements are keyboard accessible with visible focus indicators
- **NFR21**: Screen readers can navigate and use all functionality via ARIA labels and semantic HTML
- **NFR22**: Color contrast ratios meet or exceed 4.5:1 for normal text, 3:1 for large text
- **NFR23**: Touch targets on mobile meet minimum 44x44px size for accessibility
- **NFR24**: Application respects `prefers-reduced-motion` user preference for animations
- **NFR25**: Dark mode (if implemented) maintains WCAG AA contrast ratios

### Maintainability & Developer Experience (Lab-Specific)

- **NFR26**: Clean Architecture boundaries are enforced via dependency inversion (no business logic in UI layer)
- **NFR27**: Repository pattern abstracts storage implementation to enable future IndexedDB → Backend migration
- **NFR28**: Use Cases remain isolated from React framework dependencies (no hooks in business logic)
- **NFR29**: Architecture Decision Records (ADRs) document all major technical decisions with context and trade-offs
- **NFR30**: Codebase documentation includes honest retrospective of what worked and what didn't
- **NFR31**: Code structure demonstrates Clean Architecture layers (Domain, Use Cases, Infrastructure, Presentation)
- **NFR32**: Time-boxed architecture decisions (max 1 day per feature) prevent over-engineering paralysis

### Browser Compatibility

- **NFR33**: Application functions on modern browsers released within last 2 years
- **NFR34**: Application supports Chrome/Edge (Chromium), Firefox, and Safari latest versions
- **NFR35**: Application functions on mobile browsers (Safari iOS, Chrome Android)
- **NFR36**: Application gracefully degrades features when browser APIs unavailable
- **NFR37**: No support required for Internet Explorer or legacy Edge (pre-Chromium)

### Development Workflow (Lab Constraints)

- **NFR38**: Features are developed and shipped within 5 hours per week time constraint
- **NFR39**: Weekly shipping discipline delivers one complete feature per week
- **NFR40**: "Good enough" code quality threshold prevents perfectionism paralysis
- **NFR41**: Architecture work is time-boxed to maximum 1 day per feature implementation
- **NFR42**: Development remains sustainable without weekend work (unless genuinely motivated)
