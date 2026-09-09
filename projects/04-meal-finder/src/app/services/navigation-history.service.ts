import { computed, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

/**
 * Counts the navigations this application instance has performed, so a page can
 * tell a visit reached through the app from one opened directly on its URL.
 */
@Injectable({
  providedIn: 'root',
})
export class NavigationHistoryService {
  private router = inject(Router);

  private readonly navigations = signal<number>(0);

  /** False on the first page of a session: there is no earlier in-app entry to return to. */
  readonly canGoBack = computed(() => this.navigations() > 1);

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.navigations.update((count) => count + 1));
  }
}
