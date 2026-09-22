import { DatePipe, DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { catchError, EMPTY, forkJoin, map, Observable, Subject, switchMap, tap } from 'rxjs';
import { AuthService } from '../../../core/services/auth-service';
import { EntryService } from '../../../core/services/entry-service';
import { ReportService } from '../../../core/services/report-service';
import { StatCard } from '../../../shared/components/stat-card/stat-card';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';
import { toIsoMonth } from '../../../shared/dates';
import { refocusAfterRender } from '../../../shared/focus';
import { apiErrorMessage } from '../../../shared/models/api-error';
import { ReportSummary } from '../../../shared/models/report';
import { TimeEntry } from '../../../shared/models/time-entry';

interface DashboardData {
  summary: ReportSummary;
  submittedCount: number;
  draftCount: number;
  recent: TimeEntry[];
  hasEntries: boolean;
}

const RECENT_SIZE = 5;
const COUNT_ONLY = { page: 0, size: 1 };

@Component({
  selector: 'app-employee-dashboard',
  imports: [
    DatePipe,
    DecimalPipe,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinner,
    MatTableModule,
    StatCard,
    StatusBadge,
  ],
  templateUrl: './employee-dashboard.html',
  styleUrl: './employee-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeDashboard {
  private readonly authService = inject(AuthService);
  private readonly entryService = inject(EntryService);
  private readonly reportService = inject(ReportService);
  private readonly injector = inject(Injector);

  private readonly pageHeading = viewChild.required<string, ElementRef<HTMLHeadingElement>>(
    'pageHeading',
    { read: ElementRef },
  );

  protected readonly userName = computed(() => this.authService.session()?.name ?? '');
  protected readonly recentColumns = ['project', 'date', 'hours', 'description', 'status'];
  protected readonly data = signal<DashboardData | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  private readonly reload$ = new Subject<void>();

  constructor() {
    this.reload$
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.error.set(null);
        }),
        switchMap(() =>
          this.fetch().pipe(
            catchError((err: unknown) => {
              this.error.set(apiErrorMessage(err, 'Could not load your dashboard.'));
              this.loading.set(false);
              return EMPTY;
            }),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((data) => {
        this.data.set(data);
        this.loading.set(false);
      });

    this.reload();
  }

  reload(): void {
    this.reload$.next();
  }

  retry(): void {
    this.reload();
    refocusAfterRender(this.injector, [this.pageHeading().nativeElement]);
  }

  private fetch(): Observable<DashboardData> {
    return forkJoin({
      summary: this.reportService.getSummary(toIsoMonth(new Date())),
      submitted: this.entryService.getEntries({ status: 'SUBMITTED' }, COUNT_ONLY),
      drafts: this.entryService.getEntries({ status: 'DRAFT' }, COUNT_ONLY),
      recent: this.entryService.getEntries({}, { page: 0, size: RECENT_SIZE }),
    }).pipe(
      map(({ summary, submitted, drafts, recent }) => ({
        summary,
        submittedCount: submitted.page.totalElements,
        draftCount: drafts.page.totalElements,
        recent: recent.content,
        hasEntries: recent.page.totalElements > 0,
      })),
    );
  }
}
