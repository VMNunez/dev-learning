import { Component, inject } from '@angular/core';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Employee } from '../../../../models/employee.model';
import {
  ConfirmDialog,
  ConfirmDialogData,
} from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { DepartmentService } from '../../../../core/services/department.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { toLocalDateString } from '../../../../shared/utils/date.util';

/**
 * What the dialog is opened with. Present in edit mode, absent in create mode —
 * the `undefined` half is what `MAT_DIALOG_DATA` yields when no `data` is passed.
 */
export interface EmployeeDialogData {
  employee: Employee;
}

/**
 * What the dialog closes with. Derived from the domain model rather than restated,
 * so a new field on `Employee` cannot silently bypass this form.
 *
 * `id` is the row's, not the form's: create mode has none yet and edit mode already
 * has it at the call site, so both modes close with the same shape and the page
 * stamps the id back on.
 */
export type EmployeeFormResult = Omit<Employee, 'id'>;

@Component({
  selector: 'app-employee-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormField,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatStepperModule,
  ],
  templateUrl: './employee-dialog.html',
  styleUrl: './employee-dialog.css',
})
export class EmployeeDialog {
  private departmentService = inject(DepartmentService);
  private employeeService = inject(EmployeeService);
  private dialogRef = inject(MatDialogRef<EmployeeDialog, EmployeeFormResult>);
  private dialog = inject(MatDialog);
  private formBuilder = inject(FormBuilder);
  isLinear = true;
  data = inject<EmployeeDialogData | undefined>(MAT_DIALOG_DATA);
  departments = this.departmentService.departments;

  firstFormGroup = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  secondFormGroup = this.formBuilder.group({
    department: ['', Validators.required],
    position: ['', Validators.required],
    status: ['', Validators.required],
  });

  constructor() {
    this.dialogRef.backdropClick().subscribe(() => this.onCancel());

    if (this.data) {
      const { firstName, lastName, email, department, position, status } = this.data.employee;
      this.firstFormGroup.patchValue({
        firstName,
        lastName,
        email,
      });
      this.secondFormGroup.patchValue({
        department,
        position,
        status,
      });
    }
  }

  get firstName() {
    return this.firstFormGroup.get('firstName');
  }
  get lastName() {
    return this.firstFormGroup.get('lastName');
  }

  get email() {
    return this.firstFormGroup.get('email');
  }
  get department() {
    return this.secondFormGroup.get('department');
  }
  get position() {
    return this.secondFormGroup.get('position');
  }
  get status() {
    return this.secondFormGroup.get('status');
  }

  onSubmit(stepper: MatStepper) {
    this.firstFormGroup.markAllAsTouched();
    this.secondFormGroup.markAllAsTouched();

    if (this.hasDuplicateEmail()) {
      stepper.selectedIndex = 0;
      return;
    }

    if (this.firstFormGroup.valid && this.secondFormGroup.valid) {
      const firstFormValue = this.firstFormGroup.value;
      const secondFormValue = this.secondFormGroup.value;

      const newEmployee: Omit<Employee, 'id' | 'startDate'> = {
        firstName: firstFormValue.firstName as string,
        lastName: firstFormValue.lastName as string,
        email: firstFormValue.email as string,
        department: secondFormValue.department as string,
        position: secondFormValue.position as string,
        status: secondFormValue.status as 'active' | 'inactive',
      };
      if (this.data) {
        this.dialogRef.close({
          ...newEmployee,
          startDate: this.data.employee.startDate,
        });
      } else {
        this.dialogRef.close({
          ...newEmployee,
          startDate: toLocalDateString(new Date()),
        });
      }
    }
  }

  onCancel() {
    if (this.firstFormGroup.dirty || this.secondFormGroup.dirty) {
      const dialogRef = this.dialog.open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, {
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
  onNext(stepper: MatStepper) {
    this.firstFormGroup.markAllAsTouched();
    if (this.firstFormGroup.valid) {
      if (this.hasDuplicateEmail()) {
        return;
      }
      stepper.next();
    }
  }

  /**
   * Checks the unique-email rule and flags the control when it fails.
   * Both exits of the dialog go through it: the linear stepper lets the user
   * reach step 2 by clicking its header, which never runs `onNext()`.
   */
  private hasDuplicateEmail(): boolean {
    const email = this.firstFormGroup.value.email;
    if (!email) {
      return false;
    }

    const isDuplicate = this.employeeService.emailExists(email, this.data?.employee.id);
    if (isDuplicate) {
      this.firstFormGroup.controls.email.setErrors({ duplicateEmail: true });
    }

    return isDuplicate;
  }
}
