import { DecimalPipe } from '@angular/common';
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
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { catchError, EMPTY, forkJoin, Observable, Subject, switchMap, tap } from 'rxjs';
import { ReportService } from '../../core/services/report-service';
import { StatCard } from '../../shared/components/stat-card/stat-card';
import { recentMonths } from '../../shared/dates';
import { refocusAfterRender } from '../../shared/focus';
import { apiErrorMessage } from '../../shared/models/api-error';
import { ProjectHours, ReportSummary, UserHours } from '../../shared/models/report';

interface ReportData {
  summary: ReportSummary;
  byProject: ProjectHours[];
  byUser: UserHours[];
}

@Component({
  selector: 'app-reports',
  imports: [
    DecimalPipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatProgressSpinner,
    MatSelectModule,
    MatTableModule,
    StatCard,
  ],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Reports {
  private readonly reportService = inject(ReportService);
  private readonly injector = inject(Injector);

  private readonly pageHeading = viewChild.required<string, ElementRef<HTMLHeadingElement>>(
    'pageHeading',
    { read: ElementRef },
  );

  protected readonly months = recentMonths(new Date(), 12);
  protected readonly month = new FormControl(this.months[0].value, { nonNullable: true });
  private readonly selectedMonth = toSignal(this.month.valueChanges, {
    initialValue: this.month.value,
  });
  protected readonly monthLabel = computed(
    () => this.months.find((option) => option.value === this.selectedMonth())?.label ?? '',
  );

  protected readonly projectColumns = ['project', 'hours'];
  protected readonly userColumns = ['employee', 'hours'];
  protected readonly data = signal<ReportData | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly isEmpty = computed(() => {
    const current = this.data();
    return current !== null && current.byProject.length === 0 && current.byUser.length === 0;
  });

  protected readonly trackByProject = (_index: number, row: ProjectHours) => row.projectId;
  protected readonly trackByUser = (_index: number, row: UserHours) => row.userId;

  private readonly reload$ = new Subject<void>();

  constructor() {
    this.reload$
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.error.set(null);
          this.data.set(null);
        }),
        switchMap(() =>
          this.fetch(this.month.value).pipe(
            catchError((err: unknown) => {
              this.error.set(apiErrorMessage(err, 'Could not load the report for this month.'));
              this.loading.set(false);
              refocusAfterRender(this.injector, [this.pageHeading().nativeElement]);
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

    this.month.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.reload());

    this.reload();
  }

  reload(): void {
    this.reload$.next();
  }

  retry(): void {
    this.reload();
    refocusAfterRender(this.injector, [this.pageHeading().nativeElement]);
  }

  private fetch(month: string): Observable<ReportData> {
    return forkJoin({
      summary: this.reportService.getSummary(month),
      byProject: this.reportService.getHoursByProject(month),
      byUser: this.reportService.getHoursByUser(month),
    });
  }
}
