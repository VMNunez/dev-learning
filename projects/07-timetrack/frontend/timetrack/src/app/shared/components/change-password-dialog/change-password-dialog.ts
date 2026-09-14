import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { UserService } from '../../../core/services/user-service';

import { AbstractControl, ValidationErrors } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '../../models/api-error';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  ],
  templateUrl: './change-password-dialog.html',
  styleUrl: './change-password-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordDialog {
  private readonly userService = inject(UserService);
  private readonly dialogRef = inject(MatDialogRef<ChangePasswordDialog>);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly mismatchMatcher = new MismatchErrorStateMatcher();

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

  onSubmit(): void {
    this.error.set(null);
    this.form.markAllAsTouched();

    if (this.form.invalid || this.loading()) return;

    const { currentPassword, newPassword } = this.form.getRawValue();

    this.loading.set(true);
    this.form.disable({ emitEvent: false });
    this.dialogRef.disableClose = true;

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
          this.dialogRef.disableClose = false;

          const apiError = err.error as ApiError | null;
          const fieldErrors = err.status === 400 ? apiError?.fieldErrors : undefined;

          if (fieldErrors) {
            for (const field of ['currentPassword', 'newPassword'] as const) {
              const message = fieldErrors[field]?.[0];
              if (message) this.form.controls[field].setErrors({ server: message });
            }
            return;
          }

          this.error.set('Could not change the password. Try again.');
        },
      });
  }
}
