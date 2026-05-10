# Architecture Decisions

## What is an architecture decision?

An architecture decision is a choice you made about **how to structure or build something**, and the reason why you chose that option over the alternatives.

It is not a list of tools or technologies. It explains the thinking behind the code.

---

## Why this matters for interviews

Companies ask juniors questions like:

- "Why did you use this pattern here?"
- "What would you change if the app needed to grow?"
- "Why not just use a simple array instead of a data source wrapper?"
- "Why did you separate this into a service instead of keeping the logic in the component?"

A developer who can answer these questions stands out from one who only knows how to use the tools.

---

## The formula for a good architecture decision

**What you chose → Why you chose it → What it avoids or enables**

```
Used [pattern / tool / approach]
because [reason — the problem it solves or the constraint it responds to]
which avoids [problem] / which enables [benefit]
```

---

## Good vs bad examples

| Bad (just what) | Good (what + why + result) |
| --- | --- |
| "Used the coordinator pattern" | "Used coordinator pattern because three child components share the same employee list — lifting state to the page avoids passing it down through multiple levels and keeps the children reusable" |
| "Used a data source wrapper" | "Chose a data source wrapper over a plain array because the table needed sorting and pagination from day one — the wrapper handles both automatically and scales without rewriting the component" |
| "Used lazy loading" | "Applied lazy loading to admin routes because most users are employees who never visit admin pages — this reduces the initial bundle and avoids downloading code they will never use" |
| "Used a route guard" | "Added a deactivation guard only on forms with many fields — simpler one-click actions do not need it because the risk of accidental data loss is low" |
| "Used a shared component" | "Moved the confirm dialog to a shared folder because three different pages use it with different labels — a single reusable component avoids duplicating the same template three times" |

---

## What counts as an architecture decision

Anything where you had a real choice between at least two options:

### Component and state patterns
- Why coordinator pattern instead of smart/dumb (or the reverse)
- Why a reusable dialog instead of a separate page
- Why shared state in a service vs local state in the component
- Why a computed value instead of a method

### Data and API design
- Why a wrapper over a plain array (sorting, filtering, pagination)
- Why passing the full object on edit vs individual fields
- Why a duplicate check lives in the service vs the component
- Why a REST endpoint returns a flat object vs a nested one

### Routing and navigation
- Why lazy loading on a specific route
- Why stacking two guards instead of combining their logic
- Why a deactivation guard only on long forms

### Form design
- Why reactive forms instead of template-driven
- Why a multi-step form instead of a single long form
- Why a custom error state instead of relying on built-in validation timing

### Folder structure
- Why Core / Feature / Shared instead of a flat structure
- Why a shared component lives in `shared/` instead of inside a feature

### Backend (Spring Boot)
- Why a service layer between the controller and the repository
- Why JWT instead of session-based auth
- Why this database schema (which tables, which relationships, which constraints)
- Why a DTO instead of returning the entity directly

---

## How to write the section in a README

No limit on bullets. Include every decision that is not obvious. Skip things that have no real alternative.

```markdown
## Architecture decisions

- **Coordinator pattern** — the page manages table, filters, and dialog together; all three share the same data list, so lifting state to the coordinator avoids passing it through multiple levels and keeps each child reusable in other contexts

- **Lazy loading on admin routes** — most users are employees who never visit admin pages; splitting the bundle means they never download code they do not need, which reduces the initial load time

- **Deactivation guard only on long forms** — the department form has several fields and takes time to fill; simpler one-click actions (status update, delete confirm) do not need a guard because the risk of accidental loss is low

- **Dual-mode dialog for add and edit** — both actions share the same component; the dialog checks if input data is present to decide the mode, which avoids maintaining two near-identical templates
```

---

## Questions to ask yourself before writing the section

For each pattern or tool you used, ask:

1. Was there a real alternative I considered or could have used?
2. What problem does this solve that the alternative would not?
3. What would break or be harder if I had chosen differently?
4. Does this scale if the app or team grows?

If you can answer at least one of these, you have an architecture decision worth writing.
