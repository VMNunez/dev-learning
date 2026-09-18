import { MatDialog } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { ConfirmDialog, ConfirmDialogData } from './confirm-dialog';

/**
 * Asks before a form dialog throws away what the user typed. Emits `true` only when the user
 * chooses to discard; closing the question any other way keeps the form open.
 *
 * It opens narrower than the form it sits on, and with its own scrim dimming that form: flat
 * dialogs share one surface colour, so only the scrim separates the question from the form below.
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
    })
    .afterClosed()
    .pipe(map((discard) => discard === true));
}
