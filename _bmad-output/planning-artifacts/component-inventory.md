---
date: 2026-02-25
author: Sally (UX Designer)
source: wireframe-2026-02-24.excalidraw (v4 — 969 elements)
status: draft
breakpoints:
  mobile: 375px
  tablet: 768px
  desktop: 1280px
---

# UI Component Inventory — lab-clean-architecture-react

> Source of truth mapping wireframe components → React component tree → existing stories.
> Use this document when generating dev stories to ensure no component is forgotten.

---

## Atomic Design — What does it mean in this project?

We use [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/) to organise components by complexity:

| Level | Definition | Examples in this app |
|-------|------------|---------------------|
| **Atom** | Smallest indivisible UI element. No sub-components. | A badge ("PS5"), a cover image, a search input |
| **Molecule** | A small group of atoms working together as a unit | A game card (cover + title + badges + chevron) |
| **Organism** | A complex UI section composed of molecules | The collection list area: FilterBar + grid of GameCards + StatsSidebar |
| **Page** | A full route view assembled from organisms | `/collection` — the CollectionListPage |

---

## Atomic Design Hierarchy (Overview)

```
Pages
  └── DashboardPage
  └── CollectionListPage
  └── GameDetailPage
  └── AddGamePage / EditGamePage
  └── WishlistPage

Organisms
  └── AppShell                (TopBar + page outlet)
  └── CollectionGrid          (FilterBar + grid of GameCards)
  └── WishlistGrid            (FilterBar + grid of WishlistCards)
  └── DashboardWidgets        (3 × WidgetCard)
  └── GameDetailView          (cover + info panel + notes)
  └── GameForm                (add/edit fields)

Molecules
  └── TopBar                  (Logo + Nav / Search / Burger)
  └── BurgerMenuDrawer        (overlay nav on mobile/tablet)
  └── Breadcrumb              (trail on sub-pages)
  └── FilterBar               (FilterChips row + SortSelect)
  └── GameCard                (collection variant)
  └── WishlistCard            (wishlist variant)
  └── WidgetCard              (dashboard panel)
  └── StatsSidebar            (desktop stats panel)
  └── BadgeRow                (horizontal Badge row)

Atoms
  └── Badge                   (Platform / Status / Format / Priority)
  └── FilterChip              (active/inactive toggle)
  └── FormatToggle            (Physical/Digital — button-styled radio group)  ← NEW
  └── GameCover               (image + placeholder)
  └── StatRow                 (label + value)
  └── SearchInput             (text input in TopBar)
  └── SortSelect              (dropdown control)
  └── FAB                     (floating "+" button — mobile list pages)

```

---

## Component Placement Rules

| Scenario | Location |
|----------|----------|
| UI component with **no domain logic**, reusable across any context | `src/shared/ui/components/` |
| UI component **specific to one bounded context** (collection, wishlist…) not intended for reuse elsewhere | `src/<context>/ui/components/` (e.g., `src/collection/ui/components/`) |
| Shared component that is a **shelter-ui candidate** | Build in `src/shared/ui/` first, then migrate via an Epic 7 Task Story |

> **Rule of thumb:** if you can imagine using this component in another context (wishlist, settings, future features) → `shared/`. If it's only meaningful inside one context and has no reason to exist outside it → `<context>/`.

---

## Component Details

### ATOMS

---

#### `Badge`

A small visual "tag" or "chip" used to convey categorical information at a glance (platform, ownership format, priority).

**Key design spec — Adaptive sizing:**  
The badge adapts to the available space in its parent container:
- **Enough space** → icon/logo + label text (e.g., 🎮 PS5)
- **Tight space** → icon/logo only (no label text)

This avoids truncation and keeps the UI clean in compact layouts like `GameCard`.

```
Full badge:          Compact badge (tight container):
┌──────────┐         ┌────┐
│ 🎮  PS5  │    →    │ 🎮 │
└──────────┘         └────┘
```

**Variants:**

| Variant | Examples | Icon/Logo |
|---------|---------|-----------|
| `platform` | PS5, PS4, PC, Xbox, Nintendo | Platform logo (PS, Xbox, Steam, Nintendo…) |
| `status` | Physical, Digital | Disc icon / Cloud-download icon |
| `priority` | High, Medium, Low | Coloured dot or chevron icon |

> ⚠️ Must not use colour alone to convey meaning (a11y WCAG 1.4.1) — icon + colour required.

| Property | Value |
|----------|-------|
| **Level** | Atom |
| **Variants** | `platform`, `status`, `priority` |
| **Screens** | GameCard, WishlistCard, GameDetailView |
| **Breakpoints** | All — sizing driven by **parent container width**, not viewport breakpoint |
| **Shelter-UI** | 🚀 **Epic 7 candidate** — build in `src/shared/ui/` first, then migrate |
| **Stories** | 2.4, 2.5, 2.6, 5.4, 5.5, 5.7 |
| **Notes** | Use CSS container queries (`@container`) for adaptive icon-only vs icon+label. |

