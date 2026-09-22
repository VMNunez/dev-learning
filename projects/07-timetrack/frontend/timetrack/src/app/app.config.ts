import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import localeEnGb from '@angular/common/locales/en-GB';
import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogConfig } from '@angular/material/dialog';
import { provideRouter, TitleStrategy, withRouterConfig } from '@angular/router';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { AppTitleStrategy } from './core/strategies/app-title-strategy';

// English UI with day-first dates: the users are Spanish teams, for whom 9/19 reads backwards (§14 Dates).
registerLocaleData(localeEnGb);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: LOCALE_ID, useValue: 'en-GB' },
    // A navigation a guard cancels puts the browser back where it was: under the default 'replace' a
    // refused Back rewrites the previous history entry instead, so each further Back walks one entry
    // closer to leaving the app — and `/team`'s one-time password with it.
    provideRouter(routes, withRouterConfig({ canceledNavigationResolution: 'computed' })),
    { provide: TitleStrategy, useClass: AppTitleStrategy },
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      // No `maxWidth` here on purpose: Material's own stylesheet already caps a dialog at
      // `calc(100vw - 32px)` below 600px, which is exactly what §14 Responsive asks for. Setting it
      // would replace the 560px desktop cap with a viewport-wide one for every future dialog.
      useValue: { ...new MatDialogConfig(), width: '30rem' },
    },
  ],
};
