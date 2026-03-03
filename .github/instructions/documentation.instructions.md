---
applyTo: 'docs/**/*.md'
---

# Documentation Maintenance Instructions

Instructions for maintaining the project documentation in `docs/` consistently, completely, and in sync with the codebase.

## Core Principle

> Every file added to `docs/` must be reflected in `docs/README.md`. Every significant codebase change (new use case, new layer doc, new ADR) must trigger a documentation review.

---

## docs/README.md Is the Source of Truth

`docs/README.md` is the **index of all documentation**. It must always be up to date.

### When to update docs/README.md

Update `docs/README.md` **immediately** whenever:

| Action                                      | Section to update                    |
| ------------------------------------------- | ------------------------------------ |
| New use case doc added to `docs/use-cases/` | `## 🎯 Use Cases`                    |
| New layer doc added to `docs/layers/`       | `## 📚 Layers`                       |
| New ADR added to `docs/architecture/adr/`   | `## 🏗️ Architecture` (if referenced) |
| New architecture doc added                  | `## 🏗️ Architecture`                 |
| New infrastructure/pattern doc added        | corresponding section                |
| "Coming soon" item becomes available        | Replace with real link               |

### Checklist before committing any doc change

- [ ] The new/modified file is listed in `docs/README.md` with a correct relative link
- [ ] The description in `docs/README.md` matches the actual content of the file
- [ ] No "Coming soon" placeholder remains for a file that now exists
- [ ] The Learning Path in `docs/README.md` is still accurate

---

## File Placement Rules

```
docs/
├── README.md                       ← ALWAYS update when adding files
├── architecture/
│   ├── README.md                   ← Architecture overview
│   ├── adr/                        ← Architecture Decision Records
│   │   └── ADR-NNN-<slug>.md       ← Numbered, kebab-case
│   └── <topic>.md                  ← Cross-cutting architectural concepts
├── layers/
│   └── <layer-name>-layer.md       ← One file per layer (domain, application, infrastructure, ui)
├── use-cases/
│   └── <use-case-name>.md          ← One file per use case, kebab-case
├── infrastructure/
│   └── <topic>.md                  ← Infrastructure-specific docs
└── <topic>.md                      ← Top-level cross-cutting guides (result-pattern, value-objects…)
```

### Naming conventions

- Files: lowercase, hyphens (`edit-game.md`, `domain-layer.md`)
- ADRs: `ADR-NNN-<slug>.md` where NNN is zero-padded (e.g. `ADR-012-…`)
- Use cases: match the use case class name in kebab-case (`EditGameUseCase` → `edit-game.md`)

---

## What to Document

### Use Case docs (`docs/use-cases/<name>.md`)

Every use case added to `src/collection/application/use-cases/` must have a corresponding doc. It must include:

- **Purpose** — what business problem it solves
- **Flow diagram** — Mermaid sequence or flowchart showing the orchestration
- **DTO / inputs** — TypeScript interface with field descriptions
- **Validation strategy** — where validation happens (domain vs application)
- **Error handling** — possible errors, how they are surfaced
- **Test scenarios** — key test cases (happy path + edge cases)
- **Design decisions** — any notable choices with rationale

### Layer docs (`docs/layers/<name>-layer.md`)

When a layer gains significant new capabilities (new pattern, new hook, new contract), update the relevant layer doc. Each layer doc must reference the actual source files it describes.

### ADRs (`docs/architecture/adr/ADR-NNN-<slug>.md`)

Create an ADR for every architectural decision that:

- Introduces a new pattern or convention
- Changes an existing convention
- Rejects a reasonable alternative

Use the existing ADR format (Status, Context, Decision, Consequences).

---

## Markdown Style Guidelines

- **Language**: English (exception: ADR rationale may include French reasoning if the team is French-speaking)
- **Diagrams**: Use Mermaid (`\`\`\`mermaid`) for flow/sequence diagrams — renders on GitHub and Docusaurus
- **Code blocks**: Always specify the language (`\`\`\`typescript`, `\`\`\`bash`)
- **Cross-references**: Use relative links (`./use-cases/edit-game.md`, `../architecture/README.md`)
- **Headings**: Start at `#` (H1) for page title, never skip levels
- **Tables**: Use for comparing options, listing fields, mapping concepts
- "Coming soon" placeholders are allowed for planned but not yet written sections; remove them as soon as the file is created

---

## What NOT to Do

- ❌ Do NOT create a doc file without updating `docs/README.md`
- ❌ Do NOT add `docs/README.md` links that point to files that don't exist yet (use "Coming soon" text instead)
- ❌ Do NOT duplicate content — link to the authoritative source instead
- ❌ Do NOT describe implementation details that belong in code comments (JSDoc)
- ❌ Do NOT create planning/notes files in `docs/` — use `.copilot/` for session artifacts

---

## Sync with Codebase Checklist

When implementing a new feature, verify documentation at each step:

1. **New use case created** → Create `docs/use-cases/<name>.md` + update `docs/README.md`
2. **New layer pattern introduced** → Update relevant `docs/layers/<layer>-layer.md`
3. **New architectural decision made** → Create `docs/architecture/adr/ADR-NNN-<slug>.md`
4. **New infrastructure adapter added** → Add or update `docs/infrastructure/<topic>.md`
5. **"Coming soon" section implemented** → Replace placeholder in `docs/README.md` with real link
6. **Existing behavior changed** → Update all docs that referenced the old behavior
