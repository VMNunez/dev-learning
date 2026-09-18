import { MatDialog } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { ConfirmDialog, ConfirmDialogData } from './confirm-dialog';

/**
 * Asks before a form dialog throws away what the user typed. Emits `true` only when the user
 * chooses to discard; closing the question any other way keeps the form open.
 *
 * It opens on top of a dialog that already dims the page, so it brings no second scrim and is
 * narrower than the form: it has to read as a question about the form, not as a form of its own.
 */
export function confirmDiscard(dialog: MatDialog): Observable<boolean> {
  return dialog
    .open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, {
      data: {
        title: 'Discard changes?',
        message: 'What you have typed in this form will be lost.',
        confirmLabel: 'Discard',
        destructive: true,
      },
      width: '24rem',
      backdropClass: 'cdk-overlay-transparent-backdrop',
    })
    .afterClosed()
    .pipe(map((discard) => discard === true));
}
