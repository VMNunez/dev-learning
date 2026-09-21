import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthResponse, isAuthResponse, LoginRequest } from '../../shared/models/auth';
import { map, Observable, tap } from 'rxjs';

const SESSION_KEY = 'timetrack_session';

// A `200` whose body is not an `AuthResponse`: the frontend and the API disagree about the contract,
// which is what a staged deploy or an API that was not restarted produces. Thrown so the login fails
// on the form, where the user can act on it, instead of one reload later. The page words it.
export class UnreadableSessionError extends Error {
  constructor() {
    super('The login response is not an AuthResponse.');
    this.name = 'UnreadableSessionError';
  }
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authUrl = `${environment.apiUrl}/auth`;
  readonly session = signal<AuthResponse | null>(this.readStoredSession());
  readonly isLoggedIn = computed(() => !!this.session());
  private sessionExpired = false;

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<unknown>(`${this.authUrl}/login`, request).pipe(
      map((response) => {
        if (!isAuthResponse(response)) throw new UnreadableSessionError();
        return response;
      }),
      tap((session) => this.saveSession(session)),
    );
  }

  logout() {
    localStorage.removeItem(SESSION_KEY);
    this.session.set(null);
    this.sessionExpired = false;
  }

  expireSession() {
    this.logout();
    this.sessionExpired = true;
  }

  consumeSessionExpired(): boolean {
    const expired = this.sessionExpired;
    this.sessionExpired = false;
    return expired;
  }

  private saveSession(session: AuthResponse) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    this.session.set(session);
  }

  private readStoredSession(): AuthResponse | null {
    const raw = localStorage.getItem(SESSION_KEY);

    if (!raw) return null;

    try {
      const parsed: unknown = JSON.parse(raw);
      return isAuthResponse(parsed) ? parsed : null;
    } catch (error) {
      console.error('Stored session could not be parsed; starting logged out.', error);
      return null;
    }
  }
}
