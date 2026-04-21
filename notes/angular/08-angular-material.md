# Angular — Angular Material

Official docs: https://material.angular.io/

## What is Angular Material

A component library made by the Angular team. It gives you ready-made UI components — buttons, tables, dialogs, forms — that follow Google's Material Design guidelines.

Used in enterprise Angular apps in Spain (NTT Data, Capgemini, etc.).

## Install

```bash
ng add @angular/material
```

This installs the package and updates `angular.json` and `styles.css` automatically. Choose a color theme when prompted.

## How to use components

Each component has its own import. Import only what you need in your component's `imports` array.

```typescript
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
```

---

## Button — `matButton`

```html
<button matButton>Text</button>
<button matButton="filled">Filled</button>
<button matButton="outlined">Outlined</button>
<button matButton="elevated">Elevated</button>
```

Import: `MatButtonModule` from `@angular/material/button`

---

## Select (dropdown) — `mat-select`

Three components work together:

```html
<mat-form-field>
  <mat-label>Status</mat-label>
  <mat-select (selectionChange)="onStatusChange($event.value)">
    <mat-option value="all">All</mat-option>
    <mat-option value="pending">Pending</mat-option>
    <mat-option value="in-progress">In Progress</mat-option>
    <mat-option value="done">Done</mat-option>
  </mat-select>
</mat-form-field>
```

| Component | Role |
|-----------|------|
| `mat-form-field` | Wrapper — gives the Material style (border, label) |
| `mat-label` | Label inside the field |
| `mat-select` | The dropdown |
| `mat-option` | Each option inside the dropdown |

Import: `MatSelectModule` from `@angular/material/select` — includes `MatOption` automatically.

`selectionChange` fires when the user picks an option. Use `$event.value` to get the selected value.

---

## Form Field — `mat-form-field`

Wraps inputs and selects to give them Material styling. Always use it with `mat-label`.

Import: `MatFormFieldModule` from `@angular/material/form-field`

---

## Table — `mat-table`

Import: `MatTableModule` from `@angular/material/table`

In the component, define which columns to show:

```typescript
displayedColumns = ['name', 'status', 'priority', 'assignee', 'createdAt', 'actions'];
```

In the template, each column needs its own `ng-container` with a matching `matColumnDef`. The string in `matColumnDef` must match exactly one entry in `displayedColumns`.

```html
<table mat-table [dataSource]="filteredTasks()">

  <!-- One ng-container per column -->
  <ng-container matColumnDef="name">
    <th mat-header-cell *matHeaderCellDef>Name</th>
    <td mat-cell *matCellDef="let task">{{ task.name }}</td>
  </ng-container>

  <ng-container matColumnDef="status">
    <th mat-header-cell *matHeaderCellDef>Status</th>
    <td mat-cell *matCellDef="let task">{{ task.status }}</td>
  </ng-container>

  <!-- actions column — put buttons here -->
  <ng-container matColumnDef="actions">
    <th mat-header-cell *matHeaderCellDef>Actions</th>
    <td mat-cell *matCellDef="let task">
      <button matButton>Edit</button>
      <button matButton>Delete</button>
    </td>
  </ng-container>

  <!-- Always at the bottom — renders the header and data rows -->
  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>

</table>
```

### What each part does

| Part | Role |
|------|------|
| `matColumnDef="name"` | Names the column — must match a string in `displayedColumns` |
| `mat-header-cell` | Marks this `<th>` as the header cell for this column |
| `*matHeaderCellDef` | Structural directive — tells Angular this is the template for the header |
| `mat-cell` | Marks this `<td>` as a data cell for this column |
| `*matCellDef="let task"` | Structural directive — gives you access to the current row's data as `task` |
| `mat-header-row` | Renders the header row using the header cells defined above |
| `*matHeaderRowDef="displayedColumns"` | Tells Angular which columns to include in the header row |
| `mat-row` | Renders one data row per item in `dataSource` |
| `*matRowDef="let row; columns: displayedColumns"` | Tells Angular which columns to include in each data row |

Think of it like this:
- `ng-container matColumnDef` — defines what one column looks like (header + cell)
- `mat-header-row` and `mat-row` at the bottom — tell Angular to actually render the rows using those definitions

**Rules:**
- Every string in `displayedColumns` must have a matching `matColumnDef`
- `mat-header-row` and `mat-row` must always be at the bottom of the table
- The table shows no rows if `dataSource` is empty — that is expected
