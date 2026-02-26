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

Use cases are resolved from the InversifyJS container via the `useService` hook:

```typescript
const addGameUseCase = useService<AddGameUseCaseInterface>(COLLECTION_SERVICES.AddGameUseCase);
```

The hook reads from `ServiceContext`, which is provided by `<ServiceProvider>`. This must wrap the component tree (done at app level).

**Rules:**

- ✅ Always use `useService` to resolve application services — never import the container directly
- ❌ Never instantiate use cases manually in components
- ❌ Never import domain entities or value objects for anything other than validation

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

| Test type   | Location                                        | Tool                     |
| ----------- | ----------------------------------------------- | ------------------------ |
| Unit (base) | `tests/unit/shared/ui/components/`              | Vitest + Testing Library |
| Integration | `tests/unit/collection/ui/components/GameForm/` | Vitest + Testing Library |
| Component   | `tests/unit/collection/ui/components/GameList/` | Vitest + Testing Library |
| E2E         | `tests/e2e/add-game.test.ts`                    | Playwright               |

**Key testing notes:**

- Use `renderSuspense` (not `render`) for any component that uses `HelperText` or `Alert` from shelter-ui
- `getByRole('radiogroup', { name: … })` for RadioGroup (not `group`)
- Add `server.deps.inline: ['@pplancq/shelter-ui-react']` in `vitest.config.mts` for SVG support

---

## References

- [Domain Layer](./domain-layer.md) — Value Objects and business rules
- [AddGame Use Case](../use-cases/add-game.md) — Use case orchestration
- [Dependency Injection](../architecture/dependency-injection.md) — InversifyJS setup
- [Result Pattern](../result-pattern.md) — Error handling in use cases
