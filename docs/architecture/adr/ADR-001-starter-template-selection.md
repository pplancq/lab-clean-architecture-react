## ADR-001: Starter Template Selection (@pplancq/react-app)

**Date:** 2026-01-14  
**Status:** ✅ Accepted

### Context

The project requires a React SPA foundation with specific requirements:

- Rsbuild as build tool (modern Webpack/Vite alternative)
- TypeScript strict mode
- Clean Architecture layering without opinionated routing/state management
- Educational goals (demonstrating Clean Architecture in React)
- Integration with internal tooling ecosystem (`@pplancq/shelter-ui-react`, dev tools)

**Alternatives Considered:**

- **Vite React Template**: ❌ Missing Rsbuild requirement, generic structure incompatible with Clean Architecture layers
- **Next.js**: ❌ SSR/SSG overhead unnecessary for client-side SPA, opinionated file-based routing conflicts with domain-driven structure
- **Create React App**: ❌ Deprecated, missing modern tooling
- **@pplancq/react-app**: ✅ Pre-configured for Rsbuild, TypeScript strict mode, clean slate for architectural experimentation

### Decision

Use **`@pplancq/react-app`** as the project foundation.

**Rationale:**

- ✅ Exact Rsbuild configuration match (no reconfiguration needed)
- ✅ TypeScript strict mode pre-configured with project standards
- ✅ Automated git initialization and base dependency setup
- ✅ No opinionated routing/state management (enables pure Clean Architecture implementation)
- ✅ Controlled dependencies (only essential packages, no bloat)
- ✅ Internal tooling compatibility (same ecosystem as shelter-ui)

**Key Dependencies Included:**

```json
{
  "react": "^19.2.3",
  "react-dom": "^19.2.3",
  "@rsbuild/core": "latest",
  "typescript": "^5.x"
}
```

**Post-Install Steps:**

```bash
npm install inversify reflect-metadata # Dependency Injection
npm install react-router               # Routing (manual setup)
npm install react-hook-form            # Form management
npm install @pplancq/shelter-ui-react  # Design system
npm install idb                        # IndexedDB wrapper
npm install @tanstack/query-core       # State management (NOT React Query hooks)
```

### Consequences

**Positive:**

- ✅ Fast project initialization with correct tooling (Rsbuild, TypeScript strict)
- ✅ Complete architectural freedom (no framework constraints on Clean Architecture patterns)
- ✅ Consistent with tooling ecosystem (@pplancq packages)
- ✅ Educational transparency (no hidden framework magic)
- ✅ Open source and publicly available on GitHub

**Negative:**

- ❌ Requires manual installation of specialized libraries (shelter-ui, InversifyJS, etc.)
- ❌ Less popular than mainstream templates (Vite, Create React App)
- ❌ Smaller community (personal project vs ecosystem-wide template)

**Trade-offs Accepted:**

- Manual setup overhead vs. architectural control → **Control wins** (project is 80% learning, 20% utility)
- Popular template vs. exact tool match → **Exact match wins** (Rsbuild non-negotiable)

---
