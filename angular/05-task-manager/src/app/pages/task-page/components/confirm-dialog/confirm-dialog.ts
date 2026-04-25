import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Task } from '../../../../models/task.model';

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogContent, MatDialogTitle, MatDialogActions, MatDialogClose, MatButtonModule],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
})
export class ConfirmDialog {
  private dialogRef = inject(MatDialogRef);
  data = inject<{ task: Task }>(MAT_DIALOG_DATA);

  confirmDelete() {
    this.dialogRef.close(true);
  }
}
