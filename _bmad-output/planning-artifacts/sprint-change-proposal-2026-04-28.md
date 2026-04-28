# Sprint Change Proposal - 2026-04-28

**Approval status:** Approved by Paul on 2026-04-28  
**Implementation status:** Applied to planning artifacts and sprint tracking

## 1. Issue Summary

Sprint 5 reached its planned end date (2026-04-27) without completion, not because of a technical blocker but because the current sprint-based operating model no longer fits the reality of a solo, part-time, learning-driven project.

The triggering issue is a process mismatch:

- The project is explicitly constrained to a sustainable pace of **5 hours/week maximum**
- The PRD allows pauses without guilt and prioritizes learning over completion
- Sprint 5 focused heavily on UI work (Epic 9), while the project's primary motivation is to extract Clean Architecture lessons from a real React codebase
- The current sprint framing creates deadline pressure and motivation loss instead of momentum

Evidence from project artifacts:

- `sprint-status.yaml` defines Sprint 5 as a fixed two-week sprint ending on 2026-04-27
- Sprint 4 retrospective documents saturation risk on UI-heavy work and confirms that UI work is less energizing than architecture-heavy work
- PRD guardrails already favor sustainable pace, no-guilt pauses, and “good enough” delivery over rigid cadence

## 2. Impact Analysis

### Epic Impact

**Epic 9 (UI Components)** is the most impacted artifact area. It is currently acting like the driver of short-term planning, but it is only a supporting enabler for the real product and learning goals.

Recommended epic-level impact:

- Keep **Epic 9** active, but reclassify it as a **supporting backlog**, not the main planning driver
- Reprioritize future pull order toward epics that better support Clean Architecture learning:
  - **Epic 3** for domain/application search/filter/sort use cases
  - **Epic 5** for a new bounded context and event-driven integration
  - **Epic 4** when architectural/API adapter learning is desired
- Limit UI work to:
  - unblockers
  - thin vertical slices
  - “good enough” UX needed to demonstrate architecture

### Story Impact

Current Sprint 5 committed stories should no longer be treated as a date-bound commitment set.

Most impacted stories:

- `9-6-gamecard`
- `9-4-gamecover`
- `pages-folder-pattern-fix`
- `9-2-topbar`
- `9-3-burgermenu-drawer`

Recommended story-level change:

- Convert these from **Sprint 5 committed items** to **Kanban candidates**
- Keep only the smallest unblockers near the top:
  - `9-4-gamecover`
  - `9-6-gamecard`
  - `pages-folder-pattern-fix` (if still needed to reduce friction)
- Move the rest of the Epic 9 UI backlog behind architecture-learning work unless a specific feature pull requires them

### Artifact Conflicts

#### PRD

The PRD is internally close to the new reality, but some execution language still assumes fixed weekly time-boxing as the primary control mechanism.

Conflicts:

- “Weekly Shipping Discipline”
- `NFR39`: one complete feature shipped per week
- MVP timeline wording assumes consistency that no longer reflects actual availability

#### Architecture

No core architecture change is required. The change is process-level, not technical.

Minor documentation impact only:

- architecture remains valid
- document maintenance guidance should note that delivery sequencing is now Kanban-driven rather than sprint-driven

#### UX Design

The UX specification contains a sprint-based roadmap (`Sprint 1` to `Sprint 4`) that is now misleading for execution.

Conflict:

- roadmap implies a linear, time-boxed UI delivery sequence
- this encourages continuing a UI-heavy path even when it no longer matches project motivation

#### Secondary Artifacts

These artifacts require direct updates:

- `implementation-artifacts/sprint-status.yaml`
- future retrospective process
- possibly `component-inventory.md` if “Sprint” assignments are used for active planning rather than historical reference

### Technical Impact

No code rollback is recommended.

Technical risk is low because:

- no architecture reversal is needed
- no implemented feature must be removed
- this is a backlog governance and sequencing correction

## 3. Recommended Approach

### Selected Approach: Hybrid of Option 1 (Direct Adjustment) + Option 3 (MVP Review)

This change does **not** require rollback. It requires:

1. replacing the active sprint model with a lightweight Kanban model
2. reframing short-term priorities around learning leverage and unblockers
3. reducing the planning weight of UI-only work
4. introducing a monthly retrospective + reprioritization checkpoint

### Why this is the best path

- **Low effort**: mostly artifact/process updates, no code rework
- **Low risk**: preserves all completed work
- **High morale benefit**: removes artificial deadline debt from a solo side project
- **Better alignment**: reconnects execution with the project’s original purpose
- **Sustainable**: fits variable and unpredictable availability

### Proposed Kanban Operating Model

Use a simple board with these lanes:

- `Backlog`
- `Ready`
- `In Progress`
- `Blocked`
- `Done`

Operating policies:

