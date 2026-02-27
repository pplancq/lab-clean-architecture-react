# UI Layer

## What is the UI Layer?

The **UI Layer** is the outermost layer in Clean Architecture. It is responsible for rendering the interface and handling user interactions. It delegates all business logic to the application and domain layers.

> **Core Principle:** The UI Layer must contain **zero business logic**. Validation rules live in the domain (Value Objects), and orchestration lives in use cases.

---

## Structure

```
src/collection/ui/
├── components/
│   ├── GameForm/
│   │   └── GameForm.tsx        # Form component (uses formField wrappers)
│   ├── GameList/
│   │   └── GameList.tsx        # Game list with loading/empty/error states (aria-live)
│   └── GameCard/
│       └── GameCard.tsx        # Single game card with link to detail page
├── hooks/
│   ├── useGamesSelector/
│   │   └── useGamesSelector.ts # Granular state subscription via useSyncExternalStore
│   └── useGamesStore/
│       └── useGamesStore.ts    # Thin DI accessor — returns GamesStore for actions
└── pages/
    ├── AddGame.tsx             # Page component (thin wrapper around GameForm)
    └── Home.tsx                # Home page displaying the game collection via GameList

src/shared/ui/
├── components/
│   ├── TextAreaField/          # Base textarea (mirrors shelter-ui API)
│   ├── SelectField/            # Base select (mirrors shelter-ui API)
│   └── formField/              # RHF wrapper layer
│       ├── FormInputField/
│       ├── FormSelectField/
│       ├── FormTextAreaField/
│       └── FormRadioGroup/
├── hooks/
│   └── useService/             # DI hook — resolves services from InversifyJS container
└── providers/
    └── ServiceProvider/        # Makes the DI container available via context
```

---

## Design System: `@pplancq/shelter-ui-react`

The project uses `@pplancq/shelter-ui-react` (currently in alpha) as its design system library.

### Available Components

- `InputField` — text input with Label, HelperText, error state
- `RadioGroup` / `RadioOption` — radio group with accessible label injection
- `Button` — primary/secondary actions
- `Alert` — success/error/info notifications
- `Grid` — responsive grid layout (container + items with `colSpan` breakpoints)
- `Typography` — text rendering with `variant`, `size`, `color` props
- `Title` — page/section heading component

### Components Created in `shared/ui/`

Some components are not yet available in the library and were created locally:

| Component       | Location                                  | Notes                                        |
| --------------- | ----------------------------------------- | -------------------------------------------- |
| `TextAreaField` | `src/shared/ui/components/TextAreaField/` | Mirrors `InputField` API, floating label CSS |
| `SelectField`   | `src/shared/ui/components/SelectField/`   | Mirrors `InputField` API, `hasValue` state   |

These components will be contributed to `@pplancq/shelter-ui-react` once stable.

### Key Quirks

- All error messages use `aria-errormessage` (not `aria-describedby`) — tests must use `toHaveAccessibleErrorMessage()`
- `RadioGroup` auto-injects `name`, `required`, `isInvalid` into children via `cloneElement` — do not pass `name` twice
- Components using `HelperText` or `Alert` load SVG icons asynchronously — use `renderSuspense` in tests

---

## The `formField` Wrapper Layer

The `formField/` folder contains thin wrapper components that couple base UI components with **React Hook Form (RHF)**.

### Why a Separate Wrapper Layer?

| Concern                    | Handled by                                      |
| -------------------------- | ----------------------------------------------- |
| Visual rendering           | Base component (`InputField`, `SelectField`, …) |
| RHF integration            | `formField/` wrapper                            |
| Validation rules           | Domain Value Objects in `validate`              |
| Submission / orchestration | Use Case (`AddGameUseCase`)                     |

This keeps base components **reusable outside of RHF** forms (e.g., for read-only display, Storybook).

### How Wrappers Work

Each wrapper:

