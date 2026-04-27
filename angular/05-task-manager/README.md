# 05 — Task Manager

My fifth Angular project. A task management app to learn Angular Material and CRUD patterns.

**Live demo:** coming soon

## Features

- List tasks in a Material table with column sorting
- Add and edit tasks in a modal dialog
- Delete tasks with confirmation dialog
- Filter tasks by status, priority and name
- Task statistics cards (total, pending, in progress, done) — clickable to filter by status
- Clear all filters button — appears only when a filter is active, no layout jump
- Showing X of Y tasks count when filters are active
- Keyboard accessible stat cards — Tab, Enter and Space support
- Dirty check — warns before discarding unsaved changes
- Data persists with localStorage

## What I learned

### Angular
- `ng add @angular/material` — install and configure Angular Material
- `MatButtonModule` — `matButton`, `matIconButton`, `matFab` button variants
- `MatSelectModule` + `MatFormFieldModule` — styled dropdowns with Material styling
- `MatTableModule` — `mat-table`, `matColumnDef`, `displayedColumns`, `*matCellDef`, `*matHeaderCellDef`
- Multi-filter with `computed()` — `'all'` option + `||` short-circuit pattern
- Coordinator pattern — page component owns all state; child components only receive data and emit events
- TypeScript union types — `'pending' | 'in-progress' | 'done'` for strict typing
- Separate filter types — `FilterStatus` and `TaskStatus` to avoid invalid values in filters
- `MatDialogModule` + `MatDialog` — open a modal dialog from a service with `dialog.open()`
- `MatDialogRef` — injected inside the dialog to close it and optionally return data
- `MAT_DIALOG_DATA` + `inject<Type>()` — inject data passed from the parent into the dialog component
- `patchValue()` — pre-fill a reactive form with existing data for edit flows
- Dialog data flow — `dialogRef.close(task)` inside the dialog, `afterClosed().subscribe()` in the parent
- `input()` / `output()` — signal-based parent-child communication, child emits events up to the page
- Reactive forms inside a dialog — `FormGroup`, `FormControl`, `Validators`, `[formGroup]`, `formControlName`
- `NgClass` — apply CSS classes dynamically based on component data
- CRUD pattern — add, edit, and delete tasks through a service with `signal.update()`
- `*matNoDataRow` — Angular Material directive that shows a row when the table has no data
- `mat-error` — displays a validation error inside `mat-form-field` with Material styling; pair with `hasError()` and `touched`
- Optional TypeScript fields — `description?: string` makes a field optional in an interface (no `Validators.required` needed)
- `MatTableDataSource` — wrapper around an array that handles sorting, filtering and pagination automatically
- `MatSort` + `mat-sort-header` — sortable column headers; click to sort ascending, again to reverse, again to clear
- `@ViewChild` — gets a reference to a directive or element in the template from TypeScript
- `ngAfterViewInit` — lifecycle hook that runs after the template is ready; the earliest safe moment to use `@ViewChild` references
- `ErrorStateMatcher` — controls when `mat-error` appears; custom implementation to show errors only on submit
- Confirmation dialog pattern — reusable dialog that returns `true` on confirm; open it before any destructive action
- `autoFocus: false` — disables Angular Material's default behaviour of focusing the first button when a dialog opens
- `computed()` for derived statistics — filter a signal array and return `.length` for live counts
- `input<boolean>()` — pass context from parent to child to change child behaviour (e.g. contextual empty state message)
- Angular view encapsulation — component CSS only applies to the component's own template; internal elements of Material directives need global `styles.css`
- `justify-content: center` on `.mat-sort-header-container` — centers sort header text; must go in `styles.css`, not component CSS

### Angular Material theming
- `mat.theme()` in `material-theme.scss` — set palette, typography and density once for the whole app
- Prebuilt palettes — `mat.$violet-palette`, `mat.$red-palette` and others from the `@angular/material` package
- Context-specific themes — scope `mat.theme()` to a CSS class to apply a different palette to one component (e.g. `.btn-danger`)
- `--mat-sys-*` CSS variables — Material's design token system; use in your own component CSS to match the theme
- `mat.button-overrides()` — fine-grained token customisation for specific button properties

### CSS
- `border-radius: 9999px` — pill shape for badges
- `display: inline-block` on `<span>` — allows padding on inline elements
- `text-transform: capitalize` — capitalise the first letter without changing the data
- CSS custom properties in `:root` — define semantic colors once, reuse across components (badge colors)
- When to use `--mat-sys-*` vs custom CSS variables — Material variables for theme-aware colors, custom variables for business logic colors (status, priority)
- Context-specific theme classes defined in `material-theme.scss` and applied in component templates
- `table-layout: fixed` — makes all table columns equal width; combine with `width: 100%`
- `.mat-column-*` — auto-generated class per column; use to set width or alignment per column
- CSS grid — `display: grid`, `grid-template-columns: 1fr 1fr`, `gap` — two-column layout for dialog forms
- `grid-column: 1 / -1` — span a grid item across all columns (description field and dialog actions)
- `align-items: center` on `flex-direction: column` — centers children **horizontally** (not vertically)
- `td.class` vs `.class td` — `td.class` targets a `<td>` that has the class; `.class td` targets a `<td>` inside an element with the class
- `position: relative` + `position: absolute` — take an element out of the flex flow so it does not affect alignment of siblings
- Angular view encapsulation — component CSS only applies to elements in that component's own template; use `styles.css` for Material internal elements

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
ng serve
```

Open your browser at `http://localhost:4200`