- **WIP limit: 1** active story at a time
- **Ready limit: 3** stories maximum
- Pull work based on this priority order:
  1. architecture-learning story
  2. unblocker story
  3. thin UI slice required to demonstrate a feature
  4. polish-only work
- If no progress happens for 2+ weeks: no exception process, just resume from `Ready`

### Monthly Review Ritual

Replace sprint retrospective with a **monthly review session**:

- What was finished?
- What stayed blocked or untouched?
- What gave energy vs. drained energy?
- Which backlog items now deserve promotion or demotion?
- Is Epic 9 still supporting the learning goal, or becoming a distraction?

## 4. Detailed Change Proposals

### A. Sprint Status Artifact

**Artifact:** `_bmad-output/implementation-artifacts/sprint-status.yaml`  
**Section:** Active sprint planning

**OLD**

```yaml
sprint-5:
  name: "Epic 9 P0 Completion + Epic 3 Prep"
  goal: "Clear all P0 carry-overs, complete Epic 9 P0 components..."
  start_date: "2026-04-14"
  end_date: "2026-04-27"
  status: planned
  committed:
    - 9-6-gamecard
    - 9-4-gamecover
    - pages-folder-pattern-fix
    - 9-2-topbar
    - 9-3-burgermenu-drawer
```

**NEW**

```yaml
delivery_mode: kanban

kanban_policy:
  wip_limit: 1
  ready_limit: 3
  monthly_review: true
  selection_order:
    - architecture_learning
    - unblocker
    - thin_vertical_slice
    - ui_polish

current_focus:
  ready:
    - 9-4-gamecover
    - 9-6-gamecard
    - 5-1-create-wishlist-bounded-context-and-domain-entities
  in_progress: []
  blocked: []
  done: []
```

**Rationale:** replace deadline-based commitment with pull-based execution aligned to solo availability and learning goals.

### B. PRD - Delivery Strategy

**Artifact:** `_bmad-output/planning-artifacts/prd.md`  
**Section:** `Weekly Shipping Discipline`

**OLD**

- “One Shippable Feature Per Week”
- red flag if a week ends without a shippable feature

**NEW**

- “One Meaningful Pull at a Time”
- prefer completing the current pulled story over starting new work
- review progress monthly instead of using weekly failure signals
- measure momentum by completed outcomes and documented learnings, not calendar compliance

**Rationale:** the current language reinforces guilt and deadline debt, which conflicts with the same PRD’s anti-burnout guidance.

### C. PRD - Development Workflow Constraint

**Artifact:** `_bmad-output/planning-artifacts/prd.md`  
**Section:** `NFR39`

**OLD**

- `NFR39`: Weekly shipping discipline delivers one complete feature per week

**NEW**

- `NFR39`: Pull-based delivery keeps at most one active story in progress and favors completion over parallel work

**Rationale:** keeps discipline, removes brittle calendar coupling.

### D. UX Design Specification

**Artifact:** `_bmad-output/planning-artifacts/ux-design-specification.md`  
**Section:** `Implementation Roadmap`

**OLD**

- Sprint 1 / Sprint 2 / Sprint 3 / Sprint 4 roadmap with fixed week ranges

**NEW**

- Replace sprint roadmap with execution tracks:
  - Track A: Core unblockers
  - Track B: Collection usability essentials
  - Track C: Wishlist and bounded-context expansion
  - Track D: Optional polish and optimization

**Rationale:** preserves sequencing logic without forcing a sprint cadence that no longer serves the project.

### E. Story Prioritization Adjustment

**Artifact:** backlog ordering in `sprint-status.yaml` and planning notes

**OLD**

- Epic 9 Sprint 5 committed set drives immediate work

**NEW**

- Immediate `Ready` candidates:
  - `9-4-gamecover` (tiny unblocker)
  - `9-6-gamecard` (close carry-over cheaply)
  - `5-1-create-wishlist-bounded-context-and-domain-entities` or `3-1-implement-text-search-use-case` as the next architecture-learning pull
- Defer `9-2-topbar`, `9-3-burgermenu-drawer`, and most Epic 9 P1/P2 items until they are needed by a pulled feature

**Rationale:** keeps the UI “good enough” while restoring focus on Clean Architecture learning value.

## 5. Implementation Handoff

### Scope Classification

**Moderate**

This is more than a tiny backlog tweak, but it does not require a fundamental product or architecture replan.

### Recommended Handoff

- **Product Owner / Planning role**
  - approve the Kanban shift
  - approve the new prioritization policy
  - approve the monthly retro/review cadence

- **Developer role**
  - update `sprint-status.yaml`
  - update PRD delivery wording
  - update UX roadmap wording
  - optionally update component inventory planning labels if they are still used operationally

### Success Criteria

- No active sprint deadline remains in execution artifacts
- A Kanban board / status artifact exists with explicit WIP policy
- Epic 9 is no longer the default planning driver
- Monthly review cadence is documented
- The next pulled story can be selected based on motivation + learning value, not calendar debt