---

#### `FilterChip`
| Property | Value |
|----------|-------|
| **Level** | Atom |
| **Variants** | `active` / `inactive`, `platform`, `priority` |
| **Screens** | CollectionListPage, WishlistPage |
| **Breakpoints** | All (horizontal scroll on mobile) |
| **Shelter-UI** | Possibly extends `<Chip>` with toggle behavior |
| **Stories** | 3.3, 3.4, 3.6, 5.6 |
| **Notes** | Keyboard-operable toggle. ARIA `pressed` state required. |

---

#### `GameCover`
| Property | Value |
|----------|-------|
| **Level** | Atom |
| **Variants** | Collection size (52×80px), Wishlist size (52×52px), Detail size (full width) |
| **Screens** | GameCard, WishlistCard, GameDetailView |
| **Breakpoints** | All |
| **Shelter-UI** | Custom — uses `<img>` + placeholder SVG fallback |
| **Stories** | 2.5, 4.4, 5.5 |
| **Notes** | `alt` text required (a11y). `loading="lazy"` for list. Offline cache via SW. |

---

#### `StatRow`
| Property | Value |
|----------|-------|
| **Level** | Atom |
| **Variants** | Label + numeric value, optional sub-label |
| **Screens** | Used inside `StatsSidebar` — appears wherever `StatsSidebar` is rendered |
| **Breakpoints** | None — visibility is controlled by the **parent** (`StatsSidebar` hides on mobile/tablet) |
| **Shelter-UI** | Custom |
| **Stories** | 2.5 (sub-task), 5.5 (sub-task) |
| **Notes** | Purely presentational. No business logic. `StatsSidebar` handles all layout decisions. |

---

#### `SearchInput`
| Property | Value |
|----------|-------|
| **Level** | Atom |
| **Variants** | Default, focused, with-value |
| **Screens** | TopBar (all pages) |
| **Breakpoints** | All (collapses on mobile into icon → expand on tap?) |
| **Shelter-UI** | Likely wraps `<Input>` from shelter-ui |
| **Stories** | 3.1, 3.2 |
| **Notes** | Wireframe shows it always visible in TopBar. Debounced 300ms input. |

---

#### `SortSelect`
| Property | Value |
|----------|-------|
| **Level** | Atom |
| **Variants** | "Sort: Recent ▼", "Sort: Title ▼", "Sort: Platform ▼" |
| **Screens** | CollectionListPage, WishlistPage |
| **Breakpoints** | All |
| **Shelter-UI** | Likely wraps `<Select>` |
| **Stories** | 3.5, 3.6 |
| **Notes** | Appears right-aligned in FilterBar. |

---

#### `FAB` *(Floating Action Button)*

The FAB is the **circular "+" button that floats in the bottom-right corner on mobile**. It is a common mobile UI pattern (popularised by Google Material Design) that gives users a quick shortcut to the primary action of a page, without taking up layout space.

```
Mobile CollectionListPage:
┌────────────────────────┐
│  [Game 1]              │
│  [Game 2]              │
│  [Game 3]              │
│                    [+] │  ← FAB (position: fixed, bottom-right)
└────────────────────────┘
```

Clicking the FAB navigates to `/collection/add` (AddGamePage) or opens the AddToWishlist modal.

| Property | Value |
|----------|-------|
| **Level** | Atom |
| **Screens** | CollectionListPage (bottom-right), WishlistPage (bottom-right) |
| **Breakpoints** | **Mobile only** — replaced by standard button / inline CTA on tablet+ |
| **Shelter-UI** | Custom (or shelter-ui `<Button>` with `shape="circle"` variant) |
| **Stories** | 2.4 (triggers AddGamePage), 5.4 (triggers AddToWishlist) |
| **Notes** | `+` icon with `aria-label="Add game"`. `position: fixed`. Hidden on tablet+. |

---

#### `FormatToggle` *(button-styled radio group)*

The FormatToggle is a **radio input that looks like a group of buttons** rather than standard radio circles. It lets the user choose between "Physical" and "Digital" by clicking a button-shaped option — the selected one appears highlighted/active.

Each option has an **icon/logo** to differentiate the formats at a glance:

```
Standard radio:           FormatToggle (our component):
○ Physical                 [ 💿  Physical ] [ ☁  Digital ]
○ Digital                     ▔▔▔▔▔▔▔▔▔▔▔    (active = filled/highlighted)
```

| Format | Icon | Meaning |
|--------|------|---------|
| Physical | 💿 disc icon | Game owned as a physical disc/cartridge |
| Digital | ☁ cloud-download icon | Game owned as a digital download |

This is sometimes called a **segmented control** or **button group radio**. It is used in the GameForm.

