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

  private toSession({ email, role }: SessionUser): SessionUser {
    return { email, role };
  }

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

  private isStoredSession(value: unknown): value is SessionUser {
    if (typeof value !== 'object' || value === null) return false;

    const candidate = value as Partial<SessionUser>;
    return typeof candidate.email === 'string' && isRole(candidate.role);
  }
}
