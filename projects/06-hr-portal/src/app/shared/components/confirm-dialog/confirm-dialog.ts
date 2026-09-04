import { Component, inject } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

/**
 * What the confirmation dialog is asked to display. Named here, at the dialog,
 * so every caller's `data` object is checked against one shape.
 */
export interface ConfirmDialogData {
  title: string;
  message: string;
  cancelLabel: string;
  confirmLabel: string;
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
})
export class ConfirmDialog {
  private dialogRef = inject(MatDialogRef<ConfirmDialog, boolean>);
  data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);

  onConfirm() {
    this.dialogRef.close(true);
  }
}
