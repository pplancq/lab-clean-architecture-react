# Architecture Overview

## Architectural Philosophy

### Clean Architecture + DDD Bounded Contexts (Hybrid Approach)

Our approach combines:

- **Vertical slicing** via Bounded Contexts (DDD)
- **Horizontal layering** via Clean Architecture layers
- **Strict separation** of concerns and dependencies

### Architecture Diagram

**Layered Architecture (Horizontal):**

```mermaid
graph TD
    UI[UI Layer<br/>React Components]
    APP[Application Layer<br/>Use Cases & Services]
    DOM[Domain Layer<br/>Pure Business Logic]
    INFRA[Infrastructure Layer<br/>External Adapters]

    UI -->|depends on| APP
    APP -->|depends on| DOM
    INFRA -.->|implements interfaces<br/>defined by| DOM

    style DOM fill:#e1f5e1,stroke:#4caf50,stroke-width:3px
    style APP fill:#e3f2fd,stroke:#2196f3,stroke-width:2px
    style UI fill:#fff3e0,stroke:#ff9800,stroke-width:2px
    style INFRA fill:#fce4ec,stroke:#e91e63,stroke-width:2px
```

**Vertical Organization (Bounded Contexts):**

```mermaid
graph TB
    subgraph APP_LAYER[Application Bootstrap]
        BOOT[Providers, Routing, Config]
    end

    subgraph SHARED[Shared Kernel]
        direction LR
        S_DOM[domain/]
        S_APP[application/]
        S_INFRA[infrastructure/]
        S_UI[ui/]
    end

    subgraph COLLECTION[Collection Context]
        direction LR
        C_DOM[domain/]
        C_APP[application/]
        C_INFRA[infrastructure/]
        C_UI[ui/]
    end

    APP_LAYER --> SHARED
    APP_LAYER --> COLLECTION
    COLLECTION --> SHARED

    style APP_LAYER fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px
    style SHARED fill:#e8eaf6,stroke:#3f51b5,stroke-width:2px
    style COLLECTION fill:#e1f5e1,stroke:#4caf50,stroke-width:2px
```

## Folder Structure

```
src/
├── app/                    # Application foundation layer
├── shared/                 # Shared kernel (cross-context)
│   ├── domain/             # Shared domain primitives
│   ├── application/        # Shared application logic
│   ├── infrastructure/     # Shared infrastructure
│   └── ui/                 # Shared UI components
└── collection/             # Collection bounded context
    ├── domain/             # Collection entities & business logic
    ├── application/        # Collection use cases
    ├── infrastructure/     # Collection data access & adapters
    └── ui/                 # Collection React components
```

## Planned Bounded Contexts

### 1. Collection (Implemented)

Video game collection management.

- **Responsibilities:** Game CRUD, organization by consoles
- **Main Entities:** Game, Console, CollectionItem

### 2. Wishlist (Coming)

Wishlist tracking.

- **Responsibilities:** Track desired games, priorities
- **Main Entities:** WishlistItem, WishPriority

### 3. Maintenance (Coming)

Console maintenance management.

- **Responsibilities:** Repair history, console condition tracking
- **Main Entities:** MaintenanceRecord, ConsoleCondition

## Fundamental Dependency Rule

**Dependencies flow INWARD toward the Domain layer:**

```mermaid
graph LR
    UI[UI Layer]
    APP[Application Layer]
    DOM[Domain Layer]
    INFRA[Infrastructure Layer]

    UI -->|depends on| APP
    APP -->|depends on| DOM
    INFRA -.->|implements interfaces<br/>defined by| DOM
    INFRA -.->|implements interfaces<br/>defined by| APP

    style DOM fill:#e1f5e1,stroke:#4caf50,stroke-width:3px
    style APP fill:#e3f2fd,stroke:#2196f3,stroke-width:2px
    style UI fill:#fff3e0,stroke:#ff9800,stroke-width:2px
    style INFRA fill:#fce4ec,stroke:#e91e63,stroke-width:2px
```

**Allowed Dependencies:**

- ✅ **UI** can depend on → Application, Domain (DTOs only)
- ✅ **Application** can depend on → Domain
- ✅ **Infrastructure** implements interfaces from → Domain, Application (Dependency Inversion)
- ✅ **Domain** depends on → NOTHING (pure TypeScript)

**Forbidden Dependencies:**

- ❌ **Domain** can NEVER depend on → Application, UI, Infrastructure
- ❌ **Application** can NEVER depend on → UI, Infrastructure
- ❌ **Infrastructure** can NEVER depend on → UI
- ❌ **UI** can NEVER depend on → Infrastructure (must go through Application layer)

**Summary:** All dependencies point **inward** toward the Domain (the core business logic).

## Related Documents

- [Folder Structure](./folder-structure.md) - Detailed organization
- [Dependency Rules](./dependency-rules.md) - Strict rules to follow
- [Domain Layer](../layers/domain-layer.md) - Domain purity rules

## Learning Objectives

By working on this project, you will learn:

1. ✅ How to organize a React application following Clean Architecture
2. ✅ How to identify and isolate bounded contexts (DDD)
3. ✅ How to maintain strict dependency rules
4. ✅ How to test each layer independently
5. ✅ How to avoid tight coupling between business modules

## Next Steps

To start developing in this architecture:

1. Read [Dependency Rules](./dependency-rules.md)
2. Read [Domain Layer](../layers/domain-layer.md)
3. Consult `project-context.md` for technical details
