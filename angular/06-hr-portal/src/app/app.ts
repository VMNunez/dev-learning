import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('06-hr-portal');
  private authService = inject(AuthService);
  private router = inject(Router);
  isLoggedIn = this.authService.currentUser;
  isAdmin = computed(() => this.authService.currentUser()?.role === 'admin');

  navLinks = [
    { label: 'Dashboard', path: '/dashboard', adminOnly: false },
    { label: 'Employees', path: '/employees', adminOnly: true },
    { label: 'Departments', path: '/departments', adminOnly: true },
    { label: 'Leave Requests', path: '/leave-requests', adminOnly: false },
  ];

  filteredNavLinks = computed(() =>
    this.isAdmin() ? this.navLinks : this.navLinks.filter((link) => !link.adminOnly),
  );

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
