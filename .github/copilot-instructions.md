# GitHub Copilot instructions for @pplancq/lab-clean-architecture-react

This file is intended to help Copilot-style assistants quickly and accurately contribute to this repository by describing the repository's run/test/lint commands, high-level architecture and repo-specific conventions.

---

## 1) Build, test and lint commands (how to run)

- Development server (Rsbuild):
  - npm run start
  - Mock environment: npm run start:mock
- Production build / preview:
  - npm run build
  - npm run preview
- Unit tests (Vitest):
  - Run full unit suite: npm run test:unit
  - Run a single test file or pattern: npm run test:unit -- <path-or-pattern>
    - Example: npm run test:unit -- src/components/MyComp.spec.ts
    - Example: npm run test:unit -- -t "should render correctly"
- Integration / E2E (Playwright):
  - Install browsers: npm run playwright:install
  - Run E2E: npm run test:e2e
  - Playwright tooling: npm run playwright:codegen, npm run playwright:show-report
  - Direct playwright invocation (available): npx playwright test <path>
- Convenience test scripts:
  - Full test runner wrapper: npm run test (node scripts/test.js)
- Linting and formatting:
  - Run all linters: npm run lint
  - ESLint: npm run lint:eslint
  - ESLint (auto-fix): npm run lint:eslint:fix
  - Stylelint: npm run lint:stylelint
  - Stylelint (fix): npm run lint:stylelint:fix
  - Prettier check: npm run lint:prettier
  - Prettier fix: npm run lint:prettier:fix
  - TypeScript typecheck (no emit): npm run lint:tsc
- Pre-commit hooks / repo maintenance:
  - prepare (husky): runs automatically on install
  - postinstall: msw init (sets up MSW worker in public directory)

Notes: many scripts are wrappers around project scripts in ./scripts/\*.js and rsbuild; prefer using npm scripts for consistent env.

---

## 2) High-level architecture (big picture)

- Purpose: this repository is a "lab" exploring Clean Architecture applied to a React frontend (Game Collection Manager).
- Layers and responsibilities (Clean Architecture):
  - Domain: entities and business rules (pure, no framework concerns).
  - Use Cases / Interactors: application-specific business logic orchestrating domain entities.
  - Infrastructure / Adapters: concrete implementations (IndexedDB adapters, API clients, persistence, network).
  - Presentation: React components, hooks, routing and UI; depends on abstractions from use cases.
- Key libraries and patterns:
  - React 19 + TypeScript (strict mode enabled - see tsconfig.json).
  - Rsbuild used as build/bundler tooling and PWA support.
  - TanStack Query for server/state synchronisation patterns.
  - InversifyJS (dependency inversion / DI) is used to wire adapters and use-cases.
  - IndexedDB used as primary offline store (idb wrapper planned/used).
  - Testing: Vitest + React Testing Library for unit/integration; Playwright for E2E; MSW for network mocking.
- Project documentation and decisions are stored under \_bmad-output/ and project-context.md (architecture decisions, epics, PRD).

---

## 3) Key repository conventions (repo-specific)

- TypeScript:
  - tsconfig.json sets "strict": true. Code must compile under strict mode.
  - Path aliases: @Front/_ -> src/_, @Mocks/_ -> mocks/_ (configured in tsconfig and vitest).
  - Include typings: vitest and testing-library types are declared in tsconfig.
- Tests:
  - Vitest config includes test file pattern: src/\*_/_.(spec|test|steps).[jt]s?(x).
  - vitest.setup.ts initializes MSW server from @Mocks/server and extends accessibility matchers (vitest-axe).
  - Use MSW for network mocks and ensure server.resetHandlers() after each test.
- Linting & formatting:
  - ESLint, Prettier and Stylelint are centrally configured via @pplancq/\* shareable configs (package.json devDeps).
  - Prettier config: project uses @pplancq/prettier-config; repo expects singleQuotes and trailingComma via that config.
- Scripts and wrappers:
  - Many repository routines are wrapped by scripts/\*.js (test, playright, lint); prefer npm run <script> rather than calling tools directly.
- Commit & branching conventions (from CONTRIBUTING.md):
  - Main branch: `main` (default branch for all development)
  - Conventional Commits are used for commit messages.
  - **IMPORTANT**: Follow commit message guidelines in `.github/git-commit-instructions.md` for all commits.
  - Branch names: feature/ and bugfix/ prefixes.
- CI / reporting:
  - Vitest is configured to emit junit and sonar reports when CI env is set.
- Postinstall behaviours:
  - msw init runs after install to create the Service Worker in public/ for local development.
- Local dev environment:
  - packageManager: npm@11.8.0 is specified in package.json (use the same major for consistency).

---

## 4) Helpful repo entrypoints for assistants (where to look first)

- README.md: project purpose, architecture summary and roadmap.
- project-context.md and \_bmad-output/: architecture decisions, epics and stories — essential context for feature work.
- rsbuild.config.ts and scripts/: build dev-servers and test wrappers.
- tsconfig.json & vitest.config.mts: compile/test settings (strict, path aliases, test patterns).
- src/ (prefixed alias @Front): main implementation; mocks/ contains MSW handlers and server.

---

## 5) Existing AI agent configs to consider

- .github/agents/ contains custom agent manifests used in repository workflows; review them if automating task assignment or running sub-agents.
- .github/git-commit-instructions.md contains commit message rules to follow (Conventional Commits format, scopes, body/footer format).
- CONTRIBUTING.md contains contribution and PR guidelines.

---

## 6) Short checklist for Copilot-like sessions

- Always prefer repo npm scripts (npm run ...) to run tasks.
- Run unit tests with the vitest script pattern shown above; use -- <path-or-pattern> to scope to a single test.
- Use MSW mocks when writing tests; ensure vitest.setup.ts expectations are preserved.
- Keep TypeScript changes compatible with strict mode and path aliasing.

---
