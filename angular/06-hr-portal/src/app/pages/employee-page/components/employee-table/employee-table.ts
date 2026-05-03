import { AfterViewInit, ViewChild, Component, effect, input, output } from '@angular/core';
import { NgClass, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import type { Employee } from '../../../../models/employee.model';

@Component({
  selector: 'app-employee-table',
  imports: [
    MatTableModule,
    NgClass,
    DatePipe,
    MatIconModule,
    MatButtonModule,
    MatSortModule,
    MatPaginatorModule,
  ],
  templateUrl: './employee-table.html',
  styleUrl: './employee-table.css',
})
export class EmployeeTable implements AfterViewInit {
  employees = input<Employee[]>([]);
  hasActiveFilters = input<boolean>(false);
  datasource = new MatTableDataSource<Employee>([]);
  employeeId = output<number>();
  updatedEmployee = output<Employee>();

  displayedColumns = [
    'firstName',
    'lastName',
    'email',
    'department',
    'position',
    'startDate',
    'status',
    'actions',
  ];

  constructor() {
    effect(() => {
      this.datasource.data = this.employees() as Employee[];
    });
  }

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }

  deleteEmployee(id: number) {
    this.employeeId.emit(id);
  }

  editEmployee(employee: Employee) {
    this.updatedEmployee.emit(employee);
  }
}
