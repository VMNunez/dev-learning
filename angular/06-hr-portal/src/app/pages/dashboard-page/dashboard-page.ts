import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EmployeeService } from '../../core/services/employee.service';
import { DepartmentService } from '../../core/services/department.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard-page',
  imports: [MatCardModule],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage {
  private employeeService = inject(EmployeeService);
  private departmentService = inject(DepartmentService);

  employees = this.employeeService.employees;
  departments = this.departmentService.departments;

  totalEmployees = computed(() => {
    return this.employees().length;
  });
  activeEmployees = computed(() => {
    return this.employees().filter((employee) => employee.status === 'active').length;
  });
  totalDepartments = computed(() => {
    return this.departments().length;
  });
}
