import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../services/auth-service';
import { HoldsOneTimeSecret, oneTimeSecretGuard } from './one-time-secret-guard';

describe('oneTimeSecretGuard', () => {
  const session = signal<object | null>(null);

  const executeGuard = (holding: boolean) => {
    const page: HoldsOneTimeSecret = { holdsOneTimeSecret: () => holding };
    return TestBed.runInInjectionContext(() =>
      oneTimeSecretGuard(
        page,
        {} as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot,
        {} as RouterStateSnapshot,
      ),
    );
  };

  beforeEach(() => {
    session.set({ token: 'token' });
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: { session } }],
    });
  });

  it('lets the page go when it shows no secret', () => {
    expect(executeGuard(false)).toBe(true);
  });

  it('keeps the page while it shows a secret', () => {
    expect(executeGuard(true)).toBe(false);
  });

  it('lets an ended session leave for /login even while a secret is shown', () => {
    session.set(null);
    expect(executeGuard(true)).toBe(true);
  });
});
