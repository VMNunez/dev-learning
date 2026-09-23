import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  Injector,
  LOCALE_ID,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { catchError, EMPTY, filter, Observable, Subject, switchMap, tap } from 'rxjs';
import { HoldsOneTimeSecret } from '../../core/guards/one-time-secret-guard';
import { AuthService } from '../../core/services/auth-service';
import { UserService } from '../../core/services/user-service';
import { withBusyId, withoutBusyId } from '../../shared/busy-ids';
import {
  ConfirmDialog,
  ConfirmDialogData,
} from '../../shared/components/confirm-dialog/confirm-dialog';
import { StatCard } from '../../shared/components/stat-card/stat-card';
import { activeElement, refocusAfterRender } from '../../shared/focus';
import { apiErrorMessage } from '../../shared/models/api-error';
import { ROLE_LABELS, ROLES } from '../../shared/models/auth';
import { User } from '../../shared/models/user';
import {
  GeneratedPasswordDialog,
  GeneratedPasswordDialogData,
} from './generated-password-dialog/generated-password-dialog';
import { UserDialog, UserDialogData, UserDialogResult } from './user-dialog/user-dialog';

@Component({
  selector: 'app-team',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatProgressSpinner,
    MatSortModule,
    MatTableModule,
    MatTooltip,
    StatCard,
  ],
  templateUrl: './team.html',
  styleUrl: './team.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Team implements HoldsOneTimeSecret {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);
  private readonly collator = new Intl.Collator(inject(LOCALE_ID), { sensitivity: 'base' });

  private readonly addMemberButton = viewChild.required<string, ElementRef<HTMLButtonElement>>(
    'addMemberButton',
    { read: ElementRef },
  );

  private readonly pageHeading = viewChild.required<string, ElementRef<HTMLHeadingElement>>(
    'pageHeading',
    { read: ElementRef },
  );

  protected readonly roleLabel = (user: User) => ROLE_LABELS[user.role];
  protected readonly columns = ['name', 'email', 'role', 'status', 'actions'];
  protected readonly users = signal<User[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly busyIds = signal<ReadonlySet<number>>(new Set());

  private readonly currentUserId = computed(() => this.authService.session()?.id ?? null);
  protected readonly isSelf = (user: User) => user.id === this.currentUserId();

  protected readonly counts = computed(() => {
    if (this.loading() && this.users().length === 0) return null;

    const users = this.users();
    const employees = users.filter((user) => user.role === 'EMPLOYEE').length;
    return {
      total: users.length,
      employees,
      managers: users.length - employees,
      inactive: users.filter((user) => !user.active).length,
    };
  });

  private readonly sort = signal<Sort>({ active: 'status', direction: 'asc' });

  protected readonly sortedUsers = computed(() => {
    const { active, direction } = this.sort();
    const sign = direction === 'desc' ? -1 : 1;
    const users = [...this.users()];

    switch (active) {
      case 'name':
        return users.sort((a, b) => sign * (this.collator.compare(a.name, b.name) || a.id - b.id));
      case 'role':
        return users.sort((a, b) => sign * (ROLES.indexOf(a.role) - ROLES.indexOf(b.role)));
      default:
        return direction === 'desc'
          ? users.sort((a, b) => (a.active === b.active ? 0 : a.active ? 1 : -1))
          : this.users();
    }
  });

  protected readonly trackById = (_index: number, user: User) => user.id;

  private refocusAfterReload: HTMLElement | null = null;

  private readonly reload$ = new Subject<void>();

  private openPasswordDialogs = 0;

  private resetsInFlight = 0;
  private userDialog: MatDialogRef<UserDialog> | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => this.dialog.closeAll());

    this.reload$
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.error.set(null);
        }),
        switchMap(() => this.fetch()),
        takeUntilDestroyed(),
      )
      .subscribe((users) => {
        this.users.set(users);
        this.loading.set(false);
        this.restoreFocus();
      });

    this.reload();
  }

  reload(): void {
    this.reload$.next();
  }

  holdsOneTimeSecret(): boolean {
    return (
      this.openPasswordDialogs > 0 ||
      this.resetsInFlight > 0 ||
      (this.userDialog?.componentInstance?.holdsOneTimeSecret() ?? false)
    );
  }

  retry(): void {
    this.reload();
    refocusAfterRender(this.injector, [this.pageHeading().nativeElement]);
  }

  onSort(sort: Sort): void {
    this.sort.set(sort);
  }

  openCreate(): void {
    this.openDialog(null);
  }

  openEdit(user: User): void {
    if (this.busyIds().has(user.id)) return;
    this.openDialog(user);
  }

  toggleActive(user: User): void {
    if (this.busyIds().has(user.id) || this.isSelf(user)) return;

    if (!user.active) {
      this.run(
        user,
        this.userService.updateUser(user.id, {
          name: user.name,
          email: user.email,
          role: user.role,
          active: true,
        }),
        'Member reactivated',
      );
      return;
    }

    this.dialog
      .open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, {
        data: {
          title: 'Deactivate member?',
          message: `${user.name} keeps every entry already logged, but can no longer log in.`,
          confirmLabel: 'Deactivate',
          destructive: true,
        },
      })
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed === true),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() =>
        this.run(user, this.userService.deactivateUser(user.id), 'Member deactivated'),
      );
  }

  private fetch(): Observable<User[]> {
    return this.userService.getUsers().pipe(
      catchError((err: unknown) => {
        this.error.set(apiErrorMessage(err, 'Could not load the team. Check your connection.'));
        this.loading.set(false);
        this.refocusAfterReload = null;
        refocusAfterRender(this.injector, [this.pageHeading().nativeElement]);
        return EMPTY;
      }),
    );
  }

  private openDialog(user: User | null): void {
    const opener = activeElement();

    this.userDialog = this.dialog.open<UserDialog, UserDialogData, UserDialogResult>(UserDialog, {
      data: { user, isSelf: user !== null && this.isSelf(user) },
      disableClose: true,
      closeOnNavigation: false,
    });

    this.userDialog
      .afterClosed()
      .pipe(
        tap(() => (this.userDialog = null)),
        filter((result) => result !== undefined),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        this.refocusAfterReload = opener;
        this.reload();

        if (result.kind === 'updated') {
          this.snackBar.open('Member updated', 'Close', { duration: 4000 });
          return;
        }

        const { name, email, generatedPassword } = result.member;
        this.showPassword(
          { name, email, password: generatedPassword, reason: 'created' },
          this.addMemberButton().nativeElement,
        );
      });
  }

  resetPassword(user: User): void {
    if (this.busyIds().has(user.id) || this.isSelf(user)) return;

    this.dialog
      .open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, {
        data: {
          title: 'Reset password?',
          message: `${user.name}'s current password stops working at once. You will see the new one only once.`,
          confirmLabel: 'Reset password',
          destructive: true,
        },
      })
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed === true),
        switchMap(() => {
          this.busyIds.update((ids) => withBusyId(ids, user.id));
          this.resetsInFlight += 1;
          return this.userService.resetPassword(user.id);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: ({ generatedPassword }) => {
          this.busyIds.update((ids) => withoutBusyId(ids, user.id));
          this.resetsInFlight -= 1;
          this.showPassword({
            name: user.name,
            email: user.email,
            password: generatedPassword,
            reason: 'reset',
          });
        },
        error: (err: unknown) => {
          this.busyIds.update((ids) => withoutBusyId(ids, user.id));
          this.resetsInFlight -= 1;
          this.snackBar.open(apiErrorMessage(err, 'The reset failed. Try again.'), 'Close', {
            duration: 6000,
          });
        },
      });
  }

  private showPassword(data: GeneratedPasswordDialogData, restoreFocus?: HTMLElement): void {
    this.openPasswordDialogs += 1;
    this.dialog
      .open<GeneratedPasswordDialog, GeneratedPasswordDialogData>(GeneratedPasswordDialog, {
        data,
        disableClose: true,
        closeOnNavigation: false,
        restoreFocus: restoreFocus ?? true,
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => (this.openPasswordDialogs -= 1));
  }

  private run(user: User, action$: Observable<unknown>, successMessage: string): void {
    const pressed = activeElement();
    this.busyIds.update((ids) => withBusyId(ids, user.id));

    action$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.busyIds.update((ids) => withoutBusyId(ids, user.id));
        this.snackBar.open(successMessage, 'Close', { duration: 4000 });
        this.refocusAfterReload = pressed;
        this.reload();
      },
      error: (err: unknown) => {
        this.busyIds.update((ids) => withoutBusyId(ids, user.id));
        this.snackBar.open(apiErrorMessage(err, 'The action failed. Try again.'), 'Close', {
          duration: 6000,
        });
      },
    });
  }

  private restoreFocus(): void {
    const target = this.refocusAfterReload;
    this.refocusAfterReload = null;
    if (!target) return;

    refocusAfterRender(this.injector, [target, this.addMemberButton().nativeElement]);
  }
}
