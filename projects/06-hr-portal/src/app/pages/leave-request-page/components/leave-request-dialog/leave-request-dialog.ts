import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { enGB } from 'date-fns/locale';
import { toLocalDateString } from '../../../../shared/utils/date.util';
import type { LeaveRequest } from '../../../../models/leave-request.model';

/**
 * What the dialog closes with. Derived from the domain model rather than restated,
 * so a new field on `LeaveRequest` cannot silently bypass this form.
 *
 * `id` and `status` are the service's to stamp; `employeeEmail` is taken from the
 * session by the page, never from a form field.
 */
export type LeaveRequestFormResult = Omit<LeaveRequest, 'id' | 'status' | 'employeeEmail'>;

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
  // The native adapter reads typed dates with `Date.parse`, which takes `04/10/2026` as
  // month/day whatever the locale says. The date-fns adapter reads and prints with the
  // same `enGB` pattern, so the field agrees with the `dd/MM/yyyy` the tables print.
  // Provided here, not in `app.config.ts`, so date-fns loads with this lazy page only.
  providers: [provideDateFnsAdapter(), { provide: MAT_DATE_LOCALE, useValue: enGB }],
  templateUrl: './leave-request-dialog.html',
  styleUrl: './leave-request-dialog.css',
})
export class LeaveRequestDialog {
  private dialogRef = inject(MatDialogRef<LeaveRequestDialog, LeaveRequestFormResult>);
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
