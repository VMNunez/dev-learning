import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthResponse, isRole, LoginRequest } from '../../shared/models/auth.models';
import { Observable, tap } from 'rxjs';

const SESSION_KEY = 'timetrack_session';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authUrl = `${environment.apiUrl}/auth`;

  readonly session = signal<AuthResponse | null>(this.readStoredSession());

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.authUrl}/login`, request)
      .pipe(tap((response) => this.saveSession(response)));
  }

  logout() {
    localStorage.removeItem(SESSION_KEY);
    this.session.set(null);
  }

  private saveSession(response: AuthResponse) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(response));
    this.session.set(response);
  }

  private readStoredSession(): AuthResponse | null {
    const raw = localStorage.getItem(SESSION_KEY);

    if (!raw) return null;

    try {
      const parsed: unknown = JSON.parse(raw);
      return this.isStoredSession(parsed) ? parsed : null;
    } catch (error) {
      console.error('Stored session could not be parsed; starting logged out.', error);
      return null;
    }
  }

  private isStoredSession(value: unknown): value is AuthResponse {
    if (typeof value !== 'object' || value === null) return false;

    const candidate = value as Partial<AuthResponse>;
    return (
      typeof candidate.name === 'string' &&
      typeof candidate.token === 'string' &&
      isRole(candidate.role)
    );
  }
}
