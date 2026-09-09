import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * PLACEHOLDER — this project has no backend, so nothing issues or verifies a token.
 * The value below is the session's email: it is not signed, carries no expiry and proves
 * nothing, and it is sent only so the interceptor wiring itself is exercised. Against a
 * real API this reads the credential the login response returned and the header carries
 * that instead; the `Bearer` scheme name is kept so the swap is a one-line change.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  // Stand-in for a real bearer token — see the note above.
  const token = authService.currentUser()?.email;

  if (token) {
    const modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(modifiedReq);
  }
  return next(req);
};
