import { inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, map, Observable, of, Subject, switchMap } from 'rxjs';
import { EntryService } from '../services/entry-service';

type Request = 'refresh' | 'clear';

@Injectable({
  providedIn: 'root',
})
export class PendingApprovals {
  private readonly entryService = inject(EntryService);
  private readonly pending = signal(0);
  readonly count = this.pending.asReadonly();

  private readonly requests$ = new Subject<Request>();

  constructor() {
    this.requests$
      .pipe(
        switchMap((request) => (request === 'clear' ? of(0) : this.fetchCount())),
        takeUntilDestroyed(),
      )
      .subscribe((count) => this.pending.set(count));
  }

  refresh(): void {
    this.requests$.next('refresh');
  }

  clear(): void {
    this.requests$.next('clear');
  }

  private fetchCount(): Observable<number> {
    return this.entryService.getEntries({ status: 'SUBMITTED' }, { page: 0, size: 1 }).pipe(
      map((page) => page.page.totalElements),
      catchError(() => EMPTY),
    );
  }
}
