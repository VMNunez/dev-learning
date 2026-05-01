import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { EmployeeService } from '../../core/services/employee.service';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeDialog } from './components/employee-dialog/employee-dialog';
import { ConfirmDialog } from './components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-employee-page',
  imports: [MatButtonModule, MatTableModule],
  templateUrl: './employee-page.html',
  styleUrl: './employee-page.css',
})
export class EmployeePage {
  private employeeService = inject(EmployeeService);
  private dialog = inject(MatDialog);

  employees = this.employeeService.employees;
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
}
