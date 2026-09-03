# Task Manager

My 5th learning project — task management app where users create, edit and delete tasks, filter by status and priority, and see live statistics.

---

## Why this project

Most real business apps use a UI component library instead of building everything from scratch. I built this project to learn Angular Material — the table, dialog and form components that appear in almost every enterprise Angular app.

---

## Live demo

https://05taskmanager.netlify.app/

---

## Screenshots

**Task list with filters and stat cards**

![App preview](screenshots/preview.png)

**Add/edit task dialog**

*(screenshot — task dialog — to be added)*

---

## Features

- List tasks in a table with sortable columns and pagination for long lists
- Add and edit tasks in a dialog with form validation
- Delete tasks with a confirmation step
- Filter tasks by status, priority and name
- Live stat cards — show task counts per status
- Clear filters button — only appears when a filter is active
- Task count badge — "Showing X of Y" when filters are active
- Data persists after page refresh

---

## Architecture decisions

- Coordinator pattern on the page to avoid passing the task list through multiple levels — table, filters and dialog all share the same state, and the page is the single place that manages it
- `MatTableDataSource` instead of a plain array to get sorting and pagination without hand-writing them
- Dual-mode dialog for add and edit to avoid maintaining two near-identical forms that would drift apart
- Reusable `ConfirmDialog` to give delete and discard-changes one confirmation component with different title, message and button labels
- `ErrorStateMatcher` to delay validation errors until submit, so a form the user is still filling in does not scold them mid-typing

---

## Tradeoffs

- Angular Material over plain CSS — adds a dependency but matches what enterprise teams actually use, which is the point of this project
- `localStorage` over a real backend — the focus was Material and CRUD patterns, not data persistence

---

## Future improvements

- Due dates with overdue highlighting
- Export tasks to CSV

---

## What I learned

- `MatTableModule` + `MatTableDataSource` — Material table with sorting and filtering
- `MatSort` + `MatPaginator` + `@ViewChild` + `ngAfterViewInit` — connect sorting and pagination to the table after the view loads
- `MatDialog.open()` + `afterClosed()` — open a dialog and receive data back
- `MAT_DIALOG_DATA` + `MatDialogRef.close(value)` — the dialog's data contract: the parent's data in, the result out on close
- Test doubles for runtime-minted tokens — `MatDialog.open()` creates `MatDialogRef` and `MAT_DIALOG_DATA`, so the dialog specs provide both with `useValue` instead of opening a real dialog
- `patchValue()` — pre-fill a reactive form with existing data for edit flows
- `ErrorStateMatcher` — custom class that controls when `mat-error` appears
- `mat.theme()` and `--mat-sys-*` tokens in `material-theme.scss` — palette and typography set once for the whole app, re-scoped to a class for the delete button, with component CSS reading theme roles instead of hard-coded colors
- Coordinator pattern — page owns all state; child components only display and emit
- `crypto.randomUUID()` for entity ids — a clock reading collides when two records are created in the same millisecond
- Local date components over `toISOString()` — `toISOString()` reads the clock in UTC, so a date derived from it shifts the day after local midnight
- Stored data as untrusted input — `JSON.parse` on a `localStorage` value is wrapped in `try`/`catch` and checked with `Array.isArray` before it reaches the signal, so corrupted storage falls back to an empty list instead of breaking the app
- Native `<button>` over `role="button"` — the tag supplies Space, Enter and focus; `[attr.aria-pressed]` states which stat-card filter is active

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Angular 21 |
| UI library | Angular Material 21 |
| Language | TypeScript |
| Styles | CSS + SCSS (Material theming) |
| Storage | `localStorage` |
| Testing | Vitest |

---

## Project structure

```
src/app/
├── app.ts                          root shell, renders the router outlet
├── app.routes.ts                   single route to the task page
├── models/
│   └── task.model.ts               Task interface and its status/priority union types
└── pages/
    └── task-page/
        ├── task-page.ts            coordinator — owns all state and handles child events
        ├── components/
        │   ├── task-table/         displays the Material table, emits edit/delete
        │   ├── task-filters/       status, priority and name filters, emits changes
        │   ├── task-dialog/        reactive form dialog, add and edit mode
        │   └── confirm-dialog/     reusable confirmation dialog
        └── services/
            └── task.service.ts     signal<Task[]> with CRUD and localStorage persistence
```

Global styles live in `src/styles.css`; the Material palette and the scoped delete-button theme live in `src/material-theme.scss`.

---

## How to run

```
git clone https://github.com/VMNunez/dev-learning.git
```

```
cd dev-learning/projects/05-task-manager
```

```
npm install
```

```
npm start
```

Open your browser at `http://localhost:4200`
