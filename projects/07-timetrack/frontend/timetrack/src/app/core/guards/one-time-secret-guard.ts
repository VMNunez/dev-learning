import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { AuthService } from '../services/auth-service';

export interface HoldsOneTimeSecret {
  holdsOneTimeSecret(): boolean;
}

export const oneTimeSecretGuard: CanDeactivateFn<HoldsOneTimeSecret> = (component) =>
  inject(AuthService).session() === null || !component.holdsOneTimeSecret();
