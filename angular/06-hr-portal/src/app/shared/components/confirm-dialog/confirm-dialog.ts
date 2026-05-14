import { Component, inject } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
})
export class ConfirmDialog {
  private dialogRef = inject(MatDialogRef);
  data = inject<{ title: string; message: string; cancelLabel: string; confirmLabel: string }>(
    MAT_DIALOG_DATA,
  );

  onConfirm() {
    this.dialogRef.close(true);
  }
}
