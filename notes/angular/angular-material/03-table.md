# Angular Material — Table

Official docs: https://material.angular.io/components/table/overview

Add this to the component's imports array:

```typescript
import { MatTableModule } from '@angular/material/table';
```

## Basic usage

To create a Material table you need four things:

**1. `displayedColumns` in the component** — an array of strings that defines which columns exist and in what order:
```typescript
displayedColumns = ['name', 'status', 'priority', 'assignee', 'createdAt', 'actions'];
```

**2. `<table mat-table>` in the template** — `mat-table` is an attribute that turns a native `<table>` into a Material table, applying Material styles and enabling the column definition system. `[dataSource]` receives the data — usually a signal or computed array. Each item in the array becomes one row:
```html
<table mat-table [dataSource]="filteredTasks()">
```

**3. One `ng-container` per column** — a `ng-container` that holds the column definition, identified by the `matColumnDef` attribute. The value of `matColumnDef` must match exactly one string in `displayedColumns`:

```html
<ng-container matColumnDef="name">
```

Inside each container:
- `<th mat-header-cell *matHeaderCellDef>` — `mat-header-cell` marks this `<th>` as a Material header cell, applying the correct styles. `*matHeaderCellDef` tells Angular this is the template to use for the header of this column.
- `<td mat-cell *matCellDef="let task">` — `mat-cell` marks this `<td>` as a Material data cell. `*matCellDef="let task"` gives you access to the current row's object as `task`, so you can display `{{ task.name }}`, `{{ task.status }}`, etc.

```html
<ng-container matColumnDef="name">
  <th mat-header-cell *matHeaderCellDef>Name</th>
  <td mat-cell *matCellDef="let task">{{ task.name }}</td>
</ng-container>
```

**4. Two `<tr>` rows at the bottom** — these tell Angular to actually render the table using the definitions above:
- `<tr mat-header-row *matHeaderRowDef="displayedColumns">` — renders the header row.
- `<tr mat-row *matRowDef="let row; columns: displayedColumns">` — renders one data row per item in `dataSource`.

Both always reference `displayedColumns` — it is the single source of truth for the table. To add or remove a column, you only update `displayedColumns` and add or remove its `ng-container`. The `<tr>` rows never change.

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
      <button matIconButton aria-label="Edit"><mat-icon>edit</mat-icon></button>
      <button matIconButton aria-label="Delete"><mat-icon>delete</mat-icon></button>
    </td>
  </ng-container>

  <!-- Always at the bottom — renders the header and data rows -->
  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>

</table>
```

## Note

If `dataSource` is empty, the table renders the header but no rows — that is expected behaviour, not a bug.