1. Calls `useFormContext()` to access the parent `<FormProvider>` state
2. Calls `register(name, rules)` to bind the field
3. Reads `formState.errors[name]` to pass the error message
4. Forwards all other props to the base component

```typescript
// FormInputField.tsx — minimal example
export const FormInputField = ({ name, rules, id, ...props }: FormInputFieldProps) => {
  const { register, formState: { errors } } = useFormContext();
  return (
    <InputField
      {...props}
      {...register(name, rules)}
      id={id ?? name}
      errorMessage={errors[name]?.message as string}
    />
  );
};
```

### `FormRadioGroup` — Special Case

`FormRadioGroup` uses `Children.map` + `cloneElement` to inject `register` props into each `RadioOption` child, because `RadioGroup` manages its children itself.

### Unit Tests for Wrappers

Wrappers have **no dedicated unit tests**. They contain no logic of their own — their behavior is fully covered by `GameForm.test.tsx` (integration level).

---

## Validation Pattern: Value Objects + RHF

Domain Value Objects are used as the **single source of truth** for validation rules. They are passed directly into RHF's `validate` option.

```typescript
<FormInputField
  name="title"
  label="Game title"
  required
  rules={{
    validate: value => {
      const result = GameTitle.create(value);
      return result.isOk() || result.getError().message;
    },
  }}
/>
```

**Benefits:**

- No duplication of validation rules between UI and domain
- Error messages are exactly those defined in the domain
- UI validation and domain validation are always in sync

**Validation messages to know:**

| Field      | Empty message                  |
| ---------- | ------------------------------ |
| `title`    | `'Game title cannot be empty'` |
| `platform` | `'Platform name is required'`  |
| `format`   | `'Format name is required'`    |

---

## Dependency Injection in the UI

Use cases and stores are resolved from the InversifyJS container via the `useService` hook:

```typescript
// Resolving a use case
const addGameUseCase = useService<AddGameUseCaseInterface>(COLLECTION_SERVICES.AddGameUseCase);

// Resolving a store for actions
const store = useService<GamesStoreInterface>(COLLECTION_SERVICES.GamesStore);
```

The hook reads from `ServiceContext`, which is provided by `<ServiceProvider>`. This must wrap the component tree (done at app level).

**Rules:**

- ✅ Always use `useService` to resolve application services — never import the container directly
- ❌ Never instantiate use cases or stores manually in components
- ❌ Never import domain entities or value objects for anything other than validation

---

## Observable Store Pattern (`useSyncExternalStore`)

For reading state from an **Observable Store** (e.g., `GamesStore`), use `useGamesSelector` instead of calling `useService` directly.

### Why `useSyncExternalStore`?

`useSyncExternalStore` is the React API designed for external stores. It is the same pattern used internally by React Query and Zustand. It avoids "tearing" in concurrent mode and keeps store state outside the component lifecycle.

### Two hooks, two responsibilities

| Hook                       | Role                               | When to use                                                     |
| -------------------------- | ---------------------------------- | --------------------------------------------------------------- |
| `useGamesStore()`          | Returns the store instance         | Calling **actions** (`fetchGames`, future `addGame`, …)         |
| `useGamesSelector(s => …)` | Subscribes to a **slice** of state | Reading state — only re-renders when the selected slice changes |

### Usage in a component

```typescript
export const GameList = () => {
  const store = useGamesStore();  // store instance for actions
  const { games, error, isLoading } = useGamesSelector(s => s.getGamesList());

  useLayoutEffect(() => {
    store.fetchGames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  // store instance is stable (DI singleton) — empty deps is intentional
```

`useLayoutEffect` with an empty dependency array is intentional: the store is a stable DI singleton, and the fetch must start before the first paint to avoid a flash of empty state.

### Granular subscriptions

`useGamesSelector` accepts any selector. A component re-renders **only** when the selected value changes (via `Object.is`):