| Property | Value |
|----------|-------|
| **Level** | Atom |
| **Options** | Physical (disc icon) / Digital (cloud icon) |
| **Screens** | AddGamePage, EditGamePage (inside GameForm) |
| **Breakpoints** | All |
| **Shelter-UI** | 🚀 **Epic 7 candidate** — build in `src/shared/ui/` first, then migrate |
| **Stories** | 2.4 (GameForm), 2.7 (EditGame) — ⚠️ **retroactive catch-up needed** |
| **Notes** | Must use `role="radiogroup"` + `role="radio"` + `aria-checked` (a11y). Currently missing from codebase. |

---


### MOLECULES

---

#### `TopBar`
| Property | Value |
|----------|-------|
| **Level** | Molecule |
| **Sub-components** | Logo, NavLinks (desktop), SearchInput, BurgerButton (mobile/tablet) |
| **Layout** | Logo + NavLinks LEFT · SearchInput + BurgerButton FAR RIGHT |
| **Screens** | All pages |
| **Breakpoints** | Mobile: Logo + Burger + Search · Tablet: Logo + Burger + Search · Desktop: Logo + Nav + Search |
| **Shelter-UI** | Custom — likely uses shelter-ui `<AppBar>` or `<Header>` |
| **Stories** | ⚠️ **GAP** — no dedicated story (see §Gaps) |
| **Notes** | Sticky positioning. Desktop has no burger. |

---

#### `BurgerMenuDrawer`
| Property | Value |
|----------|-------|
| **Level** | Molecule |
| **Sub-components** | BurgerButton (toggle), Drawer overlay, NavLinks list |
| **Screens** | All pages |
| **Breakpoints** | Mobile + Tablet only |
| **Shelter-UI** | Possibly shelter-ui `<Drawer>` or custom |
| **Stories** | ⚠️ **GAP** — bundled with TopBar gap |
| **Notes** | Focus trap required when open (a11y). Escape key closes. |

---

#### `Breadcrumb`
| Property | Value |
|----------|-------|
| **Level** | Molecule |
| **Variants** | 1 level: "Collection", 2 levels: "Collection > Game Name" |
| **Screens** | CollectionListPage, GameDetailPage, WishlistPage (sub-pages only) |
| **Breakpoints** | All (always visible on sub-pages) |
| **Shelter-UI** | Likely shelter-ui `<Breadcrumb>` — verify |
| **Stories** | ⚠️ **GAP** — no dedicated story |
| **Notes** | `<nav aria-label="breadcrumb">` + `aria-current="page"` required. |

---

#### `FilterBar`
| Property | Value |
|----------|-------|
| **Level** | Molecule |
| **Sub-components** | FilterChip (×N), SortSelect |
| **Screens** | CollectionListPage, WishlistPage |
| **Breakpoints** | All (chips scroll horizontally on mobile) |
| **Shelter-UI** | Custom layout |
| **Stories** | 3.3, 3.4, 3.5, 3.6 |
| **Notes** | SortSelect aligns right. Chips on the left. |

---

#### `GameCard` *(Collection variant)*
| Property | Value |
|----------|-------|
| **Level** | Molecule |
| **Sub-components** | GameCover (52×80px), title text, BadgeRow (Platform + Status), chevron icon |
| **Dimensions** | 100px tall |
| **Screens** | CollectionListPage |
| **Breakpoints** | All (1 col mobile, 1 col tablet, 2 col desktop) |
| **Shelter-UI** | Custom — based on shelter-ui `<Card>` |
| **Stories** | 2.5, 2.6 |
| **Notes** | Entire card is clickable → GameDetailPage. |

---

