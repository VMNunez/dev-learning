import { Injectable, signal } from '@angular/core';
import type { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private users: User[] = [
    {
      email: 'admin@hrportal.com',
      password: 'admin123',
      role: 'admin',
    },
    {
      email: 'employee@hrportal.com',
      password: 'employee123',
      role: 'employee',
    },
  ];

  currentUser = signal<User | null>(null);

  login(email: string, password: string) {
    const user = this.users.find((user) => user.email === email && user.password === password);

    if (user) {
      this.currentUser.set(user);
      return true;
    } else {
      this.currentUser.set(null);
      return false;
    }
  }

  logout() {
    this.currentUser.set(null);
  }

  isLoggedIn() {
    return !!this.currentUser();
  }
}
