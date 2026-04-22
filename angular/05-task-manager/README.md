# 05 — Task Manager

My fifth Angular project. A task management app to learn Angular Material and CRUD patterns.

**Live demo:** coming soon

## Features

- List tasks in a Material table
- Add and edit tasks in a modal dialog
- Delete tasks with confirmation
- Filter tasks by status
- Data persists with localStorage

## What I learned

### Angular
- `ng add @angular/material` — install and configure Angular Material
- `MatButtonModule` — `matButton`, `matIconButton`, `matFab` button variants
- `MatSelectModule` + `MatFormFieldModule` — styled dropdowns with Material styling
- `MatTableModule` — `mat-table`, `matColumnDef`, `displayedColumns`, `*matCellDef`, `*matHeaderCellDef`
- Multi-filter with `computed()` — `'all'` option + `||` short-circuit pattern
- `takeUntilDestroyed` — cancel HTTP subscriptions when a component is destroyed
- `DestroyRef` — Angular token to notify observables of component lifecycle end
- Component split — page as coordinator, table and filters as separate components
- TypeScript union types — `'pending' | 'in-progress' | 'done'` for strict typing
- Separate filter types — `FilterStatus` and `TaskStatus` to avoid invalid values

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