import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EmployeeService } from '../../core/services/employee.service';
import { DepartmentService } from '../../core/services/department.service';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../core/services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LeaveRequestService } from '../../core/services/leave-request.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard-page',
  imports: [MatCardModule, MatButtonModule, RouterLink, MatIconModule, DatePipe],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage {
  private employeeService = inject(EmployeeService);
  private departmentService = inject(DepartmentService);
  private authService = inject(AuthService);
  private leaveRequestService = inject(LeaveRequestService);

  employees = this.employeeService.employees;
  departments = this.departmentService.departments;
  leaveRequests = this.leaveRequestService.leaveRequests;
  currentUser = this.authService.currentUser;

  isAdmin = computed(() => this.currentUser()?.role === 'admin');

  recentEmployees = computed(() => [...this.employees()].slice(-5).reverse());

  myLeaveRequests = computed(() =>
    this.leaveRequests().filter((r) => r.employeeEmail === this.currentUser()?.email),
  );

  username = computed(() => this.currentUser()?.email.split('@')[0]);

  totalEmployees = computed(() => {
    return this.employees().length;
  });
  activeEmployees = computed(() => {
    return this.employees().filter((employee) => employee.status === 'active').length;
  });
  totalDepartments = computed(() => {
    return this.departments().length;
  });

  pendingLeaveRequests = computed(() => this.leaveRequests().filter((r) => r.status === 'pending'));
}
