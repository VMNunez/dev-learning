import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-leave-request-dialog',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
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

  onSubmit() {
    this.newLeaveRequest.markAllAsTouched();

    if (this.newLeaveRequest.valid) {
      const formValue = this.newLeaveRequest.value;

      this.dialogRef.close({
        startDate: formValue.startDate as string,
        endDate: formValue.endDate as string,
        reason: formValue.reason as string,
      });
    }
  }
}
