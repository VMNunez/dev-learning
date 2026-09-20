import { FormGroup, TouchedChangeEvent } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { map, merge, Observable, takeUntil, tap } from 'rxjs';
import { ConfirmDialog, ConfirmDialogData } from './confirm-dialog';

/**
 * Asks before a form dialog throws away what the user typed. Emits `true` only when the user
 * chooses to discard; closing the question any other way keeps the form open.
 *
 * It opens narrower than the form it sits on, and with its own scrim dimming that form: flat
 * dialogs share one surface colour, so only the scrim separates the question from the form below.
 *
 * It also owns leaving the form exactly as it was. Opening the question takes focus out of the
 * form, and that blur marks the focused control touched — which paints its error in red behind the
 * scrim, and leaves it on when the user comes back. The CDK moves that focus **asynchronously**,
 * after `afterOpened()` has already emitted, so there is no moment "just after the blur" to undo it
 * at. Instead the controls that were untouched refuse the mark for as long as the question is open,
 * which reacts to the change itself and so cannot race it.
 */
export function confirmDiscard(dialog: MatDialog, form: FormGroup): Observable<boolean> {
  const untouched = Object.values(form.controls).filter((control) => control.untouched);
  const keepFormAsItWas = () =>
    untouched.forEach((control) => control.markAsUntouched({ emitEvent: false }));

  const ref = dialog.open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, {
    data: {
      title: 'Discard changes?',
      message: 'What you have typed in this form will be lost.',
      confirmLabel: 'Discard',
      cancelLabel: 'Keep editing',
      destructive: true,
    },
    width: '24rem',
  });

  const closed$ = ref.afterClosed();

  merge(...untouched.map((control) => control.events))
    .pipe(takeUntil(closed$))
    .subscribe((event) => {
      if (event instanceof TouchedChangeEvent && event.touched) {
        keepFormAsItWas();
      }
    });

  // The closing blur lands after the guard is gone, so the form is put back one last time.
  return closed$.pipe(
    tap((discard) => {
      if (discard !== true) {
        keepFormAsItWas();
      }
    }),
    map((discard) => discard === true),
  );
}
