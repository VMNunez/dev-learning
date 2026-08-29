# Project 01 — To-do list

A simple task manager where users can add, complete, and delete tasks.

---

## Why this project

- **Learning objective:** Learn the core Angular building blocks from zero
- **Portfolio value:** Shows you can build a basic Angular app from scratch without tutorials

---

## Key features

- Add a new task
- Mark a task as complete / incomplete
- Delete a task
- Show a message when the list is empty

---

## Tech stack

- Angular (signals-based, no Angular Material)
- CSS custom properties + Flexbox

---

## Architecture

One-way data flow. The service owns the only copy of the state; the two feature components inject it
directly — one to write, one to read and derive; the leaf component never writes state, it emits an
event and lets its parent decide.

```
              TaskService (signal<Task[]>)        ← single source of truth, only writer
             ▲ inject()            │ inject()
             │                     ▼
        task-form              task-list          ← inject the service themselves
     (calls addTask)   (reads the signal, derives
                        counts + filter, calls
                        toggleTask / deleteTask)
                                   │ input()   ▲ output()
                                   ▼           │
                               task-item        ← presentational, no state of its own

        todo-page                                ← layout shell: composes the two above,
                                                   injects nothing, holds no state
```

Not classic MVC: there is no controller sitting between view and model. Angular's model *is* the
signal, and the template re-renders because it reads that signal — the "controller" work is just the
service methods that update it.

**Why state lives in the service, not in the page component:** it survives the component being
destroyed and can be injected by any future component without passing it through inputs. Keeping it
in the page would work today with three components, but it is the habit that stops scaling the
moment a second page needs the same list.

**Why `task-form` and `task-list` inject the service instead of receiving data from `todo-page`:**
passing the list down through the page would make the shell a courier for data it has no interest in
— it would have to declare an input, re-emit three events, and change every time the list's shape
changes. Injecting where the data is actually used keeps the page a pure layout concern and each
feature component independently placeable on any future page.

**Why `task-item` takes `input()` and emits `output()` instead of injecting the service:** it is the
repeated leaf, rendered once per task, so it must be told *which* task it is. A component that only
receives data and emits events can be reasoned about (and later tested) from its inputs alone, with
no knowledge of where the data came from — and `task-list`, which already owns the read, is the
natural place for the write to land.

---

## Data model

There is no backend and no database: the model is a plain TypeScript interface held in memory by the
service, so the "schema" lives entirely in the type.

`Task` — `pages/todo-page/models/task.model.ts`

| Field | TS type | Constraints | Notes |
|---|---|---|---|
| `id` | `number` | required, unique | Generated client-side with `Date.now()`; enough for an in-memory list, and the field a real backend would own |
| `title` | `string` | required, non-empty after `trim()` | The form rejects whitespace-only input before calling the service |
| `completed` | `boolean` | required, defaults to `false` on create | A two-state flag, not a status enum — see the tradeoff below |

**Why an `interface` and not a `class`:** the task is data, not behaviour. An interface disappears at
compile time, so no runtime cost and no temptation to put logic on the model instead of in the service.

**Why `completed: boolean` instead of a `status` union:** the app has exactly two states and no
transition rules between them, so a union (`'active' | 'completed'`) would add a type without adding a
guarantee. The union type appears where it earns its place instead — the view filter in `TaskList`,
`type Filter = 'all' | 'active' | 'completed'`, where an invalid string really would be a bug.

**Mutation rules (the service is the only writer):** `addTask` appends a new object, `toggleTask` maps
the list replacing the matched task with a copy, `deleteTask` filters it out. All three replace the
array rather than mutating it, because a signal only notifies its readers when it receives a **new**
reference — pushing into the existing array would change the data with the UI never re-rendering.

---

## Pages and components

```
app/
├── app.ts                            ← root, renders <router-outlet>
├── app.routes.ts                     ← one route: '' → TodoPage
└── pages/
    └── todo-page/
        ├── todo-page.ts              ← page shell, composes form + list
        ├── models/
        │   └── task.model.ts         ← the Task interface
        ├── services/
        │   └── task.service.ts       ← holds the signal, add/toggle/delete methods
        └── components/
            ├── task-form/            ← input box, calls addTask on the service
            ├── task-list/            ← reads the signal, derives counts + filter, renders items
            └── task-item/            ← dumb, input() task, output() toggle/delete
```

---

## State management

- One `signal<Task[]>` in `TaskService` — the only writable copy of the list
- `TaskList` injects the service, reads the signal, and derives everything else with `computed()`:
  `pendingCount`, `totalCount`, and `filteredTasks`
