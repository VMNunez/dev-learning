import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { Role } from '../../shared/models/auth';
import { AuthService } from '../services/auth-service';

export function roleMatch(role: Role): CanMatchFn {
  return () => inject(AuthService).session()?.role === role;
}
