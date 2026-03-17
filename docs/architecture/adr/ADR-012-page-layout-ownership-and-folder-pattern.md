# ADR-012: Page Layout Ownership and Folder Pattern

**Status:** ✅ Accepted  
**Date:** 2026-03-09  
**Epic:** Epic 2 Retro / Sprint 4

## Context

During Epic 2, four page components were created as flat files directly in `src/collection/ui/pages/`:

```
src/collection/ui/pages/
├── AddGame.tsx
├── EditGame.tsx
├── GameDetail.tsx
├── GameDetail.module.css
└── Home.tsx
```

This raised two related questions that had been deferred from Epic 2:

1. **Layout Ownership:** Who is responsible for the layout of a page — the page component itself, or a parent (router, AppShell, shell component)?
2. **Folder Convention:** Should page components follow the same `<Name>/<Name>.tsx` folder convention as all other components in the project?

These two questions are directly linked: the answer to (1) determines the scope and complexity of a page component, which in turn determines whether the folder convention applies.

The project's `react.instructions.md` already mandates:

> _"Components must always be placed in a folder/file `<ComponentName>/<ComponentName>.tsx`."_

However, pages were created as flat files, implicitly treating them as a special case rather than first-class components.

## Decision

### 1. Page Layout Ownership

**Each page component owns its own layout.**

A page component is responsible for structuring its own content: the main container, spacing, title placement, grid layout, and the composition of its child components. This is **not** delegated to a parent shell or router.

```tsx
// ✅ Page owns its layout — it decides the grid, the title, and the composition
const Home = () => (
  <>
    <Grid as={Title} title="My Game Collection" colSpan={{ ... }} />
    <GameList />
  </>
);
```

The parent (`AppShell`) provides the **structural chrome**: the skip link, the `<header>` slot, and the `<main>` content area (via `<Grid as="main" container>`). Pages receive their slot from `AppShell` via `<Outlet />` and fill it autonomously — they do not re-declare the `<main>` landmark.

This aligns with the Clean Architecture principle of clear boundaries: the UI shell knows _where_ to render a page, but the page knows _how_ to render itself.

### 2. Folder Pattern as Direct Consequence

Since pages are autonomous layout-owning components — not thin wrappers — they are first-class components and **must follow the same folder convention** as every other component in the project:

```
src/collection/ui/pages/
├── AddGame/
│   └── AddGame.tsx
├── EditGame/
│   └── EditGame.tsx
├── GameDetail/
│   ├── GameDetail.tsx
│   └── GameDetail.module.css
└── Home/
    └── Home.tsx
```

**Rules:**

- One folder per page, named after the component (PascalCase)
- Main file: `<Name>/<Name>.tsx`
- Scoped stylesheets, sub-components, and page-specific hooks live in the same folder
- **No `index.ts` barrel file** (consistent with all other components in the project)

Imports reference the full path, not a barrel:

```typescript
// ✅
import { homeRoutes } from '@Collection/ui/pages/Home/Home';

// ❌ No barrel
import { homeRoutes } from '@Collection/ui/pages/Home';
```

## Consequences

**Positive:**

- ✅ Pages are unambiguously first-class components — no special-casing in naming or organization
- ✅ Each page folder is a self-contained unit: component, styles, sub-components, and tests can co-locate
- ✅ Consistent mental model: the rule "components live in `<Name>/<Name>.tsx`" applies universally, with no exceptions for pages
- ✅ Enables future page-specific sub-components (e.g., `Home/HomeEmptyState.tsx`) without polluting the shared `components/` directory
- ✅ Eliminates the open backlog item `adr-011-page-layout-ownership` — both questions are now resolved

**Negative / Trade-offs:**

- ⚠️ Requires refactoring 4 existing page files — tracked as `pages-folder-pattern-fix` in Sprint 4
- ⚠️ Import paths in `src/app/routing/routes.tsx` must be updated to include the subfolder (`/Home/Home`, `/AddGame/AddGame`, etc.)
- ⚠️ Test files in `tests/unit/collection/ui/pages/` must be moved to match the new structure

## Alternatives Considered

### Shell/Router Owns the Layout

Rejected. If the shell controlled all layout, pages would become thin content containers with no structural responsibility. This conflicts with the Clean Architecture goal of self-contained bounded contexts: a page should be fully understandable and renderable in isolation.

### Keep Pages as Flat Files (Special Case)

Rejected. Treating pages as a special case creates an implicit exception that developers must remember. It also prevents natural growth: a page that needs a CSS module (e.g., `GameDetail`) already has to manage two files with no clear home for them.

### Use `index.ts` Barrels

Rejected. The project convention (established across all existing components: `GameCard`, `GameForm`, `GameList`, etc.) is explicitly **no barrel files**. Barrel files add an indirection layer that provides no value in this codebase and complicates tree-shaking analysis.

## References

- [react.instructions.md](../../../../.github/instructions/react.instructions.md) — Component naming and folder convention
- [UI Layer](../../layers/ui-layer.md) — Component organization in the UI layer
- [routes.tsx](../../../../src/app/routing/routes.tsx) — Page import paths (to be updated by `pages-folder-pattern-fix`)