#### `WishlistCard`
| Property | Value |
|----------|-------|
| **Level** | Molecule |
| **Sub-components** | GameCover (52×52px), title text, Priority badge, "Move to Collection" button |
| **Dimensions** | 76px tall, purple tint bg (#faf8ff) |
| **Screens** | WishlistPage |
| **Breakpoints** | All (1 col mobile, 1 col tablet, 2 col desktop) |
| **Shelter-UI** | Custom — based on shelter-ui `<Card>` |
| **Stories** | 5.5, 5.9 |
| **Notes** | Visually distinct from GameCard to differentiate pages. |

---

#### `WidgetCard`
| Property | Value |
|----------|-------|
| **Level** | Molecule |
| **Variants** | "Wishlist Preview", "Recently Added", "Collection Stats" |
| **Screens** | DashboardPage |
| **Breakpoints** | Mobile: stacked · Tablet: 2+1 · Desktop: 3 columns |
| **Shelter-UI** | Based on shelter-ui `<Card>` |
| **Stories** | ⚠️ **GAP** — no dedicated story for Dashboard (see §Gaps) |
| **Notes** | Each widget links to corresponding page. |

---

#### `StatsSidebar`
| Property | Value |
|----------|-------|
| **Level** | Molecule |
| **Sub-components** | Multiple StatRow groups: Total, By Status, By Platform, By Format (collection) / Total, By Priority (wishlist) |
| **Dimensions** | 200px wide |
| **Screens** | CollectionListPage (desktop), WishlistPage (desktop) |
| **Breakpoints** | **Desktop only** — hidden on mobile/tablet |
| **Shelter-UI** | Custom |
| **Stories** | 2.5 (sub-task), 5.5 (sub-task) |
| **Notes** | Left sidebar. Content area shrinks accordingly. |

---

#### `BadgeRow`

The BadgeRow is **a simple flex container that displays multiple Badge components side by side** (horizontally). It exists because most places in the app show 2-3 badges together and we want consistent spacing and wrapping behaviour everywhere.

```
GameCard example:
┌─────────────────────────────┐
│ [cover] Game Title          │
│         [PS5] [Physical]  › │   ← this horizontal pair = BadgeRow
└─────────────────────────────┘
```

| Property | Value |
|----------|-------|
| **Level** | Molecule |
| **Sub-components** | 2–3× Badge components |
| **Screens** | GameCard, GameDetailView |
| **Breakpoints** | All |
| **Shelter-UI** | Custom flex wrapper |
| **Stories** | 2.5, 2.6 |
| **Notes** | Horizontal layout. Wraps on overflow. No additional logic. |

---

### ORGANISMS

> Organisms are **complex, self-contained UI sections** that combine several molecules to form a recognisable chunk of the interface. They handle their own internal layout and can be dropped into any page.  
> A good rule of thumb: if you can describe it as "the X area of the page", it is probably an organism.

---

#### `AppShell`
| Property | Value |
|----------|-------|
| **Level** | Organism |
| **Sub-components** | TopBar, `<main>` outlet, optional BurgerMenuDrawer |
| **Screens** | All pages (wrapper) |
| **Breakpoints** | All |
| **Shelter-UI** | Custom layout |
| **Stories** | ⚠️ **GAP** — no dedicated story |
| **Notes** | Handles sticky TopBar + skip-nav link (a11y). React Router outlet inside `<main>`. |

---

#### `CollectionGrid`
| Property | Value |
|----------|-------|
| **Level** | Organism |
| **Sub-components** | FilterBar, grid of GameCards, StatsSidebar (desktop) |
| **Screens** | CollectionListPage |
| **Breakpoints** | Mobile: 1 col list · Tablet: 1 col list · Desktop: sidebar + 2 col grid |
| **Shelter-UI** | Custom grid |
| **Stories** | 2.5, 3.3, 3.4, 3.5, 3.6 |
| **Notes** | Empty state needed when collection = 0 games. |

---

#### `WishlistGrid`
| Property | Value |
|----------|-------|
| **Level** | Organism |
| **Sub-components** | FilterBar (priority chips), grid of WishlistCards, StatsSidebar (desktop) |
| **Screens** | WishlistPage |
| **Breakpoints** | Mobile: 1 col · Tablet: 1 col · Desktop: sidebar + 2 col grid |
| **Shelter-UI** | Custom grid |
| **Stories** | 5.5, 5.6, 5.7 |
| **Notes** | Empty state needed when wishlist = 0 items. |

---

#### `DashboardWidgets`
| Property | Value |
|----------|-------|
| **Level** | Organism |
| **Sub-components** | 3× WidgetCard (Wishlist preview, Recently Added, Collection Stats) |
| **Screens** | DashboardPage |
| **Breakpoints** | Mobile: stacked · Tablet: 2+1 layout · Desktop: 3-col |
| **Shelter-UI** | Custom grid |
| **Stories** | ⚠️ **GAP** — no dedicated story for Dashboard |
| **Notes** | Each widget is a summary — clicking navigates to full page. |

---

#### `GameDetailView`
| Property | Value |
|----------|-------|
| **Level** | Organism |
| **Sub-components** | GameCover (large), BadgeRow (Platform + Format), info fields (Status, Purchase date, Genre, Playtime), Description textarea, Notes textarea, Edit/Delete actions |
| **Screens** | GameDetailPage |
| **Breakpoints** | Mobile: stacked · Tablet/Desktop: 2-col (cover left, info right) |
| **Shelter-UI** | Custom layout |
| **Stories** | 2.6, 2.7, 2.8 |
| **Notes** | Notes field added on mobile (v4). Description field on tablet+. |

---

#### `GameForm`
| Property | Value |
|----------|-------|
| **Level** | Organism |
| **Fields** | Title (text, required), Platform (select), Format (radio: Physical/Digital), Status (select), Purchase Date (date), Description (textarea), Notes (textarea) |
| **Screens** | AddGamePage, EditGamePage |
| **Breakpoints** | All (single column mobile → centered card tablet/desktop) |
| **Shelter-UI** | Uses shelter-ui form components |
| **Stories** | 2.4, 2.7 |
| **Notes** | React Hook Form. Inline validation errors. Submit triggers AddGame / EditGame use case. |

---

### PAGES

---

#### `DashboardPage`
| Property | Value |
|----------|-------|
| **Level** | Page |
| **Route** | `/` |
| **Organisms** | AppShell + DashboardWidgets |
| **Stories** | ⚠️ **GAP** — no dedicated story |

---

#### `CollectionListPage`
| Property | Value |
|----------|-------|
| **Level** | Page |
| **Route** | `/collection` |
| **Organisms** | AppShell + Breadcrumb + CollectionGrid |
| **Stories** | 2.5, 3.3, 3.4, 3.5, 3.6 |

---

#### `GameDetailPage`
| Property | Value |
|----------|-------|
| **Level** | Page |
| **Route** | `/collection/:id` |
| **Organisms** | AppShell + Breadcrumb + GameDetailView |
| **Stories** | 2.6, 2.7, 2.8 |

---

#### `AddGamePage`
| Property | Value |
|----------|-------|
| **Level** | Page |
| **Route** | `/collection/add` |
| **Organisms** | AppShell + Breadcrumb + GameForm |
| **Stories** | 2.4 |

---

#### `WishlistPage`
| Property | Value |
|----------|-------|
| **Level** | Page |
| **Route** | `/wishlist` |
| **Organisms** | AppShell + Breadcrumb + WishlistGrid |
| **Stories** | 5.4, 5.5, 5.6, 5.7, 5.8, 5.9 |

---

## Summary Matrix

| Component | Level | Mobile | Tablet | Desktop | Priority | Epic 7 🚀 | Stories |
|-----------|-------|:------:|:------:|:-------:|----------|:---------:|---------|
| `Badge` | Atom | ✅ | ✅ | ✅ | P0 | ✅ | 2.4, 2.5, 2.6, 5.5 |
| `FilterChip` | Atom | ✅ | ✅ | ✅ | P1 | ✅ | 3.3, 3.4, 3.6 |
| `FormatToggle` | Atom | ✅ | ✅ | ✅ | P0 ⚠️ | ✅ | 2.4, 2.7 — **retroactive** |
| `MobileSubmitBar` | Atom | ✅ | — | — | ~~P0~~ — CSS only | — | CSS in `GameForm` — no component needed |
| `GameCover` | Atom | ✅ | ✅ | ✅ | P0 | — | 2.5, 4.4 |
| `StatRow` | Atom | ∗ | ∗ | ∗ | P2 | — | 2.5, 5.5 |
| `SearchInput` | Atom | ✅ | ✅ | ✅ | P1 | — | 3.1, 3.2 |
| `SortSelect` | Atom | ✅ | ✅ | ✅ | P1 | — | 3.5, 3.6 |
| `FAB` | Atom | ✅ | — | — | P1 | ✅ | 2.4, 5.4 |
| `TopBar` | Molecule | ✅ | ✅ | ✅ | P0 | — | ⚠️ GAP |
| `BurgerMenuDrawer` | Molecule | ✅ | ✅ | — | P0 | — | ⚠️ GAP |
| `Breadcrumb` | Molecule | ✅ | ✅ | ✅ | P1 | ⚠️ GAP |
| `FilterBar` | Molecule | ✅ | ✅ | ✅ | P1 | 3.3, 3.6 |
| `Breadcrumb` | Molecule | ✅ | ✅ | ✅ | P1 | — | ⚠️ GAP |
| `FilterBar` | Molecule | ✅ | ✅ | ✅ | P1 | — | 3.3, 3.6 |
| `GameCard` | Molecule | ✅ | ✅ | ✅ | P0 | — | 2.5, 2.6 |
| `WishlistCard` | Molecule | ✅ | ✅ | ✅ | P1 | — | 5.5, 5.9 |
| `WidgetCard` | Molecule | ✅ | ✅ | ✅ | P2 | — | ⚠️ GAP |
| `StatsSidebar` | Molecule | — | — | ✅ | P2 | — | 2.5, 5.5 |
| `BadgeRow` | Molecule | ✅ | ✅ | ✅ | P0 | — | 2.5, 2.6 |
| `AppShell` | Organism | ✅ | ✅ | ✅ | P0 | — | ⚠️ GAP |
| `CollectionGrid` | Organism | ✅ | ✅ | ✅ | P0 | — | 2.5, 3.6 |
| `WishlistGrid` | Organism | ✅ | ✅ | ✅ | P1 | — | 5.5, 5.7 |
| `DashboardWidgets` | Organism | ✅ | ✅ | ✅ | P2 | — | ⚠️ GAP |
| `GameDetailView` | Organism | ✅ | ✅ | ✅ | P0 | — | 2.6, 2.7 |
| `GameForm` | Organism | ✅ | ✅ | ✅ | P0 | — | 2.4, 2.7 |
| `DashboardPage` | Page | ✅ | ✅ | ✅ | P2 | — | ⚠️ GAP |
| `CollectionListPage` | Page | ✅ | ✅ | ✅ | P0 | — | 2.5, 3.6 |
| `GameDetailPage` | Page | ✅ | ✅ | ✅ | P0 | — | 2.6 |
| `AddGamePage` | Page | ✅ | ✅ | ✅ | P0 | — | 2.4 |
| `WishlistPage` | Page | ✅ | ✅ | ✅ | P1 | — | 5.5 |

> ∗ `StatRow` visibility is controlled by parent (`StatsSidebar`) — not a breakpoint concern of the atom itself.  
> 🚀 **Epic 7** = candidate for migration to shelter-ui toolkit after initial implementation in `src/shared/ui/`.

---

## ⚠️ Gaps & Retroactive Components

### Retroactive — Sprint 3 Catch-Up (components that should exist but don't yet)

| Component | Problem | Story |
|-----------|---------|-------|
| `FormatToggle` | GameForm uses standard radio — should be button-styled radio group | 9.0 |
| `MobileSubmitBar` | Submit button exists but is NOT sticky/fixed on mobile | ~~9.0~~ — CSS only in `GameForm` |

### GAP 1 — Application Shell & Navigation *(P0)*

**Missing:** `AppShell`, `TopBar`, `BurgerMenuDrawer` — every page depends on these.

### GAP 2 — Dashboard / Home Page *(P2)*

**Missing:** `DashboardPage`, `DashboardWidgets`, `WidgetCard` — the app entry point has no story.

### GAP 3 — Breadcrumb *(P1)*

**Missing:** `Breadcrumb` — sub-page navigation trail shown on wireframe on all sub-pages.

---

## 🆕 Epic 9: UI Component Library — Proposed Story Breakdown

> **Rationale:** Existing epics (2–5) each focus on a feature slice (domain → use case → UI). That approach works well but creates a risk: multiple feature stories independently build "their" version of the same visual component, leading to inconsistency. Epic 9 centralises the **shared UI layer** — each story = one component, with clear acceptance criteria, responsive behaviour, accessibility, and Storybook story.
>
> **Relation to other epics:** Epic 9 stories are often **prerequisites** or **parallel work** to feature stories. The sprint plan must sequence them appropriately.

---

### Sprint 3 — Retroactive Catch-Up

#### Story 9.0 — `FormatToggle` in GameForm *(P0 — retroactive)*

**Goal:** Replace the standard radio input in `GameForm` with a button-styled radio group for Physical / Digital format selection.

| Sub-task | Description |
|----------|-------------|
| `FormatToggle` | Button-styled radio group. Uses `role="radiogroup"` + `role="radio"` + `aria-checked` (a11y). Disc icon (Physical) / Cloud icon (Digital). |
| Mobile submit button | Make the GameForm submit button `position: fixed; bottom: 0` on mobile — **CSS only inside `GameForm`**, no new component. |

**Depends on:** Story 2.4 (GameForm exists)  
**Blocked by:** Nothing  
**Size:** XS

---

### P0 — Application Shell (needed before any page can be shown)

#### Story 9.1 — `AppShell` — Page Layout Wrapper *(P0)*

**Goal:** A layout component that wraps every page: renders `<TopBar>` at the top, a `<main>` area with correct margins (shelter-ui grid: 16px mobile, 32px tablet, 80px desktop), and a React Router `<Outlet>`.

Key points:
- Skip-nav link as first focusable element (a11y RGAA 12.7)
- `<header>`, `<main>`, `<footer>` landmarks
- Sticky header behaviour

**Depends on:** Story 9.2 (TopBar)  
**Size:** S

---

#### Story 9.2 — `TopBar` — Responsive Application Header *(P0)*

**Goal:** The top navigation bar, responsive across all 3 breakpoints.

| Breakpoint | Layout |
|------------|--------|
| Mobile | Logo (left) · BurgerButton + SearchInput (right) |
| Tablet | Logo (left) · BurgerButton + SearchInput (right) |
| Desktop | Logo + NavLinks (left) · SearchInput (right) · **no burger** |

- NavLinks: "Collection", "Wishlist" with active state
- Highlight active route

**Depends on:** Story 9.3 (BurgerMenuDrawer), `SearchInput` (9.8)  
**Size:** M

---

#### Story 9.3 — `BurgerMenuDrawer` — Mobile/Tablet Navigation Drawer *(P0)*

**Goal:** Burger button that opens a drawer overlay with navigation links.

- Focus trap when open (a11y WCAG 2.1.2)
- `Escape` key closes
- `aria-expanded` on burger button
- Overlay backdrop click closes

**Depends on:** Epic 1 (routing)  
**Size:** S

---

#### Story 9.4 — `GameCover` — Cover Image Atom *(P0)*

**Goal:** A cover image component with three size variants and a fallback placeholder.

| Variant | Size | Used in |
|---------|------|---------|
| `list` | 52×80px | GameCard |
| `thumbnail` | 52×52px | WishlistCard |
| `detail` | full-width | GameDetailView |

- `alt` text required (a11y)
- `loading="lazy"` for list variants
- SVG placeholder shown when no cover available

**Depends on:** Nothing  
**Size:** XS

---

#### Story 9.5 — `Badge` + `BadgeRow` — Tag Chips *(P0)*

**Goal:** Reusable badge/chip components for Platform, Status, Format, and Priority — with adaptive sizing and icons.

`Badge` variants:

| Variant | Examples | Icon | Colour |
|---------|---------|------|--------|
| `platform` | PS5, PS4, PC, Xbox, Nintendo | Platform logo (PS / Xbox / Steam / Nintendo) | Blue tones |
| `status` | Physical, Digital | 💿 disc / ☁ cloud icon | Green / Purple |
| `priority` | High, Medium, Low | Coloured dot or chevron | Red / Orange / Green |

**Adaptive sizing** — Badge reacts to its container width via CSS container queries (`@container`):

```
Parent has enough space:     Parent too narrow:
┌──────────┐                  ┌────┐
│ 🎮  PS5  │        →         │ 🎮 │
└──────────┘                  └────┘
  icon + label                icon only
```

`BadgeRow` = flex wrapper displaying 2–3 badges horizontally.

- Must not use colour alone (a11y WCAG 1.4.1) — icon + colour always used together
- `aria-label` on each badge for screen readers (e.g., `aria-label="Platform: PS5"`)
- 🚀 Epic 7 migration target after initial implementation

**Depends on:** Nothing  
**Size:** M *(upgraded from S due to adaptive sizing logic)*

---

#### Story 9.6 — `GameCard` — Collection List Card *(P0)*

**Goal:** The main card for the Collection List view.

```
┌──────────────────────────────────────────┐
│ [cover]  Game Title                      │
│ 52×80   [PS5] [Physical]               › │
└──────────────────────────────────────────┘
    ← 100px tall, full-width, clickable →
```

- Full card is a `<button>` or `<a>` → navigates to GameDetailPage
- `aria-label="View {title}"` for screen readers

**Depends on:** 9.4 (GameCover), 9.5 (Badge + BadgeRow)  
**Size:** S

---

### P1 — Navigation & Search (needed for Epic 3 + sub-pages)

#### Story 9.7 — `Breadcrumb` — Sub-Page Navigation Trail *(P1)*

**Goal:** `<nav aria-label="breadcrumb">` with schema-compatible structure, shown on all sub-pages.

- Pages: `/collection`, `/collection/:id`, `/wishlist`
- NOT shown on `/` (Dashboard)
- `aria-current="page"` on last item

**Depends on:** 9.1 (AppShell — placed below TopBar, above H1)  
**Size:** XS

---

#### Story 9.8 — `SearchInput` — TopBar Search Field *(P1)*

**Goal:** Debounced (300ms) text input used inside TopBar to search the collection.

- Clear button when value is set
- `aria-label="Search games"`
- Triggers search on `onChange`

**Depends on:** Epic 3 stories 3.1, 3.2 (use case + query hook)  
**Size:** XS

---

#### Story 9.9 — `FilterChip` — Toggle Filter Button *(P1)*

**Goal:** A clickable chip that toggles a filter on/off.

```
[All]  [PS5]  [Xbox]  [Physical]
        ▔▔▔ (active = filled)
```

- `role="checkbox"` or `aria-pressed` (a11y)
- Keyboard operable (Space to toggle)

**Depends on:** Nothing  
**Size:** XS

---

#### Story 9.10 — `SortSelect` — Sort Dropdown *(P1)*

**Goal:** A `<select>` dropdown for sort options in the FilterBar.

Options: "Sort: Recent ▼", "Sort: A–Z ▼", "Sort: Platform ▼"

**Depends on:** Shelter-ui `<Select>` component  
**Size:** XS

---

#### Story 9.11 — `FilterBar` — Combined Filter & Sort Row *(P1)*

**Goal:** The bar above a list that combines FilterChips (left) and SortSelect (right).

```
[All] [PS5] [Xbox] …           Sort: Recent ▼
```

- Horizontally scrollable on mobile
- Chips scroll; sort stays visible

**Depends on:** 9.9 (FilterChip), 9.10 (SortSelect)  
**Size:** S

---

#### Story 9.12 — `WishlistCard` — Wishlist List Card *(P1)*

**Goal:** A compact card for the Wishlist view — visually distinct from `GameCard`.

```
┌───────────────────────────────────────────┐
│ [cover] Game Title           [High]       │
│ 52×52   [Move to Collection]              │
└───────────────────────────────────────────┘
    ← 76px tall, purple-tinted background →
```

- Background: `#faf8ff` / border: `#e8e0f0`
- "Move to Collection" button triggers Story 5.9 use case

**Depends on:** 9.4 (GameCover), 9.5 (Badge)  
**Size:** S

---

#### Story 9.13 — `FAB` — Floating Add Button (Mobile) *(P1)*

**Goal:** A circular `position: fixed` button in the bottom-right corner of list pages on mobile.

- Visible only on mobile
- `aria-label="Add game"` / `aria-label="Add to wishlist"`
- Navigates to AddGamePage or opens AddToWishlist modal

**Depends on:** Nothing  
**Size:** XS

---

### P2 — Dashboard & Statistics

#### Story 9.14 — `StatRow` + `StatsSidebar` — Statistics Panel *(P2)*

**Goal:** Desktop-only sidebar showing collection/wishlist statistics.

`StatRow` = one line: label (e.g., "By Platform") + value (e.g., "12").  
`StatsSidebar` = groups of StatRows with section headers.

**Collection sidebar groups:** Total · By Status · By Platform · By Format  
**Wishlist sidebar groups:** Total · By Priority

- Hidden on mobile/tablet (`display: none` below `md`)

**Depends on:** Stories 2.5 (collection data), 5.5 (wishlist data)  
**Size:** S

---

#### Story 9.15 — `WidgetCard` — Dashboard Summary Widget *(P2)*

**Goal:** A card component for the Dashboard home page, showing a mini-summary of a section.

Three variants: "Wishlist Preview" (top 3 by priority) · "Recently Added" (last 3 games) · "Collection Stats" (counts)

Each variant links to its full page.

**Depends on:** 9.4 (GameCover), 9.5 (Badge)  
**Size:** S

---

#### Story 9.16 — `DashboardPage` — Home Page with Widgets *(P2)*

**Goal:** The `/` route home page assembling 3 WidgetCards.

```
Mobile: stacked (1 col)
Tablet: 2+1 layout
Desktop: 3-col equal grid
```

**Depends on:** 9.15 (WidgetCard), Stories 2.5 + 5.5 (data)  
**Size:** M

---

### Epic 9 Story Summary

| Story | Component | Priority | Size | Depends on | Sprint |
|-------|-----------|----------|------|------------|--------|
| 9.0 | FormatToggle (GameForm) | P0 ⚠️ | XS | 2.4 | Sprint 3 retroactive |
| 9.1 | AppShell | P0 | S | 9.2 | Sprint 3 |
| 9.2 | TopBar | P0 | M | 9.3, 9.8 | Sprint 3 |
| 9.3 | BurgerMenuDrawer | P0 | S | Epic 1 | Sprint 3 |
| 9.4 | GameCover | P0 | XS | — | Sprint 3 |
| 9.5 | Badge + BadgeRow | P0 | M | — | Sprint 3 |
| 9.6 | GameCard | P0 | S | 9.4, 9.5 | Sprint 3 |
| 9.7 | Breadcrumb | P1 | XS | 9.1 | Sprint 4 |
| 9.8 | SearchInput | P1 | XS | 3.1, 3.2 | Sprint 4 |
| 9.9 | FilterChip | P1 | XS | — | Sprint 4 |
| 9.10 | SortSelect | P1 | XS | — | Sprint 4 |
| 9.11 | FilterBar | P1 | S | 9.9, 9.10 | Sprint 4 |
| 9.12 | WishlistCard | P1 | S | 9.4, 9.5 | Sprint 4 |
| 9.13 | FAB | P1 | XS | — | Sprint 4 |
| 9.14 | StatRow + StatsSidebar | P2 | S | 2.5, 5.5 | Sprint 5 |
| 9.15 | WidgetCard | P2 | S | 9.4, 9.5 | Sprint 5 |
| 9.16 | DashboardPage | P2 | M | 9.15, 2.5, 5.5 | Sprint 5 |

**Total Epic 9:** 17 stories · ~8–10 days estimated

---

## Wireframe Reference

Wireframe file: `_bmad-output/excalidraw-diagrams/wireframe-2026-02-24.excalidraw`  
Open at [excalidraw.com](https://excalidraw.com) → File → Open

Screen layout in wireframe:
```
Row 1 (y=0):    [Mobile Dashboard]  [Tablet Dashboard]  [Desktop Dashboard]
Row 2 (y=940):  [Mobile Collection] [Tablet Collection] [Desktop Collection]
Row 3 (y=1880): [Mobile GameDetail] [Tablet GameDetail] [Desktop GameDetail]
Row 4 (y=2820): [Mobile AddGame]    [Tablet AddGame]    [Desktop AddGame]
Row 5 (y=3760): [Mobile Wishlist]   [Tablet Wishlist]   [Desktop Wishlist]
```
