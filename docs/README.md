# Documentation

Welcome to the **Game Collection Manager** documentation.

## Introduction

This project is a **pedagogical laboratory** (80% learning, 20% utility) demonstrating the application of **Clean Architecture** and **Domain-Driven Design (DDD) Bounded Contexts** in a modern React application.

> **Core Principle:** Every architectural decision must be explicit, documented, and transparent for learning purposes.

## 📖 Getting Started

- **[Setup Guide](./setup.md)** - Installation and development environment setup

## 🏗️ Architecture

Core architectural concepts and principles:

- **[Architecture Overview](./architecture/README.md)** - Introduction to our hybrid Clean Architecture + DDD approach
- **[Folder Structure](./architecture/folder-structure.md)** - Detailed explanation of directory organization
- **[Dependency Rules](./architecture/dependency-rules.md)** - Critical rules for maintaining clean dependencies
- **[Dependency Injection](./architecture/dependency-injection.md)** - InversifyJS configuration and usage patterns

## 📚 Layers

Deep dive into each architectural layer:

- **[Domain Layer](./layers/domain-layer.md)** - Business logic and domain purity rules
- **Application Layer** _(Coming soon)_ - Use cases and application services
- **Infrastructure Layer** _(Coming soon)_ - Adapters and external integrations
- **[UI Layer](./layers/ui-layer.md)** - React components, formField wrappers, RHF + Value Objects pattern, Observable Store pattern

## 🎯 Use Cases

Application-layer orchestration:

- **[AddGame Use Case](./use-cases/add-game.md)** - Adding games to the collection with domain validation
- **[GetGameById Use Case](./use-cases/get-game-by-id.md)** - Retrieving a single game by ID with error mapping
- **[EditGame Use Case](./use-cases/edit-game.md)** - Partial update of an existing game via entity update methods
- **[DeleteGame Use Case](./use-cases/delete-game.md)** - Permanent removal of a game with confirmation flow

## ⚙️ Infrastructure

Cross-cutting technical concerns:

- **[PWA Infrastructure](./infrastructure/pwa.md)** - Progressive Web App implementation (Service Worker, caching, offline support)
- **[IndexedDB Persistence](./persistence-indexeddb.md)** - Repository pattern implementation with IndexedDB for client-side data storage

## 🎯 Bounded Contexts

Domain-Driven Design contexts:

- **Collection Context** _(Coming soon)_ - Game collection management
- **Wishlist Context** _(Coming soon)_ - Wishlist tracking
- **Maintenance Context** _(Coming soon)_ - Console maintenance

## 🛠️ Patterns & Guides

Practical how-to guides and patterns:

- **[Result Pattern](./result-pattern.md)** - Type-safe error handling without exceptions
- **[Value Objects](./value-objects.md)** - Immutable value objects with self-validation
- **Adding a New Feature** _(Coming soon)_ - Step-by-step guide for implementing features
- **Testing Strategy** _(Coming soon)_ - Testing approach for each layer
- **Common Patterns** _(Coming soon)_ - Recurring patterns and solutions

## 🎓 Learning Path

Recommended reading order for newcomers:

1. **Start here:** [Architecture Overview](./architecture/README.md)
2. **Understand structure:** [Folder Structure](./architecture/folder-structure.md)
3. **Learn constraints:** [Dependency Rules](./architecture/dependency-rules.md)
4. **Setup DI:** [Dependency Injection](./architecture/dependency-injection.md)
5. **Master domain:** [Domain Layer](./layers/domain-layer.md)
6. **See it in action:** [UI Layer](./layers/ui-layer.md) — components, forms, RHF + Value Objects
7. **Explore code:** Check `src/` and `project-context.md`

## 📝 Contributing to Documentation

> **Important:** Always update this `README.md` when adding or modifying a doc file.
> See [`.github/instructions/documentation.instructions.md`](../.github/instructions/documentation.instructions.md) for the full maintenance rules (naming conventions, mandatory sections per doc type, sync checklist).

Quick rules:

- Place architecture docs in `architecture/`, ADRs in `architecture/adr/`
- Place layer-specific docs in `layers/`
- Place use case docs in `use-cases/`
- Place infrastructure docs in `infrastructure/`
- Update **this README.md** with the new file link immediately
- Keep documentation in English
- Use Mermaid for diagrams, specify language on all code blocks

## 🔗 External Resources

- [Clean Architecture (Uncle Bob)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design (Eric Evans)](https://www.domainlanguage.com/ddd/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

**Questions?** Check `project-context.md` in the project root for technical details.
