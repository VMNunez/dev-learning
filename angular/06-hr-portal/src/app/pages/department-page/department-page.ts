import { Component, inject } from '@angular/core';
import { DepartmentService } from '../../core/services/department.service';
import { DepartmentList } from './components/department-list/department-list';
import type { Department } from '../../models/department.model';
import { MatAnchor } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-department-page',
  imports: [DepartmentList, MatAnchor, RouterLink],
  templateUrl: './department-page.html',
  styleUrl: './department-page.css',
})
export class DepartmentPage {
  private departmentService = inject(DepartmentService);
  departments = this.departmentService.departments;

  onEdit(department: Department) {
    this.departmentService.editDepartment(department);
  }

  onDelete(id: number) {
    this.departmentService.deleteDepartment(id);
  }
}
