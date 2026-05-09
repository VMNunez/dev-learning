import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-leave-request-dialog',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatDatepickerModule,
  ],
  templateUrl: './leave-request-dialog.html',
  styleUrl: './leave-request-dialog.css',
})
export class LeaveRequestDialog {
  private dialogRef = inject(MatDialogRef<LeaveRequestDialog>);

  newLeaveRequest = new FormGroup({
    startDate: new FormControl('', Validators.required),
    endDate: new FormControl('', Validators.required),
    reason: new FormControl('', Validators.required),
  });

  dateFormat(date: Date) {
    return date.toISOString().split('T')[0];
  }

  onSubmit() {
    this.newLeaveRequest.markAllAsTouched();

    if (this.newLeaveRequest.valid) {
      const formValue = this.newLeaveRequest.value;

      this.dialogRef.close({
        startDate: this.dateFormat(formValue.startDate as unknown as Date),
        endDate: this.dateFormat(formValue.endDate as unknown as Date),
        reason: formValue.reason as string,
      });
    }
  }
}
