import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  NavigationEnd,
  NavigationSkipped,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { Role } from '../../shared/models/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ChangePasswordDialog } from '../../shared/components/change-password-dialog/change-password-dialog';
import { MatDialog } from '@angular/material/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatBadgeModule } from '@angular/material/badge';
import { catchError, EMPTY, filter, map, switchMap } from 'rxjs';
import { EntryService } from '../../core/services/entry-service';
import { Logo } from '../../shared/components/logo/logo';

interface NavLink {
  label: string;
  route: string;
  roles: readonly Role[];
  pending?: boolean;
  countsPendingApprovals?: boolean;
}

const NAV_LINKS: readonly NavLink[] = [
  { label: 'Dashboard', route: '/dashboard', roles: ['EMPLOYEE', 'MANAGER'] },
  { label: 'Entries', route: '/entries', roles: ['EMPLOYEE', 'MANAGER'] },
  { label: 'Projects', route: '/projects', roles: ['MANAGER'] },
  { label: 'Approvals', route: '/approvals', roles: ['MANAGER'], countsPendingApprovals: true },
  { label: 'Team', route: '/team', roles: ['MANAGER'], pending: true },
  { label: 'Reports', route: '/reports', roles: ['MANAGER'], pending: true },
];

@Component({
  selector: 'app-shell',
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    Logo,
  ],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shell {
  private readonly authService = inject(AuthService);
  private readonly entryService = inject(EntryService);
  private readonly router = inject(Router);
  private readonly breakpointObserver = inject(BreakpointObserver);
  protected readonly isDesktop = toSignal(
    this.breakpointObserver.observe('(min-width: 1024px)').pipe(map((state) => state.matches)),
    { requireSync: true },
  );

  private readonly accountButton = viewChild.required<string, ElementRef<HTMLButtonElement>>(
    'accountButton',
    { read: ElementRef },
  );
  private readonly sidenav = viewChild(MatSidenav);
  private readonly dialog = inject(MatDialog);
  protected readonly userName = computed(() => this.authService.session()?.name ?? '');
  protected readonly isAccountMenuOpen = signal(false);
  readonly links = computed(() => {
    const role = this.authService.session()?.role;
    return role ? NAV_LINKS.filter((link) => link.roles.includes(role)) : [];
  });

  // The shell owns this count and reads it for itself (§13): it is not live-synced with the pages that
  // change it — that would take the shared store §20 rejects, for a badge — so it is re-read after every
  // navigation instead, and an approval shows in the badge as soon as the manager moves on.
  protected readonly pendingApprovals = signal(0);
  protected readonly pendingBadge = computed(() => {
    const count = this.pendingApprovals();
    return count > 99 ? '99+' : `${count}`;
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => this.dialog.closeAll());

    // `NavigationEnd` also closes the navigation that created the shell, so the first read needs no
    // trigger of its own. Only a manager has an Approvals link; an employee's shell never asks.
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        filter(() => this.authService.session()?.role === 'MANAGER'),
        switchMap(() =>
          this.entryService.getEntries({ status: 'SUBMITTED' }, { page: 0, size: 1 }).pipe(
            // A badge that fails to load keeps its last count rather than turning the shell into an
            // error: the Approvals page itself reports the failure when it is opened.
            catchError(() => EMPTY),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((page) => this.pendingApprovals.set(page.page.totalElements));

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd || event instanceof NavigationSkipped),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        const sidenav = this.sidenav();
        if (sidenav?.mode === 'over') {
          sidenav.close();
        }
      });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  openDialog(): void {
    this.dialog.open(ChangePasswordDialog, {
      restoreFocus: this.accountButton().nativeElement,
      disableClose: true,
    });
  }
}
