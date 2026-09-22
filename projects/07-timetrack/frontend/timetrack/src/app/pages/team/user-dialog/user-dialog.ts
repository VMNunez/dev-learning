import { HttpErrorResponse } from '@angular/common/http';
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
import { MatSelectModule } from '@angular/material/select';
import { filter, map, Observable } from 'rxjs';
import { UserService } from '../../../core/services/user-service';
import { confirmDiscard } from '../../../shared/components/confirm-dialog/confirm-discard';
import { apiErrorMessage, placeFieldErrors } from '../../../shared/models/api-error';
import { refocusAfterFailedSave } from '../../../shared/focus';
import { Role, ROLE_LABELS, ROLES } from '../../../shared/models/auth';
import { CreateUserResponse, User } from '../../../shared/models/user';

export interface UserDialogData {
  user: User | null;
  // The caller's own account. Editable, except the role: §8 refuses a self-demotion with a `409`, so the
  // form does not offer the change the API would refuse.
  isSelf: boolean;
}

// A create carries the generated password back to the page, which shows it once; an edit carries
// nothing the page needs beyond "refetch".
export type UserDialogResult =
  { kind: 'created'; member: CreateUserResponse } | { kind: 'updated' };

const FORM_FIELDS = ['name', 'email', 'role'] as const;

@Component({
  selector: 'app-user-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinner,
  ],
  templateUrl: './user-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDialog {
  private readonly userService = inject(UserService);
  private readonly dialogRef = inject(MatDialogRef<UserDialog, UserDialogResult>);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly data = inject<UserDialogData>(MAT_DIALOG_DATA);

  protected readonly user = this.data.user;
  protected readonly isEdit = this.user !== null;
  protected readonly isSelf = this.data.isSelf;
  protected readonly roles = ROLES;
  protected readonly roleLabels = ROLE_LABELS;
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = new FormGroup({
    name: new FormControl(this.user?.name ?? '', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255)],
    }),
    email: new FormControl(this.user?.email ?? '', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(255)],
    }),
    // A new account opens as an employee — the common case, and the one with no approval rights.
    role: new FormControl<Role>(
      { value: this.user?.role ?? 'EMPLOYEE', disabled: this.data.isSelf },
      { nonNullable: true, validators: [Validators.required] },
    ),
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
      this.dialogRef.close();
      return;
    }

    confirmDiscard(this.dialog, this.form)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((discard) => {
        if (discard) {
          this.dialogRef.close();
        }
      });
  }

  save(): void {
    this.error.set(null);
    this.form.markAllAsTouched();

    if (this.form.invalid || this.saving()) return;

    this.saving.set(true);
    // Disabled while saving, as in the entry and project dialogs: an email typed during the request
    // would sit on screen against an account that saved the old one.
    this.form.disable({ emitEvent: false });

    this.write()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => this.dialogRef.close(result),
        error: (err: HttpErrorResponse) => this.showError(err),
      });
  }

  private write(): Observable<UserDialogResult> {
    // `getRawValue()`, not `value`: a disabled control — the caller's own role — is left out of `value`,
    // and the update needs it.
    const { name, email, role } = this.form.getRawValue();
    const request = { name: name.trim(), email: email.trim(), role };

    // No `active` on the update: omitted, the API leaves the account as it is — the row's own action
    // owns deactivation and the way back.
    return this.user
      ? this.userService
          .updateUser(this.user.id, request)
          .pipe(map((): UserDialogResult => ({ kind: 'updated' })))
      : this.userService
          .createUser(request)
          .pipe(map((member): UserDialogResult => ({ kind: 'created', member })));
  }

  private showError(err: HttpErrorResponse): void {
    this.saving.set(false);
    this.form.enable({ emitEvent: false });
    refocusAfterFailedSave(this.injector, this.host.nativeElement);
    if (this.isSelf) {
      this.form.controls.role.disable({ emitEvent: false });
    }

    // A duplicate email is a 409 carrying `fieldErrors.email`, so it lands under the input like a 400;
    // a promotion refused while the user still holds drafts (§8) belongs to no field and reads above.
    if (!placeFieldErrors(err, this.form.controls, FORM_FIELDS)) {
      this.error.set(apiErrorMessage(err, 'Could not save the member. Try again.'));
    }
  }
}
