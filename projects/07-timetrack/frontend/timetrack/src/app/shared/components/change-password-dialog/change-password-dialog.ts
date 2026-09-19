import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { UserService } from '../../../core/services/user-service';

import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter } from 'rxjs';
import { apiErrorMessage, placeFieldErrors } from '../../models/api-error';
import { confirmDiscard } from '../confirm-dialog/confirm-discard';

// The request fields the API can refuse one by one; confirmPassword never leaves the browser.
const SERVER_FIELDS = ['currentPassword', 'newPassword'] as const;

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const newPassword = group.get('newPassword')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;

  if (!confirmPassword) return null;

  return newPassword === confirmPassword ? null : { passwordMismatch: true };
}

class MismatchErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: AbstractControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const showable = !!(control?.touched || form?.submitted);
    const invalid = !!control?.invalid || !!form?.hasError('passwordMismatch');

    return showable && invalid;
  }
}

@Component({
  selector: 'app-change-password-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInput,
    ReactiveFormsModule,
    MatProgressSpinner,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './change-password-dialog.html',
  styleUrl: './change-password-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordDialog {
  private readonly userService = inject(UserService);
  private readonly dialogRef = inject(MatDialogRef<ChangePasswordDialog>);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly mismatchMatcher = new MismatchErrorStateMatcher();
  readonly showCurrent = signal(false);
  readonly showNew = signal(false);
  readonly showConfirm = signal(false);

  readonly form = new FormGroup(
    {
      currentPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      newPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(8), Validators.maxLength(72)],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: passwordsMatch },
  );

  constructor() {
    this.dialogRef
      .keydownEvents()
      .pipe(
        filter((event) => event.key === 'Escape' && !this.loading()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.close());
  }

  close(): void {
    if (!this.form.dirty) {
      this.dialogRef.close();
      return;
    }

    // Opening the question moves focus out of the form, and that blur marks the focused field
    // touched. Keep editing must return the form exactly as it was, so undo that one side effect.
    const untouched = Object.values(this.form.controls).filter((control) => control.untouched);

    confirmDiscard(this.dialog)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((discard) => {
        if (discard) {
          this.dialogRef.close();
          return;
        }
        untouched.forEach((control) => control.markAsUntouched());
      });
  }

  onSubmit(): void {
    this.error.set(null);
    this.form.markAllAsTouched();

    if (this.form.invalid || this.loading()) return;

    const { currentPassword, newPassword } = this.form.getRawValue();

    this.loading.set(true);
    this.form.disable({ emitEvent: false });

    this.userService
      .changePassword({ currentPassword, newPassword })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.snackBar.open('Password changed', 'Close', { duration: 5000 });
          this.dialogRef.close(true);
        },
        error: (err: HttpErrorResponse) => {
          this.loading.set(false);
          this.form.enable({ emitEvent: false });

          if (!placeFieldErrors(err, this.form.controls, SERVER_FIELDS)) {
            this.error.set(apiErrorMessage(err, 'Could not change the password. Try again.'));
          }
        },
      });
  }
}
