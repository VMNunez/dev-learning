import { Component, effect, input, output } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import type { Department } from '../../../../models/department.model';

@Component({
  selector: 'app-department-list',
  imports: [MatTableModule, MatButtonModule],
  templateUrl: './department-list.html',
  styleUrl: './department-list.css',
})
export class DepartmentList {
  departments = input<Department[]>([]);
  datasource = new MatTableDataSource<Department>([]);
  edit = output<Department>();
  delete = output<number>();
  displayedColumns = ['name', 'description', 'actions'];

  constructor() {
    effect(() => {
      this.datasource.data = this.departments();
    });
  }

  onEdit(department: Department) {
    this.edit.emit(department);
  }

  onDelete(id: number) {
    this.delete.emit(id);
  }
}
