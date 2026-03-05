# 🎮 Game Collection Manager - Clean Architecture Lab

> A living laboratory exploring Clean Architecture patterns in React through a real-world game collection management application.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Build Status

[![Build](https://github.com/pplancq/lab-clean-architecture-react/actions/workflows/build.yaml/badge.svg)](https://github.com/pplancq/lab-clean-architecture-react/actions/workflows/build.yaml)

## Sonarcloud Quality Metrics

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=pplancq_lab-clean-architecture-react&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=pplancq_lab-clean-architecture-react)

[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=pplancq_lab-clean-architecture-react&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=pplancq_lab-clean-architecture-react)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=pplancq_lab-clean-architecture-react&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=pplancq_lab-clean-architecture-react)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=pplancq_lab-clean-architecture-react&metric=bugs)](https://sonarcloud.io/summary/new_code?id=pplancq_lab-clean-architecture-react)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=pplancq_lab-clean-architecture-react&metric=coverage)](https://sonarcloud.io/summary/new_code?id=pplancq_lab-clean-architecture-react)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=pplancq_lab-clean-architecture-react&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=pplancq_lab-clean-architecture-react)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=pplancq_lab-clean-architecture-react&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=pplancq_lab-clean-architecture-react)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=pplancq_lab-clean-architecture-react&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=pplancq_lab-clean-architecture-react)

---

## 🎯 Project Purpose

This project has a **dual purpose**:

1. **Educational Laboratory (80%)**: Explore, validate, and document Clean Architecture patterns in React-based frontend applications
2. **Practical Application (20%)**: Build a functional tool for managing multi-platform video game collections

**Goal**: Provide concrete evidence and honest insights about when and how Clean Architecture principles apply to modern frontend development—not just theory, but real implementation with real trade-offs.

---

## 🧪 What Makes This Different?

- **Honest Exploration**: Documents both successes AND failures—not pure advocacy
- **Real Complexity**: Handles external APIs, multi-platform sync, conflict resolution, offline-first patterns
- **Frontend-Focused**: Addresses React-specific concerns (hooks, context, state management)
- **Comprehensive Documentation**: Architecture decisions, refactorings, and lessons learned captured as we build
- **Production-Quality**: Must work well enough for daily use—architecture is proven by utility

---

## 📚 Documentation

### Getting Started

- **[Setup & Installation](./docs/setup.md)** - Template initialization, prerequisites, available scripts

### Planning & Requirements

- **[Product Requirements Document (PRD)](_bmad-output/planning-artifacts/prd.md)** - Comprehensive requirements, architecture decisions, and success criteria
- **[Product Brief](_bmad-output/planning-artifacts/product-brief-lab-clean-architecture-react-2026-01-14.md)** - Complete project vision, users, metrics, and MVP scope
- **[UX Design Specification](_bmad-output/planning-artifacts/ux-design-specification.md)** - Complete UX strategy, component specs, patterns, responsive design & accessibility
- **[Epics & Stories](_bmad-output/planning-artifacts/epics.md)** - 6 epics with 39 implementation-ready stories and acceptance criteria
- **[Next Steps](./next-steps.md)** - Roadmap and recommended workflow for implementation

### UX Design Assets

- **[Design Directions Mockups](_bmad-output/planning-artifacts/ux-design-directions.html)** - Visual design direction mockups

### Architecture ✅

- **[Architecture Documentation](./docs/README.md)** - Complete guide to our Clean Architecture + DDD implementation
  - [Architecture Overview](./docs/architecture/README.md) - Core principles, layer diagrams, and bounded contexts
  - [Folder Structure](./docs/architecture/folder-structure.md) - Directory organization explained
  - [Dependency Rules](./docs/architecture/dependency-rules.md) - Critical dependency constraints
  - [Dependency Injection](./docs/architecture/dependency-injection.md) - InversifyJS configuration and patterns
  - [Domain Layer](./docs/layers/domain-layer.md) - Domain purity and business logic rules
- **[Architecture Decision Records (ADRs)](./DECISIONS.md)** - 11 architectural decisions with honest trade-offs
  - ADR-001: Starter Template Selection (@pplancq/react-app)
  - ADR-002: Clean Architecture + DDD Bounded Contexts
  - ADR-003: IndexedDB Storage Strategy
  - ADR-004: Result/Either Pattern for Error Handling
  - ADR-005: InversifyJS for Dependency Injection
  - ADR-006: PWA from Day One
  - ADR-007: No TypeScript Decorators
  - ADR-008: Result Pattern Usage Convention
  - ADR-009: Symbol-based Service Identifiers
  - ADR-010: DTO Date Type Conventions
  - ADR-011: Map-Centric Store with Auto-Triggered Fetches
- **[Architecture Decision Document](_bmad-output/planning-artifacts/architecture.md)** - Planning-phase architecture decisions and patterns
- **[Project Context](./project-context.md)** - Critical rules and patterns for AI agents (naming conventions, code patterns, anti-patterns)
- **[PWA Infrastructure](./docs/infrastructure/pwa.md)** - Progressive Web App implementation (Service Worker, caching, offline support)
- **[Result Pattern Guide](./docs/result-pattern.md)** - Type-safe error handling without exceptions

### Learnings (Coming Soon)

- LEARNINGS.md - Weekly insights and retrospectives
- REGRETS.md - Honest mistakes and lessons learned

---

## 🚀 MVP Features (v1.0)

**Phase 1: Core Collection (Weeks 1-4)**

- **📚 Game Collection CRUD** - Manual entry (title, platform, format, date, notes)
- **🖼️ Cover Art** - Upload and display game covers
- **🔍 Search & Filter** - Text search + platform/status filters

**Phase 1: Wishlist (Weeks 7-8)**

- **🛒 Wishlist Management** - Add games, set priority, track budget
- **💰 Price Tracking** - Manual entry only (automated tracking deferred post-MVP)

**Phase 1: PWA (Weeks 9-10)**

- **📱 Installable App** - Home screen installation
- **🔌 Offline Support** - Full functionality without network
- **⚡ Fast Loading** - App shell caching, instant startup

**MVP Confirmed (Weeks 1-10)**

- **📖 Metadata Auto-Fetch** - IGDB API integration (Phase 0 validated)
- **🔍 Advanced Search** - Filter by genre, platform, year, rating
- **📊 Basic Statistics** - Collection count, platform breakdown

**Post-MVP (Phase 2+)**

- **🏆 Trophy Sync** - PSN achievements via psn-api (researched, deferred due to ban risk)
- **💰 Automated Price Tracking** - IsThereAnyDeal API integration (researched, deferred to focus MVP)
- **🔧 Maintenance System** - Console upkeep tracking with photos
- **📊 Advanced Statistics** - Collection insights, completion rates, playtime trends
- **☁️ Backend Migration** - Firebase or NestJS (demonstrates Clean Arch flexibility)

**Development Philosophy:**

- ✅ Ship 1 feature per week (no exceptions)
- ✅ "Good enough" code > perfect paralysis
- ✅ Max 5h/week development (sustainable pace)
- ✅ Document architectural decisions in real-time

---

## 🛠️ Tech Stack

**Frontend:**

- React 19+ with TypeScript (strict mode)
- Rsbuild (build tooling)
- React Router (Browser History mode)
- React Hook Form (form management)

**State Management:**

- TanStack Query Core + InversifyJS (dependency injection)
- React hooks (local UI state)

**Storage:**

- IndexedDB with `idb` library (MVP - offline-first)
- Future: Firebase or NestJS backend (demonstrates Clean Arch flexibility)

**Architecture:**

- Clean Architecture principles (Domain, Use Cases, Infrastructure, Presentation)
- Repository pattern for data abstraction
- Dependency Inversion throughout
- InversifyJS for Dependency Injection

**PWA:**

- Rsbuild PWA Plugin
- Service Worker (app shell caching)
- Offline-first capabilities

**Testing:**

- Vitest + React Testing Library
- Unit tests (Use Cases, Entities)
- Integration tests (Repository adapters)

**Browser Support:**

- Modern browsers only (last 2 years)
- Chrome/Edge, Firefox, Safari (desktop + mobile)
- No IE or legacy Edge support
- ✅ MVP scope validated

**Next Steps:**

- 📋 **Phase 0**: API Research Sprint (2-3 days) - Validate external APIs before coding
- 🏗️ **Phase 1**: Architecture Design (1 week) - Define Clean Architecture structure
- ✅ **Phase 2**: UX Design (COMPLETE) - Mobile-first wireframes, component strategy, patterns
- 📦 **Phase 3**: Epic Breakdown (2-3 days) - Transform FRs into implementable stories
- 💻 **Phase 4**: Development Setup (1-2 days) - Rsbuild + React + IndexedDB + PWA
- 🚀 **Phase 5**: MVP Development (Weeks 1-10) - Ship 1 feature per week

See [Next Steps](./next-steps.md) for detailed roadmap.

---

## 💻 Available Commands

### Development

```bash
npm run start      # Start development server
npm run start:mock # Start development server with MSW mocks
npm run build      # Build for production
npm run preview    # Preview production build
```

### Testing

```bash
npm run test            # Run all tests (unit + e2e)
npm run test:unit       # Run unit tests once
npm run test:unit:watch # Run unit tests in watch mode
npm run test:e2e        # Run end-to-end tests
npm run test:e2e:watch  # Run e2e tests in watch mode
npm run test:e2e:ui     # Run e2e tests with Playwright UI
```

### Linting & Formatting

```bash
npm run lint               # Run all linters
npm run lint:eslint        # Run ESLint
npm run lint:eslint:fix    # Fix ESLint issues
npm run lint:stylelint     # Run Stylelint
npm run lint:stylelint:fix # Fix Stylelint issues
npm run lint:prettier      # Check Prettier formatting
npm run lint:prettier:fix  # Fix Prettier formatting
npm run lint:tsc           # Type-check with TypeScript
```

### Playwright Tools

```bash
npm run playwright:install     # Install Playwright browsers
npm run playwright:show-report # View test reports
npm run playwright:codegen     # Generate test code
```

---

## 🏗️ Project Status

**Current Phase**: Phase 4b - Development Setup ⏭️

**Current Sprint**: Sprint 1 (27 jan → 13 fév 2026) - 15 P0 stories ready-for-dev

**GitHub Board**: [Issues Board](https://github.com/pplancq/lab-clean-architecture-react/issues) | [Sprint Status](/_bmad-output/implementation-artifacts/sprint-status.yaml)

**Completed Phases**:

- ✅ **Phase 0: API Research** (Jan 21-22, 2026)
  - IGDB metadata API selected (partial FR support)
  - Trophy sync research complete (deferred post-MVP)
  - Price tracking research complete (deferred post-MVP)
  - Manual-first MVP approach validated
- ✅ **Product Brief** complete
- ✅ **Product Requirements Document (PRD)** complete
- ✅ **UX Design Specification** complete
  - Mobile-first responsive strategy (320px-1440px)
  - 12 custom components specified (extending shelter-ui)
  - WCAG 2.1 AA+ accessibility compliance
  - 4 critical user journey flows documented
  - Complete UX patterns for consistency
- ✅ **Phase 1: Architecture Design** (Jan 26, 2026)
  - Complete Clean Architecture + DDD Bounded Contexts structure
  - 10 core architectural decisions documented
  - 15+ implementation patterns defined
  - 3 bounded contexts specified (Collection, Wishlist, Maintenance)
  - Project structure with 200+ file paths
  - Project context file for AI agent consistency
- ✅ **Phase 3: Epic Breakdown + GitHub Issues** (Jan 27, 2026)
  - 6 epics organized by user value (Foundation, Collection, Search, API, Wishlist, Backup)
  - 46 implementation-ready stories with detailed acceptance criteria
  - 100% coverage of 37 functional requirements
  - Accessibility integrated transversally in all stories
  - Story dependencies validated (no forward dependencies)
  - Epic independence validated (each epic is standalone)
  - **52 GitHub Issues created** (6 epics + 46 stories)
  - All stories sized (2 XS, 13 S, 17 M, 6 L, 0 XL)
  - All stories prioritized (14 P0, 18 P1, 14 P2)
  - Story #36 decomposed into 6 sub-stories (#46-#51)
  - CI + SonarCloud + GitHub Copilot story added (#52)
- ✅ **Phase 4a: Sprint Planning** (Jan 27, 2026)
  - Sprint 1 initialized (27 jan → 13 fév 2026, 12 working days)
  - 15 P0 stories assigned to Sprint 1 (Epic 1: 7 stories, Epic 2: 8 stories)
  - Sprint goal: "Establish technical foundations and implement core collection management"
  - All stories moved to `ready-for-dev` status
  - Epic 1 and Epic 2 moved to `in-progress` status
  - GitHub Project Iterations activated
  - Sprint tracking file created: `sprint-status.yaml`

**Next Steps**:

- ⏭️ **Phase 4b: Development Setup** (1-2 days, NEXT) - Initialize with @pplancq/react-app
- ⏳ **Phase 5: Sprint 1 Development** (12 days) - Epic 1 + Epic 2 complete
- ⏳ **Sprint 2+**: Epic 3-6 implementation (Weeks 3-10)

---

## 🎓 Learning Goals

This project aims to answer:

- **When does Clean Architecture add value in React?** (vs when is it over-engineering)
- **How do Clean Arch patterns integrate with React patterns?** (hooks, context, etc.)
- **What are the real trade-offs?** (complexity vs maintainability, boilerplate vs flexibility)
- **Can frontend architecture prevent "spaghetti code"?** (prove it with daily use)

---

## 🤝 Contributing

This is primarily a personal learning project, but:

- **Questions welcome** - Open issues to discuss architectural decisions
- **Suggestions welcome** - Share your experiences with Clean Architecture in React
- **Learning together** - If you're exploring similar patterns, let's share insights

---

## 📖 Background

This project emerged from debugging too many React applications that started clean but became unmaintainable "sac de nœuds" (tangles). The goal is to validate whether Clean Architecture principles can prevent this deterioration in frontend codebases—and document the journey honestly.

---

## 📝 License

MIT

---

## 👤 Author

**Paul**

- Conference talks planned: Devoxx, DevFest
- Sharing learnings with the React community

---

## 🌟 Acknowledgments

Inspired by:

- Robert C. Martin's Clean Architecture principles
- The need for better frontend code organization
- A personal game collection that needs proper management

---

_This README will evolve as the project progresses. Watch this space for architecture insights, implementation details, and honest lessons learned._
