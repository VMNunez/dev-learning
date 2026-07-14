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

## Pages and components

```
app/
├── app.component          ← root, renders the page
├── todo-page/
│   ├── todo-page.component        ← smart component, owns the task list signal
│   ├── todo-input/
│   │   └── todo-input.component   ← dumb, emits new task text
│   └── todo-item/
│       └── todo-item.component    ← dumb, receives task, emits toggle/delete
└── services/
    └── task.service.ts            ← holds the signal, add/toggle/delete methods
```

---

## State management

- One `signal<Task[]>` in `TaskService`
- `computed()` for derived values (e.g. completed count)
- Components read from the service via `inject()`
- No routing — single page

---

## Key patterns introduced

| Pattern | Where used |
|---|---|
| `@Component` decorator | Every component |
| `input()` + `output()` | todo-input and todo-item communicate with the page |
| `signal()` + `computed()` | TaskService state |
| `@for` + `@empty` + `@if` | Template control flow |
| `inject()` | Dependency injection without constructor |
| `[class.x]` | Toggle CSS class based on signal value |
| TypeScript `type` for union types | Task status |

---

## Learning steps

1. Create the Angular project with `ng new`
2. Create `TaskService` with a `signal<Task[]>` and basic methods
3. Build `todo-page` as the smart component — inject the service
4. Build `todo-input` — dumb component with an `output()` that emits the text
5. Build `todo-item` — dumb component with `input()` for the task and `output()` for events
6. Add `@for`, `@empty`, and `@if` in the template
7. Style with CSS variables and flexbox
