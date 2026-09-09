import { effect, Injectable, signal } from '@angular/core';
import { isRole } from '../../models/user.model';
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
  private toSession({ email, role }: SessionUser): SessionUser {
    return { email, role };
  }

  /**
   * Keeps only the session fields when reading the entry back. Without this, an entry
   * written before the password was dropped would be re-persisted verbatim by the
   * `effect()` on every boot, since that effect also runs once at creation.
   *
   * Two separate failures have to be survived here, because this runs in a field
   * initializer: anything thrown escapes the root `AuthService` constructor and the whole
   * app fails to bootstrap on a blank page, and the bad value stays in storage so every
   * reload fails the same way. `JSON.parse` throws on a truncated entry, and a *valid*
   * JSON value of the wrong shape (`"hi"`, `{}`, `[]`) throws nothing at all while
   * producing a session whose `role` is `undefined` — which `authGuard` reads as logged in.
   */
  private readStoredSession(): SessionUser | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    try {
      const parsed: unknown = JSON.parse(raw);
      return this.isStoredSession(parsed) ? this.toSession(parsed) : null;
    } catch (error) {
      console.error('Stored session could not be parsed; starting logged out.', error);
      return null;
    }
  }

  /**
   * Narrows the parsed value before it is trusted. `parsed` is `unknown`, so every field
   * the session needs is checked here rather than asserted with `as`.
   */
  private isStoredSession(value: unknown): value is SessionUser {
    if (typeof value !== 'object' || value === null) return false;

    const candidate = value as Partial<SessionUser>;
    return typeof candidate.email === 'string' && isRole(candidate.role);
  }
}
