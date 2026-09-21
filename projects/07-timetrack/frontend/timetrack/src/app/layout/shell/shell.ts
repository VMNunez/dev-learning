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
import { filter, map } from 'rxjs';
import { PendingApprovals } from '../../core/state/pending-approvals';
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
  { label: 'Team', route: '/team', roles: ['MANAGER'] },
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
  private readonly pendingApprovalsState = inject(PendingApprovals);
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

  // The badge's count lives in the app-wide `PendingApprovals` (§13), because the pages under the shell
  // change it: an approval re-reads it at once, so the badge never disagrees with the queue beside it.
  protected readonly pendingApprovals = this.pendingApprovalsState.count;
  protected readonly pendingBadge = computed(() => {
    const count = this.pendingApprovals();
    return count > 99 ? '99+' : `${count}`;
  });

  constructor() {
    // The shell lives exactly as long as a session — logging out, or a `401`, routes to /login outside
    // it — so its end is where the count is cleared, or the next manager to log in would see this one's.
    inject(DestroyRef).onDestroy(() => {
      this.dialog.closeAll();
      this.pendingApprovalsState.clear();
    });

    // `NavigationEnd` also closes the navigation that created the shell, so the first read needs no
    // trigger of its own, and entries other people submitted or reviewed since are counted on the way.
    // Only a manager has an Approvals link; an employee's shell never asks.
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        filter(() => this.authService.session()?.role === 'MANAGER'),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.pendingApprovalsState.refresh());

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
