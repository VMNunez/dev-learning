import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { AuthService } from '../services/auth-service';

// A page that can be showing a value the app can never fetch again — a generated password exists in
// the browser only in the response that carried it — or waiting for the request that returns one.
export interface HoldsOneTimeSecret {
  holdsOneTimeSecret(): boolean;
}

// Refuses to leave the page while it shows a one-time secret, so the browser's Back button cannot
// destroy it — the dialog showing it must also opt out of `closeOnNavigation`, which disposes it on the
// history change itself, before any guard runs. A session that has ended always leaves: the
// interceptor's `401` and logout clear it before they route to /login, and a guard that held the user
// there would trap them on an expired session.
export const oneTimeSecretGuard: CanDeactivateFn<HoldsOneTimeSecret> = (component) =>
  inject(AuthService).session() === null || !component.holdsOneTimeSecret();
