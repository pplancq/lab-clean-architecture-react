---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories']
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/architecture.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
epicCount: 6
epicApproved: true
storiesComplete: true
totalStories: 39
---

# lab-clean-architecture-react - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for lab-clean-architecture-react, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

**FR1:** User can manually add a game to their collection with title, platform, purchase date, and ownership status

**FR2:** User can search for games via external API (IGDB or RAWG) and import game details

**FR3:** User can view game cover art for each game in their collection

**FR4:** User can edit game details in their collection

**FR5:** User can delete games from their collection

**FR6:** User can mark a game's ownership status (Physical, Digital, or Wishlist)

**FR7:** User can view their complete game collection as a browsable list

**FR8:** User can search their collection by game title (text search)

**FR9:** User can filter their collection by platform (PlayStation, Xbox, Nintendo, PC, etc.)

**FR10:** User can filter their collection by ownership status (Physical, Digital, Wishlist)

**FR11:** User can sort their collection by title, platform, or purchase date

**FR12:** System can perform client-side search and filtering using IndexedDB queries

**FR13:** User can add a game to their wishlist

**FR14:** User can assign priority level to wishlist items (High, Medium, Low)

**FR15:** User can view dedicated wishlist view showing only wanted games

**FR16:** User can convert wishlist item to owned when purchased

**FR17:** User can remove items from wishlist

**FR18:** System can store all collection data locally in IndexedDB

**FR19:** User can access and manage their collection while offline

**FR20:** System can cache game cover art for offline viewing

**FR21:** User can export their collection data as JSON file

**FR22:** User can import collection data from JSON file (for backup/restore)

**FR23:** User can install the application on their mobile device home screen

**FR24:** User can access the application in full-screen mode (no browser chrome)

**FR25:** System can cache static assets (app shell) for instant loading

**FR26:** User can receive notifications when app updates are available

**FR27:** User can interact with touch-friendly UI elements on mobile devices

**FR28:** User can navigate the entire application using keyboard only

**FR29:** Screen reader users can access all functionality with proper ARIA labels

**FR30:** User can view content with WCAG AA compliant color contrast

**FR31:** User can trigger reduced motion mode for animations (respects `prefers-reduced-motion`)

**FR32:** User can access the application on modern mobile and desktop browsers (last 2 years)

**FR33:** Developer can explore codebase to understand Clean Architecture implementation in React

**FR34:** Developer can review Architecture Decision Records (ADRs) documenting key technical choices

**FR35:** Developer can examine Repository pattern implementation with IndexedDB

**FR36:** Developer can study dependency inversion examples (Query Core + InversifyJS)

**FR37:** Developer can access honest documentation of trade-offs and architectural decisions

### Non-Functional Requirements

**NFR1:** Initial page load completes First Contentful Paint (FCP) within 1.5 seconds on 3G connection

**NFR2:** Time to Interactive (TTI) occurs within 3 seconds on 3G connection

**NFR3:** Largest Contentful Paint (LCP) occurs within 2.5 seconds (Core Web Vital target)

**NFR4:** Route transitions between views complete within 200ms with visual loading indicator

**NFR5:** Collection list scrolling maintains 60fps frame rate

**NFR6:** Initial bundle size remains under 200KB (gzipped), with additional features loaded asynchronously

**NFR7:** IndexedDB read queries for collection browsing complete within 100ms

**NFR8:** Game cover image loading uses progressive lazy loading with placeholder to prevent layout shift

**NFR9:** Application served exclusively over HTTPS (required for Service Worker and PWA)

**NFR10:** Collection data stored in browser IndexedDB is isolated per origin (browser security model)

**NFR11:** External API calls (IGDB, RAWG) do not expose user collection data

**NFR12:** JSON export function warns user about data privacy before downloading sensitive information

**NFR13:** No analytics or tracking scripts collect user behavior data (privacy-first approach)

**NFR14:** Application functions fully offline after initial load (IndexedDB-first architecture)

**NFR15:** Service Worker caches app shell with 99% cache hit rate for static assets

**NFR16:** Application gracefully handles network failures when external APIs unavailable

**NFR17:** IndexedDB quota errors are caught and presented to user with data export option

**NFR18:** Application state remains consistent after browser crash or unexpected closure

**NFR19:** Application meets WCAG 2.1 Level AA compliance (minimum target)

**NFR20:** All interactive elements are keyboard accessible with visible focus indicators

**NFR21:** Screen readers can navigate and use all functionality via ARIA labels and semantic HTML

**NFR22:** Color contrast ratios meet or exceed 4.5:1 for normal text, 3:1 for large text

**NFR23:** Touch targets on mobile meet minimum 44x44px size for accessibility

**NFR24:** Application respects `prefers-reduced-motion` user preference for animations

**NFR25:** Dark mode (if implemented) maintains WCAG AA contrast ratios

**NFR26:** Clean Architecture boundaries are enforced via dependency inversion (no business logic in UI layer)

**NFR27:** Repository pattern abstracts storage implementation to enable future IndexedDB → Backend migration

**NFR28:** Use Cases remain isolated from React framework dependencies (no hooks in business logic)

**NFR29:** Architecture Decision Records (ADRs) document all major technical decisions with context and trade-offs

**NFR30:** Codebase documentation includes honest retrospective of what worked and what didn't

**NFR31:** Code structure demonstrates Clean Architecture layers (Domain, Use Cases, Infrastructure, Presentation)

**NFR32:** Time-boxed architecture decisions (max 1 day per feature) prevent over-engineering paralysis

**NFR33:** Application functions on modern browsers released within last 2 years

**NFR34:** Application supports Chrome/Edge (Chromium), Firefox, and Safari latest versions

**NFR35:** Application functions on mobile browsers (Safari iOS, Chrome Android)

**NFR36:** Application gracefully degrades features when browser APIs unavailable

**NFR37:** No support required for Internet Explorer or legacy Edge (pre-Chromium)

**NFR38:** Features are developed and shipped within 5 hours per week time constraint

**NFR39:** Weekly shipping discipline delivers one complete feature per week

**NFR40:** "Good enough" code quality threshold prevents perfectionism paralysis

**NFR41:** Architecture work is time-boxed to maximum 1 day per feature implementation

**NFR42:** Development remains sustainable without weekend work (unless genuinely motivated)

### Additional Requirements

**Architecture Requirements:**

- **Starter Template:** Use @pplancq/react-app template with Rsbuild pre-configured
- **Hybrid Architecture:** Combine Clean Architecture layering with DDD Bounded Contexts (vertical slices)
- **Bounded Context Structure:** Each context (collection/, wishlist/, maintenance/) is self-contained with domain, application, infrastructure, and UI layers
- **Single IndexedDB Database:** One database with separate object stores per bounded context for simpler migration management
- **Manual Migration Strategy:** Explicit upgrade functions for IndexedDB schema changes with documentation
- **Result/Either Pattern:** Type-safe error handling throughout the application (no throwing exceptions in domain)
- **Event Bus Pattern:** Cross-context communication via event bus to maintain bounded context isolation
- **DI Containers per Context:** InversifyJS composition strategy with separate containers per bounded context
- **No Decorators in Domain:** Pure domain entities without TypeScript decorators, manual DI registration
- **Hybrid Validation:** React Hook Form for UI validation + Domain Value Objects for business rules
- **Cache Strategy Evolution:** Permanent cache with ICacheStrategy interface ready for TTL implementation post-MVP
- **PWA App Shell Pattern:** Configurable size limits (50MB for covers), cache-first for app shell, network-first for API data
- **Tests by Type:** Separate organization for unit/integration/e2e/visual tests

