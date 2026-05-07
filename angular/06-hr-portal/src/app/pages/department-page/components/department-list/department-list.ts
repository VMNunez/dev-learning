import { AfterViewInit, Component, effect, input, output, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import type { Department } from '../../../../models/department.model';
import { RouterLink } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-department-list',
  imports: [
    MatTableModule,
    MatButtonModule,
    RouterLink,
    MatPaginatorModule,
    MatIconModule,
    MatSort,
    MatSortModule,
  ],
  templateUrl: './department-list.html',
  styleUrl: './department-list.css',
})
export class DepartmentList implements AfterViewInit {
  departments = input<Department[]>([]);
  datasource = new MatTableDataSource<Department>([]);
  delete = output<number>();
  displayedColumns = ['name', 'description', 'actions'];

  constructor() {
    effect(() => {
      this.datasource.data = this.departments();
    });
  }

  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }

  onDelete(id: number) {
    this.delete.emit(id);
  }
}
