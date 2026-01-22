# 🎮 Game Collection Manager - Clean Architecture Lab

> A living laboratory exploring Clean Architecture patterns in React through a real-world game collection management application.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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

### Planning & Requirements
- **[Product Requirements Document (PRD)](_bmad-output/planning-artifacts/prd.md)** - Comprehensive requirements, architecture decisions, and success criteria
- **[Product Brief](_bmad-output/planning-artifacts/product-brief-lab-clean-architecture-react-2026-01-14.md)** - Complete project vision, users, metrics, and MVP scope
- **[UX Design Specification](_bmad-output/planning-artifacts/ux-design-specification.md)** - Complete UX strategy, component specs, patterns, responsive design & accessibility
- **[Next Steps](./next-steps.md)** - Roadmap and recommended workflow for implementation

### UX Design Assets
- **[Design Directions Mockups](_bmad-output/planning-artifacts/ux-design-directions.html)** - Visual design direction mockups

### Architecture (Coming Soon)
- Architecture Decision Records (ADRs)
- Clean Architecture patterns and diagrams
- Repository and Use Case examples

### Learnings (Coming Soon)
- DECISIONS.md - Real-time architectural decisions
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

## 🏗️ Project Status

**Current Phase**: Phase 1 - Architecture Design ⏭️

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

**Next Steps**:
- ⏭️ **Phase 1: Architecture Design** (1 week) - Define Clean Architecture structure
- ⏳ **Phase 3: Epic Breakdown** (2-3 days) - Transform FRs into stories
- ⏳ **Phase 4: Development Setup** (1-2 days) - Rsbuild + React + IndexedDB
- ⏳ **Phase 5: MVP Development** (Weeks 1-10) - Ship 1 feature/week

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
