# Project 05 — Task Manager

A task management app with a data table, dialogs for add/edit, filters,
sorting, pagination, and delete confirmation. Built with Angular Material.

---

## Why this project

- **Learning objective:** Learn Angular Material — theming, MatTable, MatDialog, and the coordinator pattern
- **Portfolio value:** Shows enterprise UI library usage — standard in Spanish consultancies

---

## Key features

- View all tasks in a sortable, paginated table
- Add a new task via a dialog form
- Edit an existing task via the same dialog (pre-filled)
- Delete a task with a confirmation dialog
- Filter tasks by status and priority
- Live stat cards showing counts per status
- Custom purple theme via `mat.theme()`

---

## Tech stack

- Angular + Angular Material v19
- Material theming with `mat.theme()` in `material-theme.scss`
- No external API — data lives in a service signal

---

## Pages and components

```
app/
├── app.component                      ← root with toolbar
├── pages/
│   └── tasks-page/
│       ├── tasks-page.component       ← coordinator: owns all state and events
│       ├── task-filters/
│       │   └── task-filters.component ← dumb, receives filter values, emits changes
│       ├── task-table/
│       │   └── task-table.component   ← dumb, receives tasks, emits edit/delete
│       ├── task-dialog/
│       │   └── task-dialog.component  ← dialog form, handles add and edit mode
│       └── confirm-dialog/
│           └── confirm-dialog.component ← reusable confirmation dialog
└── services/
    └── task.service.ts                ← signal<Task[]>, CRUD methods
```

---

## State management

- One `signal<Task[]>` in `TaskService`
- `computed()` for filtered list and stat card counts
- `MatTableDataSource` for sorting and pagination
- `MatDialog` service to open dialogs; `afterClosed()` to receive results
- Coordinator pattern — tasks-page owns all signals and handles all events from children

---

## Key patterns introduced

| Pattern | Where used |
|---|---|
| `mat.theme()` | Global and scoped Material theming |
| `mat.$violet-palette` | Replace default palette without CSS overrides |
| `--mat-sys-*` CSS variables | Material design tokens (color, surface, typography) |
| `MatTableModule` | `mat-table`, `matColumnDef`, `*matCellDef`, `*matHeaderCellDef` |
| `MatTableDataSource` | Handles sorting, filtering, pagination automatically |
| `MatSort` + `@ViewChild` | Connect sort to the data source in `ngAfterViewInit` |
| `MatPaginator` + `@ViewChild` | Connect pagination to the data source |
| `MatDialog.open()` + `afterClosed()` | Open dialog, wait for result |
| `MAT_DIALOG_DATA` | Inject parent data into the dialog |
| `MatDialogRef.close(value)` | Return data from dialog to parent |
| `patchValue()` | Pre-fill form for edit mode |
| `NgClass` | Apply multiple dynamic CSS classes |
| `inject<Type>(token)` | Typed injection with a token |
| `ErrorStateMatcher` | Control when `mat-error` appears |
| `*matNoDataRow` | Empty state row when table has no data |
| `autoFocus: false` | Prevent dialog from stealing focus on open |
| `DatePipe` | Format ISO date strings in the template |
| Confirmation dialog pattern | Reusable component that returns `true` on confirm |
| Coordinator pattern | Page handles all logic; children only display and emit |
| `table-layout: fixed` | Equal-width columns in the Material table |
| `grid-column: 1 / -1` | Span a form field across all grid columns |
| Context-specific theme | Scope `mat.theme()` to a CSS class for the delete button |

---

## Learning steps

1. Set up Angular Material with `ng add @angular/material`
2. Create `material-theme.scss` with `mat.theme()` and the violet palette
3. Define the `Task` interface and build `TaskService` with a signal
4. Build the coordinator page with `MatTableDataSource`, sort, and paginator
5. Build `task-table` as a dumb component — column definitions, sort headers, action buttons
6. Build `task-dialog` — reactive form, dual add/edit mode via `MAT_DIALOG_DATA`
7. Build `confirm-dialog` — reusable with custom title, message, and button labels
8. Build `task-filters` — filter signals passed down from the coordinator
9. Add stat cards using `computed()` signals
10. Add scoped red theme for the delete button in `material-theme.scss`
