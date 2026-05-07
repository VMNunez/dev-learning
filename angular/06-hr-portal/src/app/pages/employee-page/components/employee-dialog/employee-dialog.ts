import { Component, inject } from '@angular/core';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Employee } from '../../../../models/employee.model';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { DepartmentService } from '../../../../core/services/department.service';
import { EmployeeService } from '../../../../core/services/employee.service';

@Component({
  selector: 'app-employee-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormField,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './employee-dialog.html',
  styleUrl: './employee-dialog.css',
})
export class EmployeeDialog {
  private departmentService = inject(DepartmentService);
  private employeeService = inject(EmployeeService);
  private dialogRef = inject(MatDialogRef);
  private dialog = inject(MatDialog);
  data = inject<{ employee: Employee } | undefined>(MAT_DIALOG_DATA);
  departments = this.departmentService.departments;

  newEmployeeForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    department: new FormControl('', Validators.required),
    position: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
  });

  constructor() {
    if (this.data) {
      const { firstName, lastName, email, department, position, status } = this.data.employee;
      this.newEmployeeForm.patchValue({
        firstName,
        lastName,
        email,
        department,
        position,
        status,
      });
    }
  }

  get firstName() {
    return this.newEmployeeForm.get('firstName');
  }
  get lastName() {
    return this.newEmployeeForm.get('lastName');
  }

  get email() {
    return this.newEmployeeForm.get('email');
  }
  get department() {
    return this.newEmployeeForm.get('department');
  }
  get position() {
    return this.newEmployeeForm.get('position');
  }
  get status() {
    return this.newEmployeeForm.get('status');
  }

  onSubmit() {
    this.newEmployeeForm.markAllAsTouched();

    if (this.newEmployeeForm.valid) {
      const formValue = this.newEmployeeForm.value;

      const isDuplicate = this.employeeService.emailExists(
        formValue.email as string,
        this.data?.employee.id,
      );

      if (isDuplicate) {
        this.newEmployeeForm.controls.email.setErrors({ duplicateEmail: true });
        return;
      }
      const newEmployee: Omit<Employee, 'id' | 'startDate'> = {
        firstName: formValue.firstName as string,
        lastName: formValue.lastName as string,
        email: formValue.email as string,
        department: formValue.department as string,
        position: formValue.position as string,
        status: formValue.status as 'active' | 'inactive',
      };
      if (this.data) {
        this.dialogRef.close({
          ...newEmployee,
          id: this.data.employee.id,
          startDate: this.data.employee.startDate,
        });
      } else {
        this.dialogRef.close({
          ...newEmployee,
          startDate: new Date().toISOString().split('T')[0],
        });
      }
    }
  }

  onCancel() {
    if (this.newEmployeeForm.dirty) {
      const dialogRef = this.dialog.open(ConfirmDialog, {
        width: '500px',
        autoFocus: false,
        data: {
          title: 'Discard changes?',
          message: 'You have unsaved changes. If you leave, they will be lost',
          cancelLabel: 'Keep Editing',
          confirmLabel: 'Discard Changes',
        },
      });

      dialogRef.afterClosed().subscribe({
        next: (confirmed) => {
          if (confirmed) {
            this.dialogRef.close();
          }
        },
      });
    } else {
      this.dialogRef.close();
    }
  }
}
