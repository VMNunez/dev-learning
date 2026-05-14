# Angular Material — MatPaginator

`MatPaginator` adds page controls to a table. It works with `MatTableDataSource` the same way `MatSort` does — you connect it in `ngAfterViewInit`.

Official docs: https://material.angular.io/components/paginator/overview

---

## Setup

Add `MatPaginatorModule` to the component imports:

```typescript
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  imports: [MatTableModule, MatSortModule, MatPaginatorModule],
  ...
})
```

---

## Template

Add `<mat-paginator>` below the table:

```html
<table mat-table [dataSource]="dataSource" matSort>
  <!-- columns... -->
</table>

<mat-paginator
  [pageSize]="10"
  [pageSizeOptions]="[5, 10, 25]"
  showFirstLastButtons
/>
```

| Input | What it does |
| --- | --- |
| `[pageSize]` | Default number of rows per page |
| `[pageSizeOptions]` | Options the user can pick from the dropdown |
| `showFirstLastButtons` | Adds first/last page buttons |

---

## Connect to the data source

Use `@ViewChild` and connect in `ngAfterViewInit` — the same pattern as `MatSort`:

```typescript
import { ViewChild, AfterViewInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

export class EmployeeListComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<Employee>();

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
```

Once connected, `MatTableDataSource` handles slicing the data automatically — you do not need to change anything else.

---

## Reset to page 1 after filtering

When the user applies a filter, reset the paginator so they always see page 1:

```typescript
applyFilter(value: string) {
  this.dataSource.filter = value.trim().toLowerCase();
  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}
```

Without this, if the user is on page 3 and then filters, the table shows page 3 of the filtered results — which is often empty and confusing.