```typescript
// Re-renders only when isLoading changes (boolean)
const isLoading = useGamesSelector(s => s.getGamesList().isLoading);

// Re-renders only when the games array reference changes
const games = useGamesSelector(s => s.getGamesList().games);

// Re-renders when any of the 3 values change (current GameList usage)
const { games, error, isLoading } = useGamesSelector(s => s.getGamesList());
```

> **Stable references:** `GamesStore.commit(gamesChanged)` only rebuilds the `games` array when the Map actually changed. A loading-state commit preserves the existing array reference, so `useGamesSelector(s => s.getGamesList().games)` skips the re-render.

### Selector ref pattern

The selector is tracked via `useRef` inside `useGamesSelector` so that the `getSnapshot` function stays stable across renders (React concurrent mode safe):

```typescript
export const useGamesSelector = <T>(selector: (store: GamesStoreInterface) => T): T => {
  const store = useService<GamesStoreInterface>(COLLECTION_SERVICES.GamesStore);
  const selectorRef = useRef(selector);
  selectorRef.current = selector;
  return useSyncExternalStore(
    useCallback(cb => store.subscribe(cb), [store]),
    useCallback(() => selectorRef.current(store), [store]),
  );
};
```

---

## Page Components

Pages are thin wrappers that compose UI components and expose them on a route.

```typescript
// src/collection/ui/pages/AddGame.tsx
const AddGame = () => <GameForm />;

export const addGameRoutes: RouteObject = {
  path: 'add-game',
  element: <AddGame />,
};
```

Routes are registered in `src/app/routing/routes.tsx`:

```typescript
export const routeObject: RouteObject[] = [
  {
    path: '/',
    children: [homeRoutes, addGameRoutes],
  },
];
```

> **Open question:** As the application grows, a shared layout (header, navigation, page container) will be needed. This belongs to either `src/app/` (as a root `<Outlet>` layout) or `src/shared/ui/layouts/`. See [Architecture Overview](../architecture/README.md) for context.

---

## Accessibility

All UI components follow **WCAG 2.2 Level AA** and **RGAA 4** guidelines:

- Native HTML attributes preferred over ARIA (`required` instead of `aria-required`)
- `aria-errormessage` for validation errors, `aria-describedby` for helper text
- All form fields have explicit `<label>` associations via `htmlFor`
- `<form>` has `aria-label` for screen reader context
- `noValidate` on forms to disable native browser validation (RHF handles it)

---

## Testing

| Test type   | Location                                           | Tool                     |
| ----------- | -------------------------------------------------- | ------------------------ |
| Unit (base) | `tests/unit/shared/ui/components/`                 | Vitest + Testing Library |
| Integration | `tests/unit/collection/ui/components/GameForm/`    | Vitest + Testing Library |
| Component   | `tests/unit/collection/ui/components/GameList/`    | Vitest + Testing Library |
| Hook        | `tests/unit/collection/ui/hooks/useGamesSelector/` | Vitest + `renderHook`    |
| E2E         | `tests/e2e/add-game.test.ts`                       | Playwright               |

**Key testing notes:**

- Use `renderSuspense` (not `render`) for any component that uses `HelperText` or `Alert` from shelter-ui
- `getByRole('radiogroup', { name: … })` for RadioGroup (not `group`)
- Add `server.deps.inline: ['@pplancq/shelter-ui-react']` in `vitest.config.mts` for SVG support
- Hook tests with `useSyncExternalStore`: use `renderHook` to avoid the `react/no-multi-comp` ESLint rule (no second component in test files)
- `useGamesSelector.test.tsx`: use `<T,>` trailing comma in TSX generics to disambiguate from JSX tags

---

## References

- [Domain Layer](./domain-layer.md) — Value Objects and business rules
- [AddGame Use Case](../use-cases/add-game.md) — Use case orchestration
- [Dependency Injection](../architecture/dependency-injection.md) — InversifyJS setup
- [Result Pattern](../result-pattern.md) — Error handling in use cases
