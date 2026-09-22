import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe, DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Injector,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { filter } from 'rxjs';
import { EntryService } from '../../../core/services/entry-service';
import { apiErrorMessage, placeFieldErrors } from '../../models/api-error';
import { refocusAfterFailedSave } from '../../focus';
import { TimeEntry } from '../../models/time-entry';
import { confirmDiscard } from '../confirm-dialog/confirm-discard';

export interface RejectDialogData {
  entry: TimeEntry;
}

const FORM_FIELDS = ['rejectionNote'] as const;

@Component({
  selector: 'app-reject-dialog',
  imports: [
    DatePipe,
    DecimalPipe,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinner,
  ],
  templateUrl: './reject-dialog.html',
  styleUrl: './reject-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RejectDialog {
  private readonly entryService = inject(EntryService);
  private readonly dialogRef = inject(MatDialogRef<RejectDialog, boolean>);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly data = inject<RejectDialogData>(MAT_DIALOG_DATA);

  protected readonly entry = this.data.entry;
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = new FormGroup({
    rejectionNote: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255)],
    }),
  });

  constructor() {
    this.dialogRef
      .keydownEvents()
      .pipe(
        filter((event) => event.key === 'Escape' && !this.saving()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.close());
  }

  close(): void {
    if (!this.form.dirty) {
      this.dialogRef.close(false);
      return;
    }

    confirmDiscard(this.dialog, this.form)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((discard) => {
        if (discard) {
          this.dialogRef.close(false);
        }
      });
  }

  reject(): void {
    this.error.set(null);
    this.form.markAllAsTouched();

    if (this.form.invalid || this.saving()) return;

    this.saving.set(true);
    this.form.disable({ emitEvent: false });

    this.entryService
      .rejectEntry(this.entry.id, { rejectionNote: this.form.getRawValue().rejectionNote.trim() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.showError(err),
      });
  }

  private showError(err: HttpErrorResponse): void {
    this.saving.set(false);
    this.form.enable({ emitEvent: false });
    refocusAfterFailedSave(this.injector, this.host.nativeElement);

    if (!placeFieldErrors(err, this.form.controls, FORM_FIELDS)) {
      this.error.set(apiErrorMessage(err, 'Could not reject the entry. Try again.'));
    }
  }
}