**UX Requirements:**

- **Mobile-First Design:** Primary target is mobile devices with progressive enhancement for desktop
- **Responsive Navigation:** Hamburger menu (☰) on mobile, top navigation bar on desktop
- **Widget-Based Dashboard:** MVP uses fixed widget order, post-MVP adds drag-and-drop customization
- **Widget Grid System:** 2-column layout on mobile, 4-6 column on desktop with adaptive sizing
- **Bottom Navigation:** Mobile pattern for thumb reachability with main sections accessible
- **Thumb-Friendly UI:** All interactions optimized for single-hand mobile use with 44x44px minimum tap targets
- **Visual Browsing:** Cover art-driven collection browsing similar to Netflix/Spotify patterns
- **Smart Defaults:** Pre-filled fields and intelligent suggestions to minimize manual entry friction
- **Micro-Animations:** Subtle feedback animations for actions (not flashy, satisfying)
- **Dark Mode Support:** Automatic system preference detection with manual toggle option
- **Serenity + Confidence:** Design emotional goals - calm interface reducing cognitive load, reliable offline capability
- **Progressive Disclosure:** Information revealed based on user interest, not overwhelming first-time users
- **Contextual Notifications:** Smart, relevant, actionable notifications (not spammy) for maintenance and price alerts

### FR Coverage Map

**Epic 1 (Foundation & PWA):** FR23, FR24, FR25, FR26, FR33, FR34, FR35, FR36, FR37

**Epic 2 (Collection + IndexedDB):** FR1, FR4, FR5, FR6, FR7, FR18, FR19, FR20

**Epic 3 (Search & Filter):** FR8, FR9, FR10, FR11, FR12

**Epic 4 (API Enrichment):** FR2, FR3

**Epic 5 (Wishlist):** FR13, FR14, FR15, FR16, FR17

**Epic 6 (Backup):** FR21, FR22

**Transversal (Accessibility - Integrated in all epics):** FR28, FR29, FR30, FR31, FR32

**Coverage Summary:** 37/37 FRs covered ✅

---

### Transversal Requirements (Integrated in ALL Epics)

**Accessibility & Inclusive Design:**
- All features must include keyboard navigation support (FR28)
- All features must include screen reader support with proper ARIA labels (FR29)
- All features must meet WCAG AA color contrast requirements (FR30)
- All features must respect `prefers-reduced-motion` preference (FR31)
- All features must work on modern browsers (last 2 years) (FR32)
- NFRs: NFR19-NFR25 (WCAG AA compliance, keyboard accessibility, touch targets)
- NFRs: NFR33-NFR37 (Browser compatibility, graceful degradation)

**Browser Support & Compatibility:**
- Modern browsers only (Chrome/Edge, Firefox, Safari - last 2 years)
- Progressive enhancement and graceful degradation
- Mobile-first responsive design

**Development Workflow (All Epics):**
- 5h/week maximum time commitment (NFR38)
- Weekly shipping discipline - one feature per week (NFR39)
- "Good enough" code quality over perfectionism (NFR40)
- Architecture decisions time-boxed to max 1 day (NFR41)
- Sustainable pace without mandatory weekend work (NFR42)

---

## Epic List

### Epic 1: Foundation, Clean Architecture & PWA Setup
**User Outcome:** Developers have a functional project with documented Clean Architecture, established bounded contexts structure, and PWA foundations configured (Service Worker, manifest, offline-ready). The app is installable from day one.

**FRs covered:** FR23, FR24, FR25, FR26, FR33, FR34, FR35, FR36, FR37

**NFRs covered:** NFR1-NFR6, NFR9, NFR15, NFR26-NFR32

**Architecture Requirements:**
- Starter template @pplancq/react-app with Rsbuild pre-configured
- Hybrid Architecture (Clean Architecture + DDD Bounded Contexts)
- Context structure (app/, shared/, collection/, wishlist/)
- Result/Either pattern for error handling
- Event Bus for cross-context communication
- InversifyJS DI containers per context
- PWA App Shell pattern with Service Worker
- Architecture Decision Records (ADRs) from the start

**Rationale:** Complete foundation including PWA from the beginning because it forces proper Repository separation early. Standalone - functional project even when empty with clear architecture and installable app.

