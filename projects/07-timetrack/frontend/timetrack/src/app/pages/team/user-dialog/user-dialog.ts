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
import { HoldsOneTimeSecret } from '../../../core/guards/one-time-secret-guard';
import { UserService } from '../../../core/services/user-service';
import { confirmDiscard } from '../../../shared/components/confirm-dialog/confirm-discard';
import { apiErrorMessage, placeFieldErrors } from '../../../shared/models/api-error';
import { refocusAfterFailedSave } from '../../../shared/focus';
import { notBlank } from '../../../shared/validators';
import { Role, ROLE_LABELS, ROLES } from '../../../shared/models/auth';
import { CreateUserResponse, User } from '../../../shared/models/user';

export interface UserDialogData {
  user: User | null;
  isSelf: boolean;
}

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
export class UserDialog implements HoldsOneTimeSecret {
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
      validators: [Validators.required, notBlank, Validators.maxLength(255)],
    }),
    email: new FormControl(this.user?.email ?? '', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(255)],
    }),
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

  holdsOneTimeSecret(): boolean {
    return !this.isEdit && this.saving();
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
    this.form.disable({ emitEvent: false });

    this.write()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => this.dialogRef.close(result),
        error: (err: HttpErrorResponse) => this.showError(err),
      });
  }

  private write(): Observable<UserDialogResult> {
    const { name, email, role } = this.form.getRawValue();
    const request = { name: name.trim(), email: email.trim(), role };

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

    if (!placeFieldErrors(err, this.form.controls, FORM_FIELDS)) {
      this.error.set(apiErrorMessage(err, 'Could not save the member. Try again.'));
    }
  }
}
