import { Component, computed, inject } from '@angular/core';
import { EmployeeService } from '../../core/services/employee.service';
import { DepartmentService } from '../../core/services/department.service';
import { AuthService } from '../../core/services/auth.service';
import { LeaveRequestService } from '../../core/services/leave-request.service';
import { DatePipe } from '@angular/common';
import { StatCard } from './components/stat-card/stat-card';
import { DashboardPanel } from './components/dashboard-panel/dashboard-panel';
import { PanelItem } from './components/panel-item/panel-item';

@Component({
  selector: 'app-dashboard-page',
  imports: [DatePipe, StatCard, DashboardPanel, PanelItem],
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

  username = computed(() => {
    const match = this.employees().find((e) => e.email === this.currentUser()?.email);
    return match?.firstName ?? this.currentUser()?.email.split('@')[0];
  });

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
