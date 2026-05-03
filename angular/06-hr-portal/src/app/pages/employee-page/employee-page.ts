import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from './components/confirm-dialog/confirm-dialog';
import { EmployeeDialog } from './components/employee-dialog/employee-dialog';
import { EmployeeService } from '../../core/services/employee.service';

import type { Employee } from '../../models/employee.model';
import { EmployeeTable } from './components/employee-table/employee-table';
import { EmployeeFilters } from './components/employee-filters/employee-filters';

@Component({
  selector: 'app-employee-page',
  imports: [MatButtonModule, EmployeeTable, EmployeeFilters],
  templateUrl: './employee-page.html',
  styleUrl: './employee-page.css',
})
export class EmployeePage {
  private employeeService = inject(EmployeeService);
  private dialog = inject(MatDialog);
  employees = this.employeeService.employees;
  searchTerm = signal<string>('');
  selectedDepartment = signal<string>('');
  selectedStatus = signal<string>('');
  filteredEmployees = computed(() => {
    return this.employees().filter((employee) => {
      const searchTermMatch =
        this.searchTerm() === '' ||
        employee.firstName.toLowerCase().trim().includes(this.searchTerm().toLowerCase().trim()) ||
        employee.lastName.toLowerCase().trim().includes(this.searchTerm().toLowerCase().trim());

      const departmentMatch =
        this.selectedDepartment() === '' || employee.department === this.selectedDepartment();

      const statusMatch = this.selectedStatus() === '' || employee.status === this.selectedStatus();

      return searchTermMatch && departmentMatch && statusMatch;
    });
  });

  departments = computed(() => {
    return [...new Set(this.employees().map((employee) => employee.department))];
  });

  hasActiveFilters = computed(
    () =>
      this.searchTerm() !== '' || this.selectedDepartment() !== '' || this.selectedStatus() !== '',
  );

  updateSearchTerm(term: string) {
    this.searchTerm.set(term);
  }

  updateDepartment(department: string) {
    this.selectedDepartment.set(department);
  }

  updateStatus(status: string) {
    this.selectedStatus.set(status);
  }
  openDialog() {
    const dialogRef = this.dialog.open(EmployeeDialog, {
      width: '500px',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe({
      next: (newEmployee) => {
        if (newEmployee) {
          this.employeeService.addEmployee(newEmployee);
        }
      },
    });
  }

  onDelete(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '500px',
      data: {
        title: 'Delete Employee',
        message: 'Are you sure you want to delete this employee?',
      },
    });

    dialogRef.afterClosed().subscribe({
      next: (confirmed) => {
        if (confirmed) this.employeeService.deleteEmployee(id);
      },
    });
  }

  onEdit(employee: Employee) {
    const dialogRef = this.dialog.open(EmployeeDialog, {
      width: '500px',
      data: {
        employee,
      },
    });

    dialogRef.afterClosed().subscribe({
      next: (updatedEmployee) => {
        if (updatedEmployee) {
          this.employeeService.editEmployee(updatedEmployee);
        }
      },
    });
  }
}
