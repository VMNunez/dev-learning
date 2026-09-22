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
import {
  ConfirmDialog,
  ConfirmDialogData,
} from '../../shared/components/confirm-dialog/confirm-dialog';
import { StatCard } from '../../shared/components/stat-card/stat-card';
import { refocusAfterRender } from '../../shared/focus';
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
  // The one comparison this page makes in the browser (see `sortedUsers`), in the app's own locale.
  private readonly collator = new Intl.Collator(inject(LOCALE_ID), { sensitivity: 'base' });

  // The header's own action, which every refetch leaves in place: where focus lands when the control a
  // write started from is gone, and where the password dialog hands it back.
  private readonly addMemberButton = viewChild.required<string, ElementRef<HTMLButtonElement>>(
    'addMemberButton',
    { read: ElementRef },
  );

  // Where Retry's focus lands, as on every page with an error state (§14).
  private readonly pageHeading = viewChild.required<string, ElementRef<HTMLHeadingElement>>(
    'pageHeading',
    { read: ElementRef },
  );

  // A cell's `let user` reaches the template untyped, so the label is looked up here, where it is a User.
  protected readonly roleLabel = (user: User) => ROLE_LABELS[user.role];
  protected readonly columns = ['name', 'email', 'role', 'status', 'actions'];
  protected readonly users = signal<User[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly busyUserId = signal<number | null>(null);

  // §8 refuses a self-deactivation and a self-demotion with a `409`, so the caller's own row keeps its
  // edit but not its deactivate, and the dialog keeps its role fixed. The API stays the boundary.
  private readonly currentUserId = computed(() => this.authService.session()?.id ?? null);
  protected readonly isSelf = (user: User) => user.id === this.currentUserId();

  // Counted over the whole list (§14): Total and the role split include deactivated accounts, and
  // Inactive cuts across both roles. Skeletons until the first load, then kept across a refetch.
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

  // Sorted here, as on Projects: the list is unpaged, so the browser holds every account. The API's own
  // order is active first, then name (§10), which is the Status sort ascending — the page opens on it.
  // Status and Role are stable sorts, so each group keeps the API's name order and its collation. Name
  // is the one order the API never serves on its own, so it is the one compared here.
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

  // A write remembers the control it started from, and the refetch hands focus back to it once it has
  // rendered — or to the header's action when the refetch took it away (§14).
  private refocusAfterReload: HTMLElement | null = null;

  private readonly reload$ = new Subject<void>();

  // The dialog showing a new member's generated password, while it is open: the one thing on this page
  // the app can never fetch again, so `/team`'s route refuses to leave while it is set.
  private passwordDialog: MatDialogRef<GeneratedPasswordDialog> | null = null;

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
    return this.passwordDialog !== null;
  }

  // Retry sits in the error block its own reload takes away, so the focus it held would fall to
  // `<body>`; the heading is on screen in every state, failed again or loaded.
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
    if (this.busyUserId() === user.id) return;
    this.openDialog(user);
  }

  // Deactivating locks someone out, so it asks first; reactivating only undoes it and asks nothing.
  toggleActive(user: User): void {
    // The buttons stay focusable while the write is in flight (`disabledInteractive`), and the caller's
    // own deactivate stays focusable to explain itself, so this is the guard that refuses both.
    if (this.busyUserId() === user.id || this.isSelf(user)) return;

    if (!user.active) {
      // `PUT` needs the whole account, so it replays the row as the browser last fetched it — as the
      // Projects reactivation does, and with the same accepted cost (§14).
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
        return EMPTY;
      }),
    );
  }

  private openDialog(user: User | null): void {
    const opener = activeElement();

    this.dialog
      .open<UserDialog, UserDialogData, UserDialogResult>(UserDialog, {
        data: { user, isSelf: user !== null && this.isSelf(user) },
        disableClose: true,
      })
      .afterClosed()
      .pipe(
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
        // The empty state's button that may have opened the form is gone once the first member exists;
        // the header's action is the one target the refetch cannot remove.
        this.showPassword(
          { name, email, password: generatedPassword, reason: 'created' },
          this.addMemberButton().nativeElement,
        );
      });
  }

  // A manager's reset, for a member who lost the password they were given: the old one stops working at
  // once, so it asks first. The row stays as it is — nothing in the list changed — so no refetch, and
  // the new password comes back in the same dialog a new account's does.
  resetPassword(user: User): void {
    if (this.busyUserId() === user.id || this.isSelf(user)) return;

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
          this.busyUserId.set(user.id);
          return this.userService.resetPassword(user.id);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: ({ generatedPassword }) => {
          this.busyUserId.set(null);
          this.showPassword({
            name: user.name,
            email: user.email,
            password: generatedPassword,
            reason: 'reset',
          });
        },
        error: (err: unknown) => {
          this.busyUserId.set(null);
          this.snackBar.open(apiErrorMessage(err, 'The reset failed. Try again.'), 'Close', {
            duration: 6000,
          });
        },
      });
  }

  // The one place a generated password is shown. `disableClose` stops Escape and the backdrop, not the
  // browser's Back: by default the overlay disposes itself on that history change, before the route's
  // guard can refuse it — so it also opts out of `closeOnNavigation`, and `/team`'s guard reads the ref.
  private showPassword(data: GeneratedPasswordDialogData, restoreFocus?: HTMLElement): void {
    this.passwordDialog = this.dialog.open<GeneratedPasswordDialog, GeneratedPasswordDialogData>(
      GeneratedPasswordDialog,
      { data, disableClose: true, closeOnNavigation: false, restoreFocus: restoreFocus ?? true },
    );
    this.passwordDialog
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => (this.passwordDialog = null));
  }

  private run(user: User, action$: Observable<unknown>, successMessage: string): void {
    const pressed = activeElement();
    this.busyUserId.set(user.id);

    action$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.busyUserId.set(null);
        this.snackBar.open(successMessage, 'Close', { duration: 4000 });
        this.refocusAfterReload = pressed;
        this.reload();
      },
      error: (err: unknown) => {
        this.busyUserId.set(null);
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

function activeElement(): HTMLElement | null {
  const active = document.activeElement;
  return active instanceof HTMLElement ? active : null;
}
