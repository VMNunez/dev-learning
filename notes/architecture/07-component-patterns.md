# Component Patterns

In a small Angular app, one component that does everything works fine. As soon as a second component needs the same data, you have a choice: who owns the data? How does the other component get it? Component patterns answer this question. You already use these patterns in your projects — this file gives you the vocabulary to name them in an interview.

Official docs: https://angular.dev/guide/components/inputs

---

## Smart / Dumb (Container / Presentational)

The idea: split components into two roles.

| Role | Other names | Responsibility | Dependencies |
|------|-------------|----------------|--------------|
| **Smart** | Container, Page, Connected | Owns state, calls services, handles events | Calls services |
| **Dumb** | Presentational, Display | Shows data, emits events upward | None — receives everything via `input()` |

### Why this split?

A dumb component with no service dependencies is easy to test — just give it data and check what it renders. It is also reusable — any parent can use it because it does not care where the data comes from.

Without the split, components become tangled: template logic and business logic grow together until you cannot change one without risking the other.

### Example from project 03 (expense tracker)

```
ExpensePageComponent (smart)
│  - calls ExpenseService
│  - owns the expense list signal
│  - handles add/delete events
│
├── ExpenseFormComponent (dumb)
│     - receives nothing via input
│     - emits expenseSubmitted output
│
└── ExpenseListComponent (dumb)
      - receives expenses[] via input()
      - emits deleteRequested output
```

`ExpenseListComponent` knows nothing about `ExpenseService` — it only receives an array, displays it, and emits events. You could use it on a completely different page and it would work.

---

## Coordinator Pattern

The coordinator pattern appears when you have multiple sibling components that all need the same data.

### The problem with smart/dumb when siblings grow

Smart/dumb works perfectly for one smart parent → one or two dumb children. When you add a third sibling that also needs the data, you have a choice:

- Put state in one sibling and thread it up and back down (awkward)
- Duplicate state in each sibling (breaks sync immediately)
- Lift state to a parent that coordinates all siblings (coordinator ✅)

The coordinator is the third option — and the correct one.

### Example from project 05 (task manager)

```
TasksPageComponent (coordinator)
│  - owns tasks signal
│  - owns filter signal
│  - handles all CRUD events
│
├── TaskFiltersComponent (dumb)
│     input:  currentFilter
│     output: filterChanged
│
├── TaskTableComponent (dumb)
│     input:  filteredTasks
│     output: editTask, deleteTask
│
└── TaskDialogComponent
      - opened by the coordinator with MatDialog.open()
      - result returned via afterClosed()
```

All three children depend on the same task list. The coordinator owns it and passes the right slice to each child. None of the children know about each other.

> If a child component starts calling services itself (other than services for display reasons like formatting), that logic probably belongs in the coordinator instead.

---

## When to use which pattern

| Situation | Pattern |
|-----------|---------|
| One parent + one or two dumb children | Smart / Dumb |
| Multiple siblings sharing the same data | Coordinator |
| State needed across unrelated pages | Service (singleton) |

The rule: start with the simplest pattern that works. Promote to a more structured one when the complexity actually justifies it — not before.

---

## Names you will hear in interviews

Spanish consultancies use these patterns every day in list/detail views, which are the core of every business app.

| Name | What it means |
|------|--------------|
| Smart / Dumb | The classic two-role split |
| Container / Presentational | Same concept — newer name |
| Coordinator | Smart component that manages multiple siblings |
| Prop drilling | Passing data through many component levels — the problem coordinator solves |

### What to say when asked

"In project 05 I used the coordinator pattern because three sibling components — a filter bar, a table, and a dialog — all needed the same task list. The coordinator owns the list and passes the right data to each child. This avoids prop drilling and keeps each child reusable."
