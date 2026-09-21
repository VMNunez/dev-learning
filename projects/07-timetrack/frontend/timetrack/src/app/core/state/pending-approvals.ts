import { inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, map, Observable, of, Subject, switchMap } from 'rxjs';
import { EntryService } from '../services/entry-service';

type Request = 'refresh' | 'clear';

// The count of SUBMITTED entries the shell's Approvals badge shows, held once for the whole app (§6
// State ownership, §13). Every other number on screen belongs to the page that loads it; this one is
// drawn by the shell and changed by the pages under it, so it lives where both reach it: the shell
// re-reads it after each navigation, and a page after each approval or rejection it makes, so the
// badge never disagrees with the queue beside it.
@Injectable({
  providedIn: 'root',
})
export class PendingApprovals {
  private readonly entryService = inject(EntryService);
  private readonly pending = signal(0);
  // Read-only outside: `refresh()` and `clear()` are the only writers, so no reader can set a count the
  // API never returned.
  readonly count = this.pending.asReadonly();

  private readonly requests$ = new Subject<Request>();

  constructor() {
    // One stream for both requests, so the latest always wins: a refresh still in flight when the
    // session ends is cancelled by the clear, instead of landing afterwards and showing the next
    // manager to log in the last one's count.
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
      // A count that fails to load keeps its last value rather than turning the shell into an error:
      // the Approvals page itself reports the failure when it is opened.
      catchError(() => EMPTY),
    );
  }
}
