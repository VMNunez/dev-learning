# Angular Material — Table

Official docs: https://material.angular.io/components/table/overview

Add this to the component's imports array:

```typescript
import { MatTableModule } from '@angular/material/table';
```

## Basic usage

Start by adding the imports to the component:

```typescript
import { MatTableModule } from '@angular/material/table';

@Component({
  imports: [MatTableModule],
  ...
})
```

To create a Material table you need four things:

**1. `displayedColumns` in the component** — an array of strings that defines which columns exist and in what order:

```typescript
displayedColumns = ['name', 'status', 'priority', 'assignee', 'createdAt', 'actions'];
```

**2. `<table mat-table>` in the template** — `mat-table` is an attribute that turns a native `<table>` into a Material table, applying Material styles and enabling the column definition system. `[dataSource]` receives the data — usually a signal or computed array. Each item in the array becomes one row:

```html
<table mat-table [dataSource]="filteredTasks()"></table>
```

**3. One `ng-container` per column** — a `ng-container` that holds the column definition, identified by the `matColumnDef` attribute. The value of `matColumnDef` must match exactly one string in `displayedColumns`:

```html
<ng-container matColumnDef="name"></ng-container>
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

## Empty state — \*matNoDataRow

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

When your data comes from a signal input, use `effect()` to keep the data source in sync. The property you always update is `dataSource.data` — that is the array `MatTableDataSource` reads internally.

```typescript
// tasks is an input signal — data arrives from the parent component
tasks = input<Task[]>([]);

constructor() {
  effect(() => {
    this.dataSource.data = this.tasks(); // always assign to .data, not to dataSource directly
  });
}
```

Pass the data source to the table instead of the signal:

```html
<table mat-table [dataSource]="dataSource"></table>
```

---

## Sorting — MatSort

Official docs: https://material.angular.io/components/sort/overview

Add `MatSortModule` to the component imports:

```typescript
import { MatSortModule } from '@angular/material/sort';

@Component({
  imports: [MatTableModule, MatSortModule],
  ...
})
```

Then add `matSort` to the table and `mat-sort-header` to each sortable column header:

```html
<table mat-table [dataSource]="dataSource" matSort>
  <ng-container matColumnDef="name">
    <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
    <td mat-cell *matCellDef="let task">{{ task.name }}</td>
  </ng-container>
</table>
```

> `mat-sort-header` goes on the `<th>` element, not on `ng-container`. The `ng-container` is just a wrapper with no visual output.

**Which columns make sense to sort?** Only columns where alphabetical or chronological order is meaningful. Good candidates: `name`, `createdAt`, `assignee`. Avoid sorting on `status` or `priority` if they have custom logic — a simple alphabetical sort would not put them in logical order.

### Why @ViewChild and ngAfterViewInit?

To connect `MatSort` to `MatTableDataSource`, you need a reference to the `MatSort` directive that lives in the template.

**Without `@ViewChild(MatSort) sort!: MatSort`** — TypeScript cannot access anything inside the HTML template. The `sort` variable would be `undefined`.

**Without `ngAfterViewInit`** — if you try to use `this.sort` in the constructor, it is `undefined` because Angular has not built the template yet. `ngAfterViewInit` runs exactly when the template is ready, so `this.sort` is guaranteed to exist.

**Without `this.dataSource.sort = this.sort`** — clicking a column header changes the sort arrow visually, but the data does NOT actually re-sort. `MatTableDataSource` does not know which `MatSort` to listen to until you connect them.

```typescript
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';

export class TaskTable implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort; // get a reference to the MatSort in the template

  ngAfterViewInit() {
    this.dataSource.sort = this.sort; // now MatTableDataSource knows which MatSort to use
  }
}
```

### `sortActionDescription` — accessibility

Add a description to each sortable header so screen readers can announce what the column sorts by:

```html
<th mat-header-cell *matHeaderCellDef mat-sort-header sortActionDescription="Sort by name">Name</th>
```

### `LiveAnnouncer` — accessibility announcements

> You do not need to memorize this — it comes directly from the Angular Material docs example. Add it only if your app needs full screen reader accessibility.

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
<table matSort (matSortChange)="announceSortChange($event)"></table>
```

---

## Empty state — contextual messages

The `*matNoDataRow` shows whenever there are no rows — both when the table has no data at all, and when a filter finds nothing. To show a different message in each case, pass a boolean input from the parent:

```typescript
// task-table.ts
hasTasks = input<boolean>(false);
```

```html
<!-- task-page.html -->
<app-task-table [hasTasks]="totalTasks() > 0" ... />
```

```html
<!-- task-table.html -->
<p>{{ hasTasks() ? 'No tasks match your filters' : 'No tasks yet' }}</p>
<p>{{ hasTasks() ? 'Try adjusting your filters' : 'Add your first task to get started' }}</p>
```

---

## Centering sort header text — view encapsulation

When you apply `text-align: center` to a column, it centres the data cells (`<td>`) but NOT the sort header. The sort header renders its content inside a flex container (`.mat-sort-header-container`) created by the Angular Material directive. Component CSS cannot reach it because of **Angular view encapsulation**.

**What is view encapsulation?** Angular adds a unique attribute (e.g. `_ngcontent-abc-123`) to every element in a component's template, and modifies its CSS selectors to only match elements with that attribute. Elements created by directives (like `mat-sort-header`) do not get that attribute — so component CSS rules never match them.

**The fix** — put the rule in **`styles.css`** (no encapsulation):

```css
/* styles.css */
.mat-column-assignee .mat-sort-header-container,
.mat-column-createdAt .mat-sort-header-container {
  justify-content: center;
}
```

> Component CSS → for your own template elements. Global `styles.css` → for Material directive internals.

---

## Pagination — MatPaginator

Official docs: https://material.angular.io/components/paginator/overview

`MatPaginator` works the same way as `MatSort` — you connect it to `MatTableDataSource` via `@ViewChild` in `ngAfterViewInit`.

```typescript
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@ViewChild(MatPaginator) paginator!: MatPaginator;

ngAfterViewInit() {
  this.dataSource.sort = this.sort;
  this.dataSource.paginator = this.paginator;
}
```

Add `MatPaginatorModule` to the component's `imports` array.

In the template, place `<mat-paginator>` **outside and after** the `</table>` closing tag — they are separate elements:

```html
</table>

<mat-paginator
  [pageSizeOptions]="[5, 10, 25]"
  showFirstLastButtons
  aria-label="Select page"
>
</mat-paginator>
```

| Attribute              | What it does                                   |
| ---------------------- | ---------------------------------------------- |
| `[pageSizeOptions]`    | Array of page size options the user can choose |
| `showFirstLastButtons` | Adds first/last page buttons                   |
| `aria-label`           | Accessibility label for screen readers         |

`MatTableDataSource` handles the rest automatically — when the user changes the page, the table updates.
