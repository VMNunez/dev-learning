import { FormGroup, TouchedChangeEvent } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { map, merge, Observable, takeUntil, tap } from 'rxjs';
import { ConfirmDialog, ConfirmDialogData } from './confirm-dialog';

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

  return closed$.pipe(
    tap((discard) => {
      if (discard !== true) {
        keepFormAsItWas();
      }
    }),
    map((discard) => discard === true),
  );
}
