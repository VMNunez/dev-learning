import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../shared/components/confirm-dialog/confirm-dialog';
import { EmployeeDialog } from './components/employee-dialog/employee-dialog';
import { EmployeeService } from '../../core/services/employee.service';
import type { Employee } from '../../models/employee.model';
import { EmployeeTable } from './components/employee-table/employee-table';
import { EmployeeFilters } from './components/employee-filters/employee-filters';
import { DepartmentService } from '../../core/services/department.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee-page',
  imports: [MatButtonModule, EmployeeTable, EmployeeFilters],
  templateUrl: './employee-page.html',
  styleUrl: './employee-page.css',
})
export class EmployeePage implements OnInit {
  private route = inject(ActivatedRoute);
  private employeeService = inject(EmployeeService);
  private departmentService = inject(DepartmentService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  employees = this.employeeService.employees;
  departments = this.departmentService.departments;
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

  totalEmployees = computed(() => this.employees().length);
  totalFilteredEmployees = computed(() => this.filteredEmployees().length);

  hasActiveFilters = computed(
    () =>
      this.searchTerm() !== '' || this.selectedDepartment() !== '' || this.selectedStatus() !== '',
  );

  ngOnInit(): void {
    const initialStatus = this.route.snapshot.queryParamMap.get('status');

    if (initialStatus) {
      this.selectedStatus.set(initialStatus);
    }
  }

  updateSearchTerm(term: string) {
    this.searchTerm.set(term);
  }

  updateDepartment(department: string) {
    this.selectedDepartment.set(department);
  }

  updateStatus(status: string) {
    this.selectedStatus.set(status);
  }

  clearFilters() {
    this.searchTerm.set('');
    this.selectedDepartment.set('');
    this.selectedStatus.set('');
  }

  openDialog() {
    const dialogRef = this.dialog.open(EmployeeDialog, {
      width: '500px',
      autoFocus: false,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe({
      next: (newEmployee) => {
        if (newEmployee) {
          this.employeeService.addEmployee(newEmployee);
          this.snackBar.open('Employee added', 'Close', { duration: 3000 });
        }
      },
    });
  }

  onDelete(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '500px',
      autoFocus: false,
      data: {
        title: 'Delete Employee',
        message: 'Are you sure you want to delete this employee?',
        cancelLabel: 'Cancel',
        confirmLabel: 'Delete',
      },
    });

    dialogRef.afterClosed().subscribe({
      next: (confirmed) => {
        if (confirmed) {
          this.employeeService.deleteEmployee(id);
          this.snackBar.open('Employee deleted', 'Close', { duration: 3000 });
        }
      },
    });
  }

  onEdit(employee: Employee) {
    const dialogRef = this.dialog.open(EmployeeDialog, {
      width: '500px',
      autoFocus: false,
      disableClose: true,
      data: {
        employee,
      },
    });

    dialogRef.afterClosed().subscribe({
      next: (updatedEmployee) => {
        if (updatedEmployee) {
          this.employeeService.editEmployee(updatedEmployee);
          this.snackBar.open('Employee updated', 'Close', { duration: 3000 });
        }
      },
    });
  }
}
