# 05 — Task Manager

My fifth Angular project. A task management app to learn Angular Material and CRUD patterns.

**Live demo:** https://05taskmanager.netlify.app/

![App preview](screenshots/preview.png)

## Features

- List tasks in a Material table with column sorting
- Add and edit tasks in a modal dialog
- Delete tasks with confirmation dialog
- Filter tasks by status, priority and name
- Task statistics cards — clickable to filter by status
- Clear all filters button — appears only when a filter is active
- Showing X of Y tasks count when filters are active
- Keyboard accessible stat cards — Tab, Enter and Space support
- Dirty check — warns before discarding unsaved changes
- Data persists with localStorage

## Architecture decisions

- **Coordinator pattern over smart/dumb** — the page manages three child components (table, filters, dialog) that all depend on the same task list. With smart/dumb, each child would need the list passed down and events bubbled up through multiple levels. The coordinator pattern keeps the state in one place and makes the children reusable — the table does not need to know about the dialog.

- **`MatTableDataSource` over a plain array** — the table needed sorting and pagination from the start. `MatTableDataSource` provides both automatically by connecting to `MatSort` and `MatPaginator`. A plain array would have required writing that logic manually and rewriting it if the requirements changed.

- **Dual-mode dialog for add and edit** — add and edit share the same form fields and validation. Building two separate dialogs would mean maintaining two near-identical templates. The dialog checks if `MAT_DIALOG_DATA` is present to decide its mode and calls `patchValue()` to pre-fill the form in edit mode.

- **Reusable `ConfirmDialog` in `shared/`** — three different actions (delete task, discard changes, clear filters) all need a confirmation step. A single reusable component that receives title and message via `MAT_DIALOG_DATA` avoids duplicating the same UI three times and keeps destructive action behaviour consistent.

- **`ErrorStateMatcher` for submit-only errors** — by default `mat-error` shows as soon as a field is touched, which feels aggressive. A custom `ErrorStateMatcher` delays the error display until the user tries to submit, which is a better UX for forms where the user is still filling in fields.

## What I learned

### Angular
- `MatTableModule` + `MatTableDataSource` — Material table with sorting, filtering and pagination
- `MatSort` + `MatPaginator` — connect to `MatTableDataSource` via `@ViewChild` in `ngAfterViewInit`
- `MatDialog` + `MAT_DIALOG_DATA` + `MatDialogRef` — open dialogs, pass data in, receive data back
- `patchValue()` — pre-fill a reactive form with existing data for edit flows
- `ErrorStateMatcher` — control when `mat-error` appears (e.g. only on form submit)
- `NgClass` — apply multiple CSS classes dynamically based on data
- `role="button"` + `tabindex="0"` + `(keydown.enter)` — keyboard accessibility on non-button elements
- Coordinator pattern — page owns all state; child components only display and emit

### Angular Material theming
- `mat.theme()` in `material-theme.scss` — set palette, typography and density once for the whole app
- Context-specific themes — scope `mat.theme()` to a CSS class to apply a different palette per component
- `--mat-sys-*` CSS variables — Material's design token system for theme-aware colors

### CSS
- CSS grid — two-column form layout; `grid-column: 1 / -1` to span full width
- `table-layout: fixed` + `.mat-column-*` — control column widths in a Material table
- `visibility: hidden` — hide an element without removing its space from the layout

## Tech stack

- Angular 21
- TypeScript
- CSS
- Angular Material 21

## How to run the project

```bash
git clone https://github.com/VMNunez/dev-learning.git
```

```bash
cd dev-learning/angular/05-task-manager
```

```bash
npm install
```

```bash
npm start
```

Open your browser at `http://localhost:4200`