- The view filter is its own local `signal<Filter>` in `TaskList` — it is UI state, not task data, so
  it does not belong in the service
- `TaskItem` never injects anything: it takes `input.required<Task>()` and emits the task id
- Routing is present but minimal — a single route `''` → `TodoPage`, so the app boots through the
  router (the habit every later project needs) without any navigation to design yet

---

## Key patterns introduced

| Pattern | Where used | Why this project teaches it |
|---|---|---|
| `@Component` decorator | Every component | The unit Angular is built from — nothing else can be learned before it |
| `@Injectable` | `TaskService` | Marks the class Angular is allowed to construct and inject; the entry point to DI |
| `inject()` | `TaskService` consumed by `TaskForm` / `TaskList` | The modern function-based DI Angular now prefers over constructor injection |
| `input()` + `output()` | `task-item` talks to its parent `task-list` | The contract that keeps children dumb — data down, events up |
| `signal()` + `computed()` | `TaskService` list state; `TaskList` derived counts and filter | Reactivity without subscriptions, so the first project spends its budget on components |
| `signal.set()` + `signal.update()` | `addTask`, `toggleTask`, `deleteTask` in `TaskService` | The two write APIs: replace a value outright vs derive the next from the current |
| `@for` + `@empty` + `@if` | `task-list` template | The built-in control flow that replaced `*ngFor` / `*ngIf` — the syntax every later project uses |
| `[class.x]` | `task-item` strikethrough on `completed` | Binding presentation to state instead of toggling classes imperatively |
| TypeScript `type` for union types | `type Filter = 'all' \| 'active' \| 'completed'` in `TaskList` | Makes an invalid filter value a compile error rather than a silent no-match |
| Service-owned state + one-way data flow | Whole app (see Architecture) | The architectural concept of this project: one writer, many readers |

---

## Tradeoffs to document in the README

- Signals over RxJS `BehaviorSubject` — no subscription to manage or clean up, so the first project
  spends its budget on components instead of stream lifecycle
- State in a service over state in the page component — survives the component and is reusable later
- `completed: boolean` over a `status` union — two states with no transition rules between them, so a
  union would add a type without adding a guarantee (see the data model)
- Router with a single `''` route over bootstrapping the page directly — the app boots through the
  router from day one, so later projects add navigation instead of retrofitting routing
- In-memory array over `localStorage` — persistence is the concept project 04 teaches; adding it here
  would hide the signal behind a second problem
- Plain CSS custom properties over Tailwind or Angular Material — the goal is to learn the box model
  and flexbox by hand before a framework hides them

---

## Learning steps

All steps below are complete — the project is finished and merged to `main`. Testing is not part of
this project: per CLAUDE.md's "Testing rules", tests are introduced from project 07 onwards, so
projects 01–06 have no test step by design.

1. **Project setup** ✅ — create the Angular project with `ng new`, one route `''` → `TodoPage`.
   *Done:* `Browser: the empty To-do list page renders at `/``
2. **`TaskService`** ✅ — `@Injectable` service holding `signal<Task[]>` plus `addTask`, `toggleTask`,
   `deleteTask`, each replacing the array instead of mutating it.
   *Done:* `Browser: adding a task from the console via the injected service makes the list grow at `/``
3. **`todo-page` shell** ✅ — the page component: a pure composition shell that injects nothing and
   just places form + list.
   *Done:* `Browser: the page shell with form and list slots renders at `/``
4. **`task-form`** ✅ — feature component that `inject()`s `TaskService` and calls `addTask` with the
   trimmed title; rejects whitespace-only input.
   *Done:* `Browser: typing a title and submitting at `/` adds a row; submitting spaces adds nothing`
5. **`task-item`** ✅ — dumb component, `input.required<Task>()` plus `output()` for toggle and delete.
   *Done:* `Browser: clicking a task at `/` strikes it through; clicking delete removes that row only`
6. **`task-list`** ✅ — reads the signal and derives `pendingCount`, `totalCount` and `filteredTasks`
   with `computed()`; owns the local `signal<Filter>` view filter.
   *Done:* `Browser: switching all/active/completed at `/` changes the rows shown and the pending count`
7. **Template control flow** ✅ — `@for`, `@empty`, and `@if` in the list template.
   *Done:* `Browser: with no tasks, the empty message shows at `/`; with tasks, the rows show instead`
8. **Styling** ✅ — CSS custom properties and flexbox, no framework.
   *Done:* `Browser: the list is laid out with flexbox and themed from CSS variables at `/``
