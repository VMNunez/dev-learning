import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel: string;
  /**
   * Names what the dismiss button does, when "Cancel" would be ambiguous — cancelling a question is
   * not an outcome the user can picture, and a form dialog underneath may carry a "Cancel" of its own
   * that means the opposite. Defaults to "Cancel", which is right for a yes/no on a single action.
   */
  cancelLabel?: string;
  /** Paints the confirm button in the theme's error colour, for actions that destroy data. */
  destructive?: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialog {
  protected readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
}
