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
  // Declared before `session`: field initializers run in order, and `session`'s can raise this flag —
  // declared after it, `= false` would run second and erase the notice it just set.
  private sessionExpired = false;
  readonly session = signal<AuthResponse | null>(this.readStoredSession());
  readonly isLoggedIn = computed(() => !!this.session());

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

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      console.error('Stored session could not be parsed; starting logged out.', error);
    }

    if (isAuthResponse(parsed)) return parsed;

    // A session this build cannot read — saved by an older one, or edited by hand — ends the way an
    // expired token does: removed, so the next visit does not repeat it, and explained on /login
    // (§14 Login error row) instead of a silent logout on every reload.
    localStorage.removeItem(SESSION_KEY);
    this.sessionExpired = true;
    return null;
  }
}
