import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { Role } from '../../shared/models/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ChangePasswordDialog } from '../../shared/components/change-password-dialog/change-password-dialog';
import { MatDialog } from '@angular/material/dialog';

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
  ],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shell {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly accountButton = viewChild.required<string, ElementRef<HTMLButtonElement>>(
    'accountButton',
    { read: ElementRef },
  );

  readonly dialog = inject(MatDialog);

  readonly links = computed(() => {
    const role = this.authService.session()?.role;
    return role ? NAV_LINKS.filter((link) => link.roles.includes(role)) : [];
  });

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  openDialog(): void {
    this.dialog.open(ChangePasswordDialog, {
      restoreFocus: this.accountButton().nativeElement,
    });
  }
}
