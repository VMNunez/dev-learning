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

## Empty state — *matNoDataRow

To show a message when the table has no data, add a row with `*matNoDataRow`:

```html
<tr class="no-data-row" *matNoDataRow>
  <td [attr.colspan]="displayedColumns.length">No tasks yet</td>
</tr>
```

`[attr.colspan]` makes the cell span all columns so the message is centred across the full table width.

---

## MatTableDataSource — sorting and filtering

Official docs: https://material.angular.io/components/table/overview#sorting

Instead of passing a plain array to `[dataSource]`, use `MatTableDataSource`. It is a wrapper that handles sorting, filtering, and pagination automatically.

```typescript
import { MatTableDataSource } from '@angular/material/table';

dataSource = new MatTableDataSource<Task>([]);
```

When your data comes from a signal input, use `effect()` to keep the data source in sync:

```typescript
constructor() {
  effect(() => {
    this.dataSource.data = this.tasks();
  });
}
```

Pass the data source to the table instead of the signal:

```html
<table mat-table [dataSource]="dataSource">
```

---

## Sorting — MatSort

Official docs: https://material.angular.io/components/sort/overview

Add `MatSortModule` to the component imports. Then add `matSort` to the table and `mat-sort-header` to each sortable column header:

```html
<table mat-table [dataSource]="dataSource" matSort>

  <ng-container matColumnDef="name">
    <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
    <td mat-cell *matCellDef="let task">{{ task.name }}</td>
  </ng-container>

</table>
```

> `mat-sort-header` goes on the `<th>` element, not on `ng-container`. The `ng-container` is just a wrapper with no visual output.

> Not all columns need to be sortable. Avoid `mat-sort-header` on columns where alphabetical order is meaningless (e.g. Status, Priority with custom logic).

To connect `MatSort` to the data source, use `@ViewChild` and `ngAfterViewInit`:

```typescript
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';

export class TaskTable implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}
```

**Why `@ViewChild`?** — gets a reference to the `MatSort` directive that lives in the template. Without it, TypeScript has no way to access what is in the HTML.

**Why `ngAfterViewInit`?** — `@ViewChild` references are only available after Angular builds the template. If you try to use `this.sort` in the constructor it is `undefined`. `ngAfterViewInit` runs exactly when the template is ready.

### `sortActionDescription` — accessibility

Add a description to each sortable header so screen readers can announce what the column sorts by:

```html
<th mat-header-cell *matHeaderCellDef mat-sort-header sortActionDescription="Sort by name">
  Name
</th>
```

### `LiveAnnouncer` — accessibility announcements

`LiveAnnouncer` (from `@angular/cdk/a11y`) announces sort changes to screen readers:

```typescript
import { LiveAnnouncer } from '@angular/cdk/a11y';

private liveAnnouncer = inject(LiveAnnouncer);

announceSortChange(sortState: Sort) {
  if (sortState.direction) {
    this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
  } else {
    this.liveAnnouncer.announce('Sorting cleared');
  }
}
```

```html
<table matSort (matSortChange)="announceSortChange($event)">
```

---

## Note

If `dataSource` is empty, the table renders the header but no rows — that is expected behaviour, not a bug.