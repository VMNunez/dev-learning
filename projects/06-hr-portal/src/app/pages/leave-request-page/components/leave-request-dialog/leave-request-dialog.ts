import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { toLocalDateString } from '../../../../shared/utils/date.util';

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
  today = new Date();

  newLeaveRequest = new FormGroup({
    startDate: new FormControl<Date | null>(null, Validators.required),
    endDate: new FormControl<Date | null>(null, Validators.required),
    reason: new FormControl('', Validators.required),
  });

  onSubmit() {
    this.newLeaveRequest.markAllAsTouched();

    if (this.newLeaveRequest.valid) {
      const { startDate, endDate, reason } = this.newLeaveRequest.getRawValue();

      // `Validators.required` already rejects an empty control, but a reset leaves
      // `null` in it, so the value is narrowed here rather than asserted.
      if (!startDate || !endDate || !reason) {
        return;
      }

      if (endDate < startDate) {
        this.newLeaveRequest.controls.endDate.setErrors({ invalidDate: true });
        return;
      }

      this.dialogRef.close({
        startDate: toLocalDateString(startDate),
        endDate: toLocalDateString(endDate),
        reason,
      });
    }
  }
}
