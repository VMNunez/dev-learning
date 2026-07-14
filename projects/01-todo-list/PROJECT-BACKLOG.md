# Project Backlog — 01 To-do list

**Last Reviewed — backend:** n/a — Angular-only
**Last Reviewed — frontend:** 2026-07-14

**Overall quality:** Good — clean smart/dumb split, correct signal/computed state and strict typing throughout. The gap is testing: every spec is still CLI boilerplate, so nothing in the app is actually covered.

---

## Tasks

### High

- [ ] `[frontend]` Write real unit tests for `TaskService` — `addTask` appends a task, `toggleTask` flips only the matching task, `deleteTask` removes only the matching task. Currently `task.service.spec.ts` only has the generated `should be created`. *(Effort: M)*
- [ ] `[frontend]` Write real unit tests for `TaskList`'s computeds — `filteredTasks()` returns the right subset for each of `all` / `active` / `completed`, and `pendingCount` / `totalCount` track the signal. *(Effort: M)*
- [ ] `[frontend]` Write real unit tests for the dumb components' outputs — `TaskItem` emits `taskToggled` / `taskDeleted` with the correct id, and `TaskForm` ignores empty/whitespace-only input instead of adding a task. *(Effort: M)*

### Medium

- [ ] `[frontend]` Replace `id: Date.now()` in `task.service.ts:15` with an incrementing counter or `crypto.randomUUID()`. Trigger: two tasks added within the same millisecond (rapid double-click) get the same id, so `toggleTask` / `deleteTask` then act on both at once. *(Effort: S)*
- [ ] `[frontend]` Fix or remove `app.spec.ts` — it asserts an `<h1>` containing `'Hello, 01-todo-list'`, but `app.html` renders only `<router-outlet />`, so the assertion can never match the real DOM. *(Effort: S)*
- [ ] `[frontend]` Let the user submit a task with Enter — `task-form.html` only wires the button click. Wrap the input in a `<form (ngSubmit)="...">` (or add `(keyup.enter)`). *(Effort: S)*

### Low

- [ ] `[frontend]` Remove the unreachable `default:` branch in `task-list.ts:46-47` — `Filter` is a closed union and all three cases are already handled. *(Effort: S)*
- [ ] `[frontend]` In `task-form.ts:13-15`, replace the `title.trim() && this.taskService.addTask(...)` short-circuit-as-statement with a plain `if`. *(Effort: S)*
- [ ] `[frontend]` Remove the no-op `align-items: center` in `task-item.css:12-15` — it sits on a `<span>` that is not a flex/grid container. *(Effort: S)*
- [ ] `[frontend]` Reconcile routing with the plan — `app.config.ts` provides `provideRouter` and the shell uses `RouterOutlet`, but PLANNING.md says "No routing — single page". Either drop the router and render `TodoPage` directly, or update PLANNING.md. *(Effort: S)*
- [ ] `[frontend]` `app.css` is empty — drop the unused `styleUrl` reference. *(Effort: S)*

---

## Learning objectives

| Concept | Verdict | Note |
|---|---|---|
| `@Component` decorator | ✅ Demonstrated | used across 5 components (`task-item.ts:4`, `task-list.ts:8`) |
| `input()` + `output()` | ✅ Demonstrated | `task-item.ts:11-13` — `input.required<Task>()` + two `output<number>()`, wired at `task-list.html:16-20` |
| `signal()` + `computed()` | ✅ Demonstrated | `task-list.ts:27-35` — `currentFilter` signal drives `filteredTasks`, plus `pendingCount` / `totalCount` |
| `@for` + `@empty` + `@if` | ✅ Demonstrated | `task-list.html:11,15,21` — all three, with `track task.id` and a real empty state |
| `inject()` | ✅ Demonstrated | `task-list.ts:15`, `task-form.ts:11` — field-initializer form |
| `[class.x]` | ✅ Demonstrated | `task-item.html:3`, `task-list.html:2-6` |
| TS `type` for union types (Task status) | ⚠️ Shallow | `Task` has `completed: boolean`, not a status union (`task.model.ts:1-5`). The only union is `Filter` (`task-list.ts:6`) — related, but not the planned concept |

**Tally:** 6 ✅ · 1 ⚠️ · 0 ❌
