import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Route, UrlSegment } from '@angular/router';
import { AuthResponse } from '../../shared/models/auth';
import { AuthService } from '../services/auth-service';

import { roleMatch } from './role-match';

describe('roleMatch', () => {
  const session = signal<AuthResponse | null>(null);
  const route: Route = {};
  const segments: UrlSegment[] = [];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: { session } }],
    });
  });

  it('matches only a session holding the given role', () => {
    session.set({ token: 't', id: 1, name: 'Ana', role: 'EMPLOYEE' });

    const employee = TestBed.runInInjectionContext(() => roleMatch('EMPLOYEE')(route, segments));
    const manager = TestBed.runInInjectionContext(() => roleMatch('MANAGER')(route, segments));

    expect(employee).toBe(true);
    expect(manager).toBe(false);
  });

  it('matches nothing without a session', () => {
    session.set(null);

    const employee = TestBed.runInInjectionContext(() => roleMatch('EMPLOYEE')(route, segments));

    expect(employee).toBe(false);
  });
});
