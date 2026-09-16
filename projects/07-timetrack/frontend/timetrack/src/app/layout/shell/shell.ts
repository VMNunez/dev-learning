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
import { filter, map } from 'rxjs';
import { Logo } from '../../shared/components/logo/logo';

interface NavLink {
  label: string;
  route: string;
  roles: readonly Role[];
  pending?: boolean;
}

const NAV_LINKS: readonly NavLink[] = [
  { label: 'Dashboard', route: '/dashboard', roles: ['EMPLOYEE', 'MANAGER'] },
  { label: 'Entries', route: '/entries', roles: ['EMPLOYEE', 'MANAGER'], pending: true },
  { label: 'Projects', route: '/projects', roles: ['MANAGER'], pending: true },
  { label: 'Approvals', route: '/approvals', roles: ['MANAGER'], pending: true },
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
    Logo,
  ],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shell {
  private readonly authService = inject(AuthService);
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
  readonly dialog = inject(MatDialog);
  protected readonly userName = computed(() => this.authService.session()?.name ?? '');
  protected readonly isAccountMenuOpen = signal(false);
  readonly links = computed(() => {
    const role = this.authService.session()?.role;
    return role ? NAV_LINKS.filter((link) => link.roles.includes(role)) : [];
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => this.dialog.closeAll());
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