**GitHub Epic:** [#7](https://github.com/pplancq/lab-clean-architecture-react/issues/7)

**Stories (7 total):**
- Story 1.1: Initialize Project (#1) - Size: XS, Priority: P0
- Story 1.2: Folder Structure (#2) - Size: XS, Priority: P0
- Story 1.3: DI Container (#3) - Size: S, Priority: P0
- Story 1.4: Result Pattern (#4) - Size: S, Priority: P0
- Story 1.5: PWA Setup (#5) - Size: S, Priority: P0
- Story 1.6: Documentation (#6) - Size: S, Priority: P0
- Story 1.7: CI Pipeline + SonarCloud + GitHub Copilot (#52) - Size: S, Priority: P0

---

### Epic 2: Core Game Collection Management with IndexedDB Persistence
**User Outcome:** Paul can add, view, edit, and delete games in his collection. Data is saved locally in IndexedDB and available offline immediately. End-to-end functional collection management.

**FRs covered:** FR1, FR4, FR5, FR6, FR7, FR18, FR19, FR20

**NFRs covered:** NFR7, NFR10, NFR14, NFR17, NFR18, NFR38-NFR42

**Architecture Requirements:**
- IndexedDB single database with 'games' object store
- Repository pattern (IGameRepository → IndexedDBGameRepository)
- Use Cases (AddGame, EditGame, DeleteGame, GetGames)
- Domain entities (Game, GameId, Platform value object, Status value object)
- Manual migration strategy for schema changes

**UX Requirements:**
- Mobile-first design
- Thumb-friendly UI with 44x44px minimum touch targets
- Smart defaults and minimal required fields
- Micro-animations for action feedback

**Accessibility Requirements (Transversal):**
- Keyboard navigation for all CRUD operations
- ARIA labels for form fields and buttons
- WCAG AA contrast ratios
- Screen reader support with announcements

**Rationale:** Standalone and complete epic - CRUD + persistence together because they're inseparable. Paul can manage his collection offline immediately. Foundation for all other epics.

**GitHub Epic:** [#8](https://github.com/pplancq/lab-clean-architecture-react/issues/8)

**Stories (8 total):**
- Story 2.1: Game Domain Entity (#9) - Size: S, Priority: P0
- Story 2.2: Collection Repository (#10) - Size: M, Priority: P0
- Story 2.3: IndexedDB Adapter (#11) - Size: M, Priority: P0
- Story 2.4: Add Game Use Case (#12) - Size: S, Priority: P0
- Story 2.5: Edit/Delete Use Cases (#13) - Size: S, Priority: P0
- Story 2.6: GameList Component (#14) - Size: S, Priority: P0
- Story 2.7: GameForm Component (#15) - Size: S, Priority: P0
- Story 2.8: Integration Tests (#16) - Size: S, Priority: P0

---

### Epic 3: Search, Filter & Sort Collection
**User Outcome:** Paul can quickly find a specific game in a store (<10 seconds) via text search, filter by platform/status, and sort his collection for better organization.

**FRs covered:** FR8, FR9, FR10, FR11, FR12

**NFRs covered:** NFR7 (queries <100ms)

**UX Requirements:**
- Instant search with <500ms response time
- Responsive filter controls
- Clear visual feedback for active filters

**Accessibility Requirements (Transversal):**
- Keyboard accessible filters and search
- Screen reader announcements for results count
- Focus management in search results
- Clear filter reset controls

**Rationale:** Standalone epic for the critical "store moment". Uses Epic 2 (collection exists) but provides distinct value - rapid discovery.

**GitHub Epic:** [#17](https://github.com/pplancq/lab-clean-architecture-react/issues/17)

**Stories (6 total):**
- Story 3.1: Search Use Case (#18) - Size: S, Priority: P1
- Story 3.2: Filter Use Case (#19) - Size: S, Priority: P1
- Story 3.3: Sort Use Case (#20) - Size: S, Priority: P1
- Story 3.4: SearchBar Component (#21) - Size: S, Priority: P1
- Story 3.5: FilterControls Component (#22) - Size: M, Priority: P1
- Story 3.6: Performance Tests (#23) - Size: L, Priority: P1

---

### Epic 4: Game Metadata Enrichment via External APIs
**User Outcome:** Paul can search for a game via IGDB/RAWG and automatically import details (title, cover art, description, platform) instead of manually entering everything, reducing game addition to <2 minutes.

**FRs covered:** FR2, FR3

**NFRs covered:** NFR8 (lazy loading), NFR11 (API privacy), NFR16 (graceful failures)

**Architecture Requirements:**
- Cache strategy with ICacheStrategy interface
- API adapters (IGDBAdapter, RAWGAdapter)
- Repository pattern for metadata caching

**GitHub Epic:** [#24](https://github.com/pplancq/lab-clean-architecture-react/issues/24)

**Stories (6 total):**
- Story 4.1: IGDB Adapter (#25) - Size: M, Priority: P1
- Story 4.2: RAWG Adapter (#26) - Size: M, Priority: P1
- Story 4.3: Search Metadata Use Case (#27) - Size: M, Priority: P1
- Story 4.4: Metadata Import Use Case (#28) - Size: M, Priority: P1
- Story 4.5: API Search Component (#29) - Size: S, Priority: P1
- Story 4.6: Cover Image Cache (#30) - Size: L, Priority: P1
- Graceful degradation when API unavailable

**UX Requirements:**
- Auto-completion in search
- Visual cover art browsing
- Progressive image loading with placeholders

**Accessibility Requirements (Transversal):**
- Alt text for all cover images
- Keyboard navigation in search results
- Loading state announcements for screen readers
- High contrast mode support for images

**Rationale:** Conditional standalone epic (Phase 0 API validation required). Enhances Epic 2 UX but manual entry remains functional. Proves Repository pattern with swappable API adapters.

---

### Epic 5: Wishlist Management & Prioritization
**User Outcome:** Paul can track games he wants to buy with priorities (High/Medium/Low), manage his wishlist separately from collection, and easily convert a wishlist item to owned game when purchased.

**FRs covered:** FR13, FR14, FR15, FR16, FR17

**Architecture Requirements:**
- Separate bounded context "wishlist/"
- Entities (WishlistItem, Priority value object)
- Cross-context communication via Event Bus (MoveToCollection use case)
- IndexedDB object store 'wishlist'

**UX Requirements:**
- Widget dashboard "Wishlist Top 3"
- Visual priority indicators
- One-tap conversion to owned

**Accessibility Requirements (Transversal):**
- Keyboard shortcuts for priority changes
- Screen reader priority level announcements
- Clear focus states for interactive elements
- Accessible drag-and-drop (if implemented)

**Rationale:** Standalone epic - new bounded context. Uses architecture from Epic 1 and can reference collection from Epic 2 via Event Bus. Distinct value for Paul - tracking desired games.

---

### Epic 6: Data Portability & Backup
**User Outcome:** Paul can export his entire collection (games + wishlist) as JSON for backup, import data from a backup, and migrate his data between devices/browsers without loss.

**FRs covered:** FR21, FR22

**NFRs covered:** NFR12 (privacy warning on export)

**Architecture Requirements:**
- Export/Import use cases
- JSON serialization/deserialization
- Data validation on import
- Conflict resolution strategy

**UX Requirements:**
- Privacy warning modal before export
- Download progress indicator
- Import conflict resolution UI

**Accessibility Requirements (Transversal):**
- Keyboard accessible export/import buttons
- Screen reader warnings and confirmations
- Clear error messages for invalid imports
- Focus management in modals

**Rationale:** Standalone epic for data portability. Uses data from Epic 2+5 (collection + wishlist) but provides distinct functionality. Security for Paul against data loss.

---

## Epic 1: Foundation, Clean Architecture & PWA Setup

**Epic Goal:** Developers have a functional project with documented Clean Architecture, established bounded contexts structure, and PWA foundations configured (Service Worker, manifest, offline-ready). The app is installable from day one.

### Story 1.1: Initialize Project with React Template and Rsbuild

As a **developer**,
I want to initialize the project using @pplancq/react-app template with Rsbuild pre-configured,
So that I have a working React application with TypeScript, build tooling, and basic development environment ready.

**Acceptance Criteria:**

**Given** the @pplancq/react-app template is available
**When** I run the project initialization command
**Then** a new React project is created with Rsbuild configuration
**And** TypeScript strict mode is enabled
**And** ESLint and Prettier are configured
**And** Git repository is initialized
**And** Base dependencies are installed (React, Rsbuild, TypeScript)
**And** Development server starts successfully with `npm run dev`
**And** Production build completes successfully with `npm run build`

---

### Story 1.2: Setup Clean Architecture Folder Structure and Bounded Contexts

As a **developer**,
I want to establish the Clean Architecture folder structure with DDD Bounded Contexts,
So that the codebase has clear architectural boundaries and separation of concerns from the start.

**Acceptance Criteria:**

**Given** the project is initialized
**When** I create the folder structure
**Then** the following directories exist:
- `src/app/` (Application foundation layer)
- `src/shared/domain/` (Shared domain primitives)
- `src/shared/application/` (Shared application logic)
- `src/shared/infrastructure/` (Shared infrastructure)
- `src/shared/ui/` (Shared UI components)
- `src/collection/` (Collection bounded context - placeholder)
- `src/wishlist/` (Wishlist bounded context - placeholder)
**And** each bounded context has subdirectories: `domain/`, `application/`, `infrastructure/`, `ui/`
**And** README files exist in each directory explaining the layer's purpose
**And** the structure follows Clean Architecture dependency rules (documented)

---

### Story 1.3: Configure Dependency Injection with InversifyJS

As a **developer**,
I want to configure InversifyJS dependency injection containers,
So that I can properly inject dependencies following Clean Architecture principles without coupling layers.

**Acceptance Criteria:**

**Given** the folder structure is established
**When** I configure InversifyJS
**Then** InversifyJS and reflect-metadata packages are installed
**And** a DI container configuration file exists at `src/app/config/di-container.ts`
**And** container setup includes symbols/identifiers for dependency binding
**And** a DIProvider React component exists to provide the container to the app
**And** TypeScript decorators are NOT used in domain layer (manual registration)
**And** documentation explains how to register and resolve dependencies
**And** at least one sample binding is demonstrated (e.g., Logger interface)

---

### Story 1.4: Implement Result/Either Pattern for Error Handling

As a **developer**,
I want to implement the Result/Either pattern for type-safe error handling,
So that errors are handled explicitly without throwing exceptions in the domain layer.

**Acceptance Criteria:**

**Given** the DI container is configured
**When** I implement the Result pattern
**Then** a `Result<T, E>` type exists in `src/shared/domain/types/`
**And** the Result type supports `Ok` and `Err` variants
**And** helper methods exist: `isOk()`, `isErr()`, `unwrap()`, `unwrapOr()`, `map()`, `mapErr()`
**And** documentation includes examples of using Result in Use Cases
**And** at least one sample Use Case demonstrates Result usage
**And** TypeScript type safety is maintained (no `any` types)

---

### Story 1.5: Configure PWA with Service Worker and App Manifest

As a **Paul (user)**,
I want the app to be installable as a PWA from day one,
So that I can use it offline and access it like a native app on my mobile device.

**Acceptance Criteria:**

**Given** Rsbuild is configured
**When** I configure PWA capabilities
**Then** Rsbuild PWA plugin is installed and configured
**And** a web app manifest file exists with:
  - App name: "Game Collection Manager"
  - Icons for various sizes (192x192, 512x512)
  - Theme colors matching the design system
  - Display mode: "standalone"
  - Start URL: "/"
**And** Service Worker is registered and caches app shell assets
**And** the app is installable on mobile devices (install prompt appears)
**And** the app works offline after first visit (app shell cached)
**And** HTTPS is enforced in production (required for Service Worker)
**And** Cache strategy is documented (Cache-First for app shell)

---

### Story 1.6: Create Architecture Documentation and ADRs

As a **developer (Alex from user journey)**,
I want comprehensive architecture documentation including ADRs,
So that I can understand the Clean Architecture implementation and learn from documented decisions.

**Acceptance Criteria:**

**Given** the architecture is established
**When** I create documentation
**Then** a `DECISIONS.md` file exists in the project root with:
  - ADR-001: Starter Template Selection (@pplancq/react-app)
  - ADR-002: Clean Architecture + DDD Bounded Contexts
  - ADR-003: IndexedDB Storage Strategy
  - ADR-004: Result/Either Pattern for Error Handling
  - ADR-005: InversifyJS for Dependency Injection
  - ADR-006: PWA from Day One
**And** a `README.md` exists with:
  - Project overview (80% learning, 20% utility)
  - Architecture diagram showing layers and bounded contexts
  - Folder structure explanation
  - How to run the project
  - Links to DECISIONS.md, LEARNINGS.md (placeholder), REGRETS.md (placeholder)
**And** a `docs/architecture/` folder contains:
  - Architecture diagram (image or mermaid)
  - Clean Architecture layers explanation
  - Bounded contexts explanation
  - Dependency rules documentation
**And** all documentation is written in English (per project requirements)
**And** code examples are included where relevant

---

## Epic 2: Core Game Collection Management with IndexedDB Persistence

**Epic Goal:** Paul can add, view, edit, and delete games in his collection. Data is saved locally in IndexedDB and available offline immediately. End-to-end functional collection management.

### Story 2.1: Create Game Domain Entity and Value Objects

As a **developer**,
I want to create the Game domain entity with its value objects,
So that I have a pure business logic representation of a game without infrastructure dependencies.

**Acceptance Criteria:**

**Given** the bounded context structure exists
**When** I create the Game entity
**Then** a `Game` entity class exists in `src/collection/domain/entities/Game.ts`
**And** the Game entity includes properties: id, title, description, platform, format, purchaseDate, status
**And** value objects exist for:
  - `GameId` (unique identifier)
  - `Platform` (PlayStation, Xbox, Nintendo, PC, etc.)
  - `Format` (Physical, Digital)
  - `Status` (Owned, Wishlist, Sold, Loaned)
**And** the Game entity has validation logic in the domain layer
**And** the Game entity has factory method `Game.create()` for instantiation
**And** the entity is pure TypeScript with NO infrastructure dependencies
**And** the entity follows Clean Architecture principles (no React, no IndexedDB)
**And** unit tests exist for Game entity validation logic

---

### Story 2.2: Implement IndexedDB Repository for Game Persistence

As a **developer**,
I want to implement an IndexedDB repository for game persistence,
So that games can be stored locally and accessed offline following the Repository pattern.

**Acceptance Criteria:**

**Given** the Game entity exists
**When** I implement the repository
**Then** an `IGameRepository` interface exists in `src/collection/domain/repositories/`
**And** the interface defines methods: `save()`, `findById()`, `findAll()`, `delete()`
**And** an `IndexedDBGameRepository` implementation exists in `src/collection/infrastructure/persistence/`
**And** IndexedDB database 'GameCollectionDB' is created with version 1
**And** an object store 'games' is created with keyPath 'id'
**And** indexes are created for: 'title', 'platform', 'status'
**And** the repository maps between Game entities and storage DTOs
**And** the repository handles IndexedDB quota errors gracefully (Result pattern)
**And** the repository is registered in the DI container
**And** integration tests verify CRUD operations work with IndexedDB

---

### Story 2.3: Create AddGame Use Case

As a **developer**,
I want to create an AddGame use case,
So that business logic for adding a game is separated from UI and infrastructure concerns.

**Acceptance Criteria:**

**Given** the Game entity and repository exist
**When** I create the AddGame use case
**Then** an `AddGameUseCase` class exists in `src/collection/application/use-cases/`
**And** the use case accepts an `AddGameDTO` with required fields
**And** the use case validates input data (title required, valid platform, valid format)
**And** the use case creates a Game entity via `Game.create()`
**And** the use case calls `repository.save()` to persist the game
**And** the use case returns `Result<Game, AddGameError>` for type-safe error handling
**And** the use case has NO React dependencies
**And** the use case is registered in the DI container
**And** unit tests verify validation logic and error cases

---

### Story 2.4: Build Add Game UI Form with Validation

As a **Paul (user)**,
I want a mobile-first form to add a game to my collection,
So that I can quickly add a game I found in a store in less than 2 minutes.

**Acceptance Criteria:**

**Given** the AddGame use case exists
**When** I build the add game form
**Then** a form component exists in `src/collection/ui/components/GameForm.tsx`
**And** the form includes fields: title (required), platform (select), format (radio), purchase date (date picker), description (textarea, optional)
**And** the form uses React Hook Form for validation
**And** the form displays validation errors inline below each field
**And** all touch targets are minimum 44x44px (mobile accessibility)
**And** the form is keyboard accessible with proper focus management
**And** ARIA labels exist for all form fields
**And** the form calls AddGameUseCase via DI container on submit
**And** success shows a toast notification "Game added successfully"
**And** errors from use case are displayed user-friendly (not technical messages)
**And** the form resets after successful submission
**And** the form is responsive (mobile-first, works on desktop)

---

### Story 2.5: Create GetGames Use Case and Display Game List

As a **Paul (user)**,
I want to see all games in my collection as a browsable list,
So that I can view my entire collection at a glance.

**Acceptance Criteria:**

**Given** games exist in the collection
**When** I implement the game list
**Then** a `GetGamesUseCase` class exists in `src/collection/application/use-cases/`
**And** the use case calls `repository.findAll()` to retrieve all games
**And** the use case returns `Result<Game[], GetGamesError>`
**And** a `GameList` component exists in `src/collection/ui/components/`
**And** the game list displays: cover art placeholder, title, platform, format
**And** the list is responsive (grid on desktop, single column on mobile)
**And** the list supports infinite scroll or pagination for large collections
**And** empty state is shown when no games exist ("Add your first game!")
**And** loading state is shown while fetching from IndexedDB
**And** each game card is clickable to navigate to detail view
**And** the list is keyboard navigable (tab through items)
**And** screen readers announce "X games in collection"

---

### Story 2.6: Create GetGameById Use Case and Display Game Detail View

As a **Paul (user)**,
I want to view detailed information about a specific game,
So that I can see all stored details including purchase date, description, and status.

**Acceptance Criteria:**

**Given** games exist in the collection
**When** I implement game detail view
**Then** a `GetGameByIdUseCase` class exists in `src/collection/application/use-cases/`
**And** the use case accepts a gameId parameter
**And** the use case calls `repository.findById()` to retrieve the game
**And** the use case returns `Result<Game | null, GetGameError>`
**And** a `GameDetailPage` component exists in `src/collection/ui/pages/`
**And** the detail view displays all game properties: title, platform, format, purchase date, description, status
**And** the detail view shows cover art (or placeholder if not available)
**And** navigation back to list is available (back button or breadcrumb)
**And** "Edit" and "Delete" action buttons are available
**And** 404 state is shown if game not found
**And** the view is responsive (mobile-first)
**And** keyboard navigation works (tab to edit/delete buttons)
**And** screen readers announce game details properly

---

### Story 2.7: Implement EditGame Use Case and Edit UI

As a **Paul (user)**,
I want to edit details of a game in my collection,
So that I can correct mistakes or update information (e.g., change status from Wishlist to Owned).

**Acceptance Criteria:**

**Given** a game exists in the collection
**When** I implement edit functionality
**Then** an `EditGameUseCase` class exists in `src/collection/application/use-cases/`
**And** the use case accepts gameId and updated fields (EditGameDTO)
**And** the use case retrieves the game via `repository.findById()`
**And** the use case updates the game entity with new data
**And** the use case validates updated data (same rules as AddGame)
**And** the use case calls `repository.save()` to persist changes
**And** the use case returns `Result<Game, EditGameError>`
**And** the GameForm component is reused for edit mode (edit: true prop)
**And** the form is pre-populated with existing game data
**And** navigation from detail view to edit view works
**And** success shows toast "Game updated successfully"
**And** user is redirected to detail view after successful edit
**And** cancel button returns to detail view without saving
**And** the UI is keyboard accessible

---

### Story 2.8: Implement DeleteGame Use Case and Delete Confirmation

As a **Paul (user)**,
I want to delete a game from my collection,
So that I can remove games I no longer own or incorrectly added.

**Acceptance Criteria:**

**Given** a game exists in the collection
**When** I implement delete functionality
**Then** a `DeleteGameUseCase` class exists in `src/collection/application/use-cases/`
**And** the use case accepts a gameId parameter
**And** the use case calls `repository.delete(gameId)` to remove the game
**And** the use case returns `Result<void, DeleteGameError>`
**And** a confirmation modal/dialog is shown before deletion
**And** the modal displays: "Are you sure you want to delete [game title]? This action cannot be undone."
**And** the modal has "Cancel" and "Delete" buttons
**And** clicking "Delete" confirms and executes DeleteGameUseCase
**And** clicking "Cancel" closes modal without deletion
**And** success shows toast "Game deleted successfully"
**And** user is redirected to game list after successful deletion
**And** the game is removed from IndexedDB immediately
**And** the modal is keyboard accessible (ESC closes, Enter confirms)
**And** screen readers announce modal content and actions
**And** focus is trapped in modal while open

---

## Epic 3: Search, Filter & Sort Collection

**Epic Goal:** Paul can quickly find a specific game in a store (<10 seconds) via text search, filter by platform/status, and sort his collection for better organization.

### Story 3.1: Implement Text Search Use Case

As a **developer**,
I want to implement a text search use case for the game collection,
So that users can search games by title with fast IndexedDB queries.

**Acceptance Criteria:**

**Given** games exist in the collection
**When** I implement the search use case
**Then** a `SearchGamesUseCase` class exists in `src/collection/application/use-cases/`
**And** the use case accepts a search query string parameter
**And** the use case performs case-insensitive search on game titles
**And** the use case uses IndexedDB index on 'title' field for performance
**And** the use case returns `Result<Game[], SearchGamesError>`
**And** empty search query returns all games
**And** search results are returned in <100ms (NFR7 requirement)
**And** the use case handles special characters safely
**And** unit tests verify search logic with various queries

---

### Story 3.2: Build Search UI with Real-Time Results

As a **Paul (user)**,
I want to search my collection by typing a game title,
So that I can quickly find a specific game while standing in a store.

**Acceptance Criteria:**

**Given** the SearchGames use case exists
**When** I build the search UI
**Then** a search input field exists at the top of the game list
**And** search executes in real-time as user types (debounced 300ms)
**And** search results update the game list dynamically
**And** search input shows clear/reset button (X icon) when text exists
**And** search input has placeholder "Search games..."
**And** search input is keyboard accessible with proper focus
**And** ARIA live region announces result count to screen readers ("X games found")
**And** search input is minimum 44x44px height (mobile touch target)
**And** loading indicator shows while search executes
**And** empty search results show "No games found for '[query]'"
**And** search persists in URL query param (shareable/bookmarkable)

---

### Story 3.3: Implement Filter by Platform Use Case

As a **developer**,
I want to implement platform filtering logic,
So that users can view games for a specific platform.

**Acceptance Criteria:**

**Given** games exist with different platforms
**When** I implement the filter use case
**Then** the `SearchGamesUseCase` is extended to accept optional platform filter
**And** the use case filters games by platform using IndexedDB 'platform' index
**And** the filter supports multiple platform selection (PlayStation, Xbox, Nintendo, PC, etc.)
**And** no platform selected returns all games
**And** filter queries complete in <100ms (NFR7 requirement)
**And** filter combines with text search (AND logic: search AND platform)
**And** the use case returns `Result<Game[], SearchGamesError>`
**And** unit tests verify platform filtering logic

---

### Story 3.4: Implement Filter by Status Use Case

As a **developer**,
I want to implement status filtering logic,
So that users can view games by ownership status (Physical, Digital, Wishlist).

**Acceptance Criteria:**

**Given** games exist with different statuses
**When** I implement the status filter
**Then** the `SearchGamesUseCase` is extended to accept optional status filter
**And** the use case filters games by status using IndexedDB 'status' index
**And** the filter supports multiple status selection (Owned, Wishlist, Sold, Loaned)
**And** no status selected returns all games
**And** filter queries complete in <100ms (NFR7 requirement)
**And** filter combines with search and platform (AND logic: search AND platform AND status)
**And** the use case returns `Result<Game[], SearchGamesError>`
**And** unit tests verify status filtering logic

---

### Story 3.5: Implement Sort Functionality (Title, Platform, Date)

As a **developer**,
I want to implement sorting logic for the game collection,
So that users can organize their view by different criteria.

**Acceptance Criteria:**

**Given** games exist in the collection
**When** I implement sorting
**Then** the `SearchGamesUseCase` is extended to accept optional sort parameter
**And** the use case supports sorting by: title (A-Z), platform (alphabetical), purchase date (newest first)
**And** sorting is case-insensitive for text fields
**And** default sort is by title ascending
**And** sort works in combination with search and filters
**And** sort queries complete in <100ms (NFR7 requirement)
**And** the use case returns `Result<Game[], SearchGamesError>`
**And** unit tests verify all sort options

---

### Story 3.6: Build Combined Search/Filter/Sort UI

As a **Paul (user)**,
I want to search, filter, and sort my collection simultaneously,
So that I can quickly find exactly what I'm looking for in my collection.

**Acceptance Criteria:**

**Given** search, filter, and sort use cases exist
**When** I build the combined UI
**Then** a filter bar component exists with search, platform filter, status filter, and sort controls
**And** platform filter is a multi-select dropdown with checkboxes
**And** status filter is a multi-select dropdown with checkboxes
**And** sort is a dropdown with options: "Title A-Z", "Platform", "Newest First"
**And** active filters show badge count (e.g., "Platform (2)")
**And** "Clear all filters" button exists and resets all filters
**And** filter state persists in URL query params (shareable)
**And** filters are keyboard accessible (tab, enter, space to toggle)
**And** ARIA labels exist for all filter controls
**And** screen readers announce filter changes and result counts
**And** filters are responsive (mobile: bottom sheet, desktop: inline)
**And** touch targets are minimum 44x44px on mobile
**And** filter changes update results in real-time
**And** loading state shows while filters execute
**And** combined filters perform in <100ms (NFR7 requirement)

---

## Epic 4: Game Metadata Enrichment via External APIs

**Epic Goal:** Paul can search for a game via IGDB/RAWG and automatically import details (title, cover art, description, platform) instead of manually entering everything, reducing game addition to <2 minutes.

### Story 4.1: Implement IGDB API Adapter with OAuth2

As a **developer**,
I want to implement an IGDB API adapter with OAuth2 authentication,
So that the application can fetch game metadata from external sources following Clean Architecture principles.

**Acceptance Criteria:**

**Given** IGDB API credentials are configured
**When** I implement the IGDB adapter
**Then** an `IGameMetadataService` interface exists in `src/collection/domain/repositories/`
**And** the interface defines methods: `searchGames(query)`, `getGameDetails(id)`, `getCoverArt(url)`
**And** an `IGDBAdapter` implementation exists in `src/collection/infrastructure/api/`
**And** the adapter handles OAuth2 client credentials flow (Twitch)
**And** the adapter refreshes access tokens automatically when expired
**And** the adapter implements rate limiting to respect IGDB quotas
**And** the adapter returns `Result<GameMetadata, ApiError>` for all methods
**And** the adapter is registered in the DI container
**And** environment variables store API credentials (client ID, client secret)
**And** API errors are handled gracefully (network failures, quota exceeded, invalid response)
**And** integration tests verify API communication (can be mocked with MSW)

---

### Story 4.2: Create SearchExternalGames Use Case

As a **developer**,
I want to create a use case for searching external game databases,
So that business logic for external search is separated from infrastructure.

**Acceptance Criteria:**

**Given** the IGDB adapter exists
**When** I create the SearchExternalGames use case
**Then** a `SearchExternalGamesUseCase` class exists in `src/collection/application/use-cases/`
**And** the use case accepts a search query string parameter
**And** the use case calls `gameMetadataService.searchGames(query)`
**And** the use case maps external API response to domain GameMetadata DTOs
**And** the use case returns `Result<GameMetadata[], SearchExternalError>`
**And** the use case handles API failures gracefully (returns empty results with error)
**And** the use case limits results to top 10 matches (performance)
**And** the use case has NO React dependencies
**And** the use case is registered in the DI container
**And** unit tests verify search logic and error handling

---

### Story 4.3: Build Game Search UI with External API Results

As a **Paul (user)**,
I want to search for a game via external API and see results with cover art,
So that I can quickly find and import game details instead of typing everything manually.

**Acceptance Criteria:**

**Given** the SearchExternalGames use case exists
**When** I build the external search UI
**Then** an "Import from Database" button/link exists on the Add Game page
**And** clicking the button opens a search modal/drawer
**And** the modal contains a search input field
**And** typing in the search field calls SearchExternalGamesUseCase (debounced 500ms)
**And** search results display: cover art thumbnail, game title, platform(s), release year
**And** clicking a search result pre-fills the Add Game form with metadata
**And** the modal is dismissible (close button, ESC key, click outside)
**And** loading state shows while searching external API
**And** empty results show "No games found. Try a different search."
**And** API errors show user-friendly message "Unable to search. Please try again or add manually."
**And** the UI is keyboard accessible (tab through results, enter to select)
**And** ARIA labels exist for search input and results
**And** screen readers announce result count
**And** the UI is responsive (mobile: full screen, desktop: modal)

---

### Story 4.4: Implement Cover Art Download and Caching

As a **developer**,
I want to download and cache game cover art locally,
So that cover images are available offline and don't need to be re-downloaded.

**Acceptance Criteria:**

**Given** games have cover art URLs from IGDB
**When** I implement cover art caching
**Then** a cache strategy exists using Service Worker cache API
**And** cover art images are downloaded when a game is imported
**And** images are stored in Service Worker cache with max size limit (50MB total)
**And** cache eviction uses LRU (Least Recently Used) strategy when limit reached
**And** cached images are served immediately when available (Cache-First strategy)
**And** fallback placeholder image is shown if download fails
**And** images are lazy-loaded using Intersection Observer
**And** progressive image loading with blur-up placeholder (NFR8 requirement)
**And** alt text is generated from game title for accessibility
**And** cache status is visible in browser DevTools
**And** images work offline after first download

---

### Story 4.5: Create ImportGameMetadata Use Case

As a **developer**,
I want to create a use case for importing game metadata from external sources,
So that imported data is validated and transformed properly before saving.

**Acceptance Criteria:**

**Given** external game metadata is available
**When** I create the ImportGameMetadata use case
**Then** an `ImportGameMetadataUseCase` class exists in `src/collection/application/use-cases/`
**And** the use case accepts external GameMetadata DTO
**And** the use case validates imported data (required fields, valid formats)
**And** the use case transforms external data to internal Game entity
**And** the use case downloads and caches cover art
**And** the use case calls AddGameUseCase to save the game
**And** the use case returns `Result<Game, ImportGameError>`
**And** the use case handles partial import (some fields missing from API)
**And** the use case allows user to override imported data before saving
**And** unit tests verify import logic and validation

---

### Story 4.6: Implement Graceful Degradation When API Unavailable

As a **Paul (user)**,
I want the app to work seamlessly even when external APIs are unavailable,
So that I can always add games manually without disruption.

**Acceptance Criteria:**

**Given** external API might be unavailable (network failure, quota exceeded, API down)
**When** API calls fail
**Then** the "Import from Database" feature shows as unavailable/disabled
**And** a user-friendly message explains: "External search unavailable. You can add games manually."
**And** manual game entry form remains fully functional
**And** no error toasts or popups disrupt the user experience
**And** the app caches the last API availability status (avoid repeated failed requests)
**And** the app retries API connection after 5 minutes (exponential backoff)
**And** offline mode works without API calls (no failed network requests)
**And** previously imported games with cached cover art remain accessible
**And** error logging captures API failures for debugging (without user-facing errors)
**And** NFR16 requirement met: graceful network failure handling

---

## Epic 5: Wishlist Management & Prioritization

**Epic Goal:** Paul can track games he wants to buy with priorities (High/Medium/Low), manage his wishlist separately from collection, and easily convert a wishlist item to owned game when purchased.

### Story 5.1: Create Wishlist Bounded Context and Domain Entities

As a **developer**,
I want to create the Wishlist bounded context with domain entities,
So that wishlist logic is isolated from collection logic following DDD principles.

**Acceptance Criteria:**

**Given** the bounded context structure exists
**When** I create the Wishlist context
**Then** a `wishlist/` directory exists with subdirectories: `domain/`, `application/`, `infrastructure/`, `ui/`
**And** a `WishlistItem` entity class exists in `src/wishlist/domain/entities/WishlistItem.ts`
**And** the WishlistItem entity includes properties: id, gameTitle, platform, priority, maxPrice, notes, addedDate
**And** value objects exist for:
  - `WishlistItemId` (unique identifier)
  - `Priority` (High, Medium, Low enum)
  - `Platform` (reused from shared domain)
**And** the WishlistItem entity has validation logic in the domain layer
**And** the WishlistItem entity has factory method `WishlistItem.create()`
**And** the entity is pure TypeScript with NO infrastructure dependencies
**And** unit tests exist for WishlistItem entity validation logic

---

### Story 5.2: Implement IndexedDB Repository for Wishlist

As a **developer**,
I want to implement an IndexedDB repository for wishlist persistence,
So that wishlist items are stored locally and accessible offline following Repository pattern.

**Acceptance Criteria:**

**Given** the WishlistItem entity exists
**When** I implement the wishlist repository
**Then** an `IWishlistRepository` interface exists in `src/wishlist/domain/repositories/`
**And** the interface defines methods: `save()`, `findById()`, `findAll()`, `delete()`
**And** an `IndexedDBWishlistRepository` implementation exists in `src/wishlist/infrastructure/persistence/`
**And** an object store 'wishlist' is added to IndexedDB 'GameCollectionDB' database
**And** the 'wishlist' store has keyPath 'id'
**And** indexes are created for: 'priority', 'platform', 'addedDate'
**And** the repository maps between WishlistItem entities and storage DTOs
**And** the repository handles IndexedDB errors gracefully (Result pattern)
**And** the repository is registered in the DI container
**And** integration tests verify CRUD operations work with IndexedDB

---

### Story 5.3: Create AddToWishlist Use Case

As a **developer**,
I want to create an AddToWishlist use case,
So that business logic for adding items to wishlist is separated from UI.

**Acceptance Criteria:**

**Given** the WishlistItem entity and repository exist
**When** I create the AddToWishlist use case
**Then** an `AddToWishlistUseCase` class exists in `src/wishlist/application/use-cases/`
**And** the use case accepts an `AddToWishlistDTO` with required fields (gameTitle, platform, priority)
**And** the use case validates input data (title required, valid priority, valid platform)
**And** the use case creates a WishlistItem entity via `WishlistItem.create()`
**And** the use case calls `repository.save()` to persist the wishlist item
**And** the use case returns `Result<WishlistItem, AddToWishlistError>`
**And** the use case has NO React dependencies
**And** the use case is registered in the DI container
**And** unit tests verify validation logic and error cases

---

### Story 5.4: Build Add to Wishlist UI

As a **Paul (user)**,
I want to add a game to my wishlist with priority and max price,
So that I can track games I want to buy with my budget constraints.

**Acceptance Criteria:**

**Given** the AddToWishlist use case exists
**When** I build the add to wishlist UI
**Then** an "Add to Wishlist" button exists on game search results (from Epic 4)
**And** clicking the button opens a wishlist form modal/drawer
**And** the form includes fields: game title (pre-filled), platform (select), priority (High/Medium/Low radio), max price (optional number), notes (optional textarea)
**And** the form uses React Hook Form for validation
**And** the form displays validation errors inline
**And** all touch targets are minimum 44x44px (mobile accessibility)
**And** the form is keyboard accessible
**And** ARIA labels exist for all fields
**And** success shows toast "Added to wishlist"
**And** the modal closes after successful submission
**And** the form is responsive (mobile-first)

---

### Story 5.5: Create GetWishlist Use Case and Display Wishlist View

As a **Paul (user)**,
I want to view all items in my wishlist,
So that I can see what games I'm tracking and their priorities.

**Acceptance Criteria:**

**Given** wishlist items exist
**When** I implement the wishlist view
**Then** a `GetWishlistUseCase` class exists in `src/wishlist/application/use-cases/`
**And** the use case calls `repository.findAll()` to retrieve all wishlist items
**And** the use case returns `Result<WishlistItem[], GetWishlistError>`
**And** a `WishlistPage` component exists in `src/wishlist/ui/pages/`
**And** the wishlist displays: game title, platform, priority badge (color-coded), max price, notes preview
**And** items are sorted by priority (High → Medium → Low) then by date added
**And** the list is responsive (grid on desktop, single column on mobile)
**And** empty state shows "Your wishlist is empty. Start adding games you want!"
**And** loading state shows while fetching from IndexedDB
**And** navigation to wishlist page exists in main menu
**And** the view is keyboard accessible
**And** screen readers announce "X items in wishlist"

---

### Story 5.6: Create UpdateWishlistPriority Use Case

As a **developer**,
I want to create an UpdateWishlistPriority use case,
So that users can change the priority of wishlist items.

**Acceptance Criteria:**

**Given** a wishlist item exists
**When** I create the update priority use case
**Then** an `UpdateWishlistPriorityUseCase` class exists in `src/wishlist/application/use-cases/`
**And** the use case accepts wishlistItemId and new priority value
**And** the use case retrieves the item via `repository.findById()`
**And** the use case validates the new priority (High/Medium/Low only)
**And** the use case updates the item entity with new priority
**And** the use case calls `repository.save()` to persist changes
**And** the use case returns `Result<WishlistItem, UpdatePriorityError>`
**And** the use case has NO React dependencies
**And** unit tests verify priority update logic

---

### Story 5.7: Build Priority Management UI

As a **Paul (user)**,
I want to quickly change the priority of wishlist items,
So that I can adjust my priorities as my budget or interest changes.

**Acceptance Criteria:**

**Given** the UpdateWishlistPriority use case exists
**When** I build the priority UI
**Then** each wishlist item card shows current priority with color badge (High=red, Medium=orange, Low=green)
**And** clicking the priority badge opens a priority selector (radio buttons or dropdown)
**And** selecting a new priority calls UpdateWishlistPriorityUseCase
**And** the list re-sorts automatically after priority change
**And** success shows subtle toast "Priority updated"
**And** keyboard shortcuts exist for priority changes (1=High, 2=Medium, 3=Low when item focused)
**And** ARIA labels announce priority changes to screen readers
**And** the UI is touch-friendly (44x44px minimum)
**And** changes are instant (optimistic UI update)

---

### Story 5.8: Create RemoveFromWishlist Use Case

As a **Paul (user)**,
I want to remove items from my wishlist,
So that I can clean up games I'm no longer interested in without adding them to my collection.

**Acceptance Criteria:**

**Given** a wishlist item exists
**When** I implement remove functionality
**Then** a `RemoveFromWishlistUseCase` class exists in `src/wishlist/application/use-cases/`
**And** the use case accepts a wishlistItemId parameter
**And** the use case calls `repository.delete(wishlistItemId)` to remove the item
**And** the use case returns `Result<void, RemoveFromWishlistError>`
**And** a "Remove" button exists on each wishlist item card
**And** clicking "Remove" shows confirmation modal: "Remove [game title] from wishlist?"
**And** modal has "Cancel" and "Remove" buttons
**And** confirming executes RemoveFromWishlistUseCase
**And** success shows toast "Removed from wishlist"
**And** the item disappears from the list immediately
**And** the modal is keyboard accessible
**And** screen readers announce removal

---

### Story 5.9: Implement MoveToCollection Use Case with Event Bus

As a **Paul (user)**,
I want to move a wishlist item to my collection when I purchase the game,
So that my wishlist stays clean and my collection is automatically updated.

**Acceptance Criteria:**

**Given** a wishlist item exists and collection context is available
**When** I implement move to collection
**Then** a `MoveToCollectionUseCase` class exists in `src/wishlist/application/use-cases/`
**And** the use case accepts wishlistItemId and purchase details (price paid, purchase date, format)
**And** the use case retrieves the wishlist item via `repository.findById()`
**And** the use case publishes a `GamePurchased` event to the Event Bus
**And** the collection context subscribes to `GamePurchased` events
**And** the event handler calls AddGameUseCase with wishlist item data
**And** after successful game addition, RemoveFromWishlistUseCase is called
**And** the use case returns `Result<Game, MoveToCollectionError>`
**And** a "Mark as Purchased" button exists on wishlist items
**And** clicking opens a form: price paid (pre-filled with max price), purchase date (default today), format (Physical/Digital)
**And** success shows toast "Moved to collection!"
**And** the item disappears from wishlist and appears in collection
**And** rollback occurs if collection add fails (item stays in wishlist)
**And** Event Bus documentation exists explaining cross-context communication

---

## Epic 6: Data Portability & Backup

**Epic Goal:** Paul can export his entire collection (games + wishlist) as JSON for backup, import data from a backup, and migrate his data between devices/browsers without loss.

### Story 6.1: Create ExportCollection Use Case

As a **developer**,
I want to create an ExportCollection use case,
So that all user data (games + wishlist) can be serialized to JSON format.

**Acceptance Criteria:**

**Given** games and wishlist items exist in IndexedDB
**When** I create the export use case
**Then** an `ExportCollectionUseCase` class exists in `src/shared/application/use-cases/`
**And** the use case retrieves all games via GetGamesUseCase
**And** the use case retrieves all wishlist items via GetWishlistUseCase
**And** the use case serializes data to JSON format with structure:
  ```json
  {
    "version": "1.0",
    "exportedAt": "2026-01-26T10:30:00Z",
    "games": [...],
    "wishlist": [...]
  }
  ```
**And** the use case includes metadata: version number, export timestamp
**And** the use case returns `Result<string, ExportError>` (JSON string)
**And** sensitive data is NOT included in export (if any exists)
**And** the JSON is pretty-printed for readability
**And** the use case handles empty collections gracefully
**And** unit tests verify JSON structure and data integrity

---

### Story 6.2: Build Export UI with Privacy Warning

As a **Paul (user)**,
I want to export my collection data with a clear privacy warning,
So that I understand the exported file contains my personal data and can be backed up safely.

**Acceptance Criteria:**

**Given** the ExportCollection use case exists
**When** I build the export UI
**Then** an "Export Data" button exists in settings/menu
**And** clicking the button shows a privacy warning modal:
  - "This file contains your personal game collection data."
  - "Store it securely and do not share publicly."
  - "File size: approximately X KB"
**And** modal has "Cancel" and "Download Export" buttons
**And** confirming calls ExportCollectionUseCase
**And** a JSON file is downloaded: `game-collection-backup-YYYY-MM-DD.json`
**And** success shows toast "Collection exported successfully"
**And** export progress indicator shows for large collections
**And** the modal is keyboard accessible
**And** ARIA labels exist for privacy warning
**And** screen readers announce the warning message
**And** NFR12 requirement met: privacy warning before export

---

### Story 6.3: Create ImportCollection Use Case with Validation

As a **developer**,
I want to create an ImportCollection use case with data validation,
So that imported data is verified and conflicts are handled properly.

**Acceptance Criteria:**

**Given** a JSON export file exists
**When** I create the import use case
**Then** an `ImportCollectionUseCase` class exists in `src/shared/application/use-cases/`
**And** the use case accepts a JSON string parameter
**And** the use case validates JSON structure (version, required fields)
**And** the use case checks data integrity (valid dates, valid enums, required fields)
**And** the use case detects conflicts:
  - Duplicate game IDs
  - Duplicate wishlist item IDs
**And** the use case offers conflict resolution strategies:
  - Skip duplicate
  - Overwrite existing
  - Keep both (generate new ID)
**And** the use case imports games using AddGameUseCase
**And** the use case imports wishlist items using AddToWishlistUseCase
**And** the use case returns `Result<ImportSummary, ImportError>` with counts (imported, skipped, failed)
**And** the use case handles partial failures (some items succeed, some fail)
**And** invalid JSON returns clear error message
**And** unit tests verify validation and conflict detection

---

### Story 6.4: Build Import UI with Conflict Resolution

As a **Paul (user)**,
I want to import a backup file with clear feedback on what was imported,
So that I can restore my collection data safely with full visibility.

**Acceptance Criteria:**

**Given** the ImportCollection use case exists
**When** I build the import UI
**Then** an "Import Data" button exists in settings/menu
**And** clicking the button opens a file picker for JSON files
**And** selecting a file validates it immediately (shows error if invalid)
**And** if conflicts detected, a conflict resolution dialog shows:
  - List of conflicts (game titles with duplicate IDs)
  - Options: "Skip all duplicates" or "Overwrite all existing" or "Choose per item"
**And** user selects resolution strategy before import proceeds
**And** import progress shows: "Importing X of Y items..."
**And** success shows summary modal:
  - "Successfully imported: X games, Y wishlist items"
  - "Skipped (duplicates): Z items"
  - "Failed: N items" (with reasons if any)
**And** errors show user-friendly messages: "Invalid file format" or "Some items could not be imported"
**And** imported items appear immediately in collection and wishlist
**And** the UI is keyboard accessible
**And** ARIA live regions announce import progress
**And** large imports don't freeze the UI (chunked processing)
**And** file size limit is enforced (e.g., max 10MB)

