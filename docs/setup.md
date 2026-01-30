# Setup & Installation

## Project Initialization

This project was initialized using the [@pplancq/react-app](https://github.com/pplancq/react-app) template:

```bash
npm create @pplancq/react-app@latest lab-clean-architecture-react
```

## Prerequisites

- **[mise](https://mise.jdx.dev)**: Development environment manager (recommended)
  - The project uses `mise` to manage Node.js and npm versions
  - Install mise: [Installation Guide](https://mise.jdx.dev/getting-started.html)
  - Versions are automatically configured via `.mise.toml`
- **Node.js**: Latest LTS version (24.x or higher)
  - Automatically installed via `mise` or manually installed
- **npm**: 11.8.0 or higher (included with Node.js)
  - Automatically installed via `mise` or manually installed
- **Git**: For version control

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/pplancq/lab-clean-architecture-react.git
   cd lab-clean-architecture-react
   ```

2. **(Recommended)** If using `mise`, install Node.js and npm automatically:

   ```bash
   mise install
   ```

   The project uses `mise.toml` to define exact versions. This ensures all developers use the same environment.

3. Install dependencies:

   ```bash
   npm install
   ```

4. Initialize MSW (Mock Service Worker):
   ```bash
   npm run postinstall
   ```

## Available Scripts

### Development

- **`npm run start`** - Start development server (default mode)
  - Opens at `http://localhost:3000`
  - Hot Module Replacement (HMR) enabled
- **`npm run start:mock`** - Start development server with mock API
  - Uses MSW (Mock Service Worker)
  - Environment: `mock`

### Build

- **`npm run build`** - Build for production
  - Output: `build/` directory
  - Optimized and minified bundles
- **`npm run preview`** - Preview production build locally

### Testing

- **`npm run test`** - Run all tests (unit + E2E)
- **`npm run test:unit`** - Run unit tests (Vitest)
- **`npm run test:unit:watch`** - Run unit tests in watch mode
- **`npm run test:e2e`** - Run E2E tests (Playwright)
- **`npm run test:e2e:watch`** - Run E2E tests in watch mode
- **`npm run test:e2e:ui`** - Run E2E tests with Playwright UI

### Linting

- **`npm run lint`** - Run all linters (ESLint + Stylelint + Prettier + TypeScript)
- **`npm run lint:eslint`** - Run ESLint only
- **`npm run lint:eslint:fix`** - Run ESLint and auto-fix issues
- **`npm run lint:stylelint`** - Run Stylelint only
- **`npm run lint:stylelint:fix`** - Run Stylelint and auto-fix issues
- **`npm run lint:prettier`** - Check Prettier formatting
- **`npm run lint:prettier:fix`** - Auto-format with Prettier
- **`npm run lint:tsc`** - Run TypeScript compiler checks (no emit)

### Playwright

- **`npm run playwright:install`** - Install Playwright browsers
- **`npm run playwright:show-report`** - Show last Playwright test report
- **`npm run playwright:codegen`** - Generate Playwright tests interactively

### Utilities

- **`npm run package:check`** - Verify package-lock.json is up-to-date
- **`npm run prepare`** - Setup Git hooks (Husky)

## Environment Variables

Create `.env` file in project root:

```bash
# Development server port (default: 3000)
PORT=3000

# Open browser automatically on start (default: false)
BROWSER=false

# Disable ESLint plugin in Rsbuild (default: false)
DISABLE_ESLINT_PLUGIN=false

# Disable Stylelint plugin in Rsbuild (default: false)
DISABLE_STYLELINT_PLUGIN=false

# Disable source maps (default: false)
DISABLE_SOURCE_MAP=false

# Public URL for production deployment (default: /)
PUBLIC_URL=/

# Environment variable prefix (default: FRONT_)
ENV_PREFIX=FRONT_
```

### Mock Mode Variables

Create `.env.mock` for mock-specific configuration:

```bash
FRONT_MOCK_ENABLE=true
```

## Git Hooks

The project uses [Husky](https://typicode.github.io/husky/) for Git hooks:

- **pre-commit**: Runs `lint-staged` (ESLint, Stylelint, Prettier on staged files)
- **commit-msg**: Validates commit messages with [Commitlint](https://commitlint.js.org/)

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

body (optional)

footer (optional)
```

**Examples:**

```bash
git commit -m "feat: add game collection page"
git commit -m "fix(auth): resolve login timeout issue"
git commit -m "docs: update setup guide"
```

**Allowed types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks
- `perf` - Performance improvements
- `ci` - CI/CD changes

## Technology Stack

- **React**: 19.2.3
- **TypeScript**: 5.9.3
- **Build Tool**: Rsbuild 1.7.2
- **Testing**: Vitest 4.0.18 + Playwright 1.57.0
- **Linting**: ESLint 9.39.2 + Stylelint 17.0.0
- **Formatting**: Prettier 3.8.1
- **State Management**: TanStack Query 5.90.19
- **Routing**: React Router 7.12.0
- **Mocking**: MSW 2.12.7

## Browser Support

### Production

- `>0.2%`
- `not dead`
- `not op_mini all`

### Development

- Last 1 Chrome version
- Last 1 Firefox version
- Last 1 Safari version

## Next Steps

After completing setup:

1. Read [Architecture documentation](./architecture.md) (available after Story 1.2)
2. Review [Testing strategy](./testing.md)
3. Familiarize yourself with [Available Scripts](./scripts.md)
4. Check [project-context.md](../project-context.md) for coding standards

## Troubleshooting

### Port already in use

Change port in `.env`:

```bash
PORT=3001
```

### Playwright browsers not installed

```bash
npm run playwright:install
```

### MSW not working

Re-run MSW initialization:

```bash
npm run postinstall
```

### TypeScript errors

Check TypeScript configuration:

```bash
npm run lint:tsc
```

## Support

- **Issues**: [GitHub Issues](https://github.com/pplancq/lab-clean-architecture-react/issues)
- **Template**: [@pplancq/react-app](https://github.com/pplancq/react-app)
