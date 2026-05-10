import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('06-hr-portal');
  private authService = inject(AuthService);
  private router = inject(Router);
  isLoggedIn = this.authService.currentUser;

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
