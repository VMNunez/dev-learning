import { effect, Injectable, signal } from '@angular/core';
import type { SessionUser, User } from '../../models/user.model';

const STORAGE_KEY = 'currentUser';

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

  currentUser = signal<SessionUser | null>(this.readStoredSession());

  constructor() {
    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentUser()));
    });
  }

  login(email: string, password: string) {
    const user = this.users.find((user) => user.email === email && user.password === password);

    if (user) {
      this.currentUser.set(this.toSession(user));
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

  getUserRole() {
    return this.currentUser()?.role;
  }

  /**
   * Builds a new object with the two session fields, so the credential is dropped by
   * construction. It never mutates the matched record: `find()` returns the element of
   * `users` itself, and deleting the field there would break every later login.
   */
  private toSession({ email, role }: User): SessionUser {
    return { email, role };
  }

  /**
   * Keeps only the session fields when reading the entry back. Without this, an entry
   * written before the password was dropped would be re-persisted verbatim by the
   * `effect()` on every boot, since that effect also runs once at creation.
   */
  private readStoredSession(): SessionUser | null {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as User | null;
    return stored ? this.toSession(stored) : null;
  }
}
