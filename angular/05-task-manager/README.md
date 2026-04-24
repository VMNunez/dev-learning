# 05 — Task Manager

My fifth Angular project. A task management app to learn Angular Material and CRUD patterns.

**Live demo:** coming soon

## Features

- List tasks in a Material table
- Add and edit tasks in a modal dialog
- Delete tasks
- Filter tasks by status and priority
- Data persists with localStorage

## What I learned

### Angular
- `ng add @angular/material` — install and configure Angular Material
- `MatButtonModule` — `matButton`, `matIconButton`, `matFab` button variants
- `MatSelectModule` + `MatFormFieldModule` — styled dropdowns with Material styling
- `MatTableModule` — `mat-table`, `matColumnDef`, `displayedColumns`, `*matCellDef`, `*matHeaderCellDef`
- Multi-filter with `computed()` — `'all'` option + `||` short-circuit pattern
- Component split — page as coordinator, child components for table and filters
- TypeScript union types — `'pending' | 'in-progress' | 'done'` for strict typing
- Separate filter types — `FilterStatus` and `TaskStatus` to avoid invalid values in filters
- `MatDialogModule` + `MatDialog` — open a modal dialog from a service with `dialog.open()`
- `MatDialogRef` — injected inside the dialog to close it and optionally return data
- Dialog data flow — `dialogRef.close(task)` inside the dialog, `afterClosed().subscribe()` in the parent
- `input()` / `output()` — signal-based parent-child communication, child emits events up to the page
- Reactive forms inside a dialog — `FormGroup`, `FormControl`, `Validators`, `[formGroup]`, `formControlName`
- CRUD pattern — add, edit, and delete tasks through a service with `signal.update()`

### CSS

## Tech stack

- Angular 21
- TypeScript
- CSS
- Angular Material

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