import { Component, inject, signal } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { Employee } from '../../../../models/employee.model';
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
  private dialogRef = inject(MatDialogRef);
  emailAlreadyExists = signal<boolean>(false);

  newEmployeeForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    department: new FormControl('', Validators.required),
    position: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
  });

  firstName() {
    return this.newEmployeeForm.get('firstName');
  }
  lastName() {
    return this.newEmployeeForm.get('lastName');
  }

  email() {
    return this.newEmployeeForm.get('email');
  }
  department() {
    return this.newEmployeeForm.get('department');
  }
  position() {
    return this.newEmployeeForm.get('position');
  }
  status() {
    return this.newEmployeeForm.get('status');
  }

  onSubmit() {
    this.newEmployeeForm.markAllAsTouched();
    this.emailAlreadyExists.set(false);
    if (this.newEmployeeForm.valid) {
      const formValue = this.newEmployeeForm.value;
      const newEmployee: Omit<Employee, 'id'> = {
        firstName: formValue.firstName as string,
        lastName: formValue.lastName as string,
        email: formValue.email as string,
        department: formValue.department as string,
        position: formValue.position as string,
        startDate: new Date().toISOString().split('T')[0],
        status: formValue.status as 'active' | 'inactive',
      };

      this.dialogRef.close(newEmployee);
    }
  }
}
