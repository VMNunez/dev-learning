import { DatePipe, DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { catchError, EMPTY, forkJoin, map, Observable, Subject, switchMap, tap } from 'rxjs';
import { AuthService } from '../../../core/services/auth-service';
import { EntryService } from '../../../core/services/entry-service';
import { ProjectService } from '../../../core/services/project-service';
import { ReportService } from '../../../core/services/report-service';
import { UserService } from '../../../core/services/user-service';
import { PendingApprovals } from '../../../core/state/pending-approvals';
import {
  RejectDialog,
  RejectDialogData,
} from '../../../shared/components/reject-dialog/reject-dialog';
import { StatCard } from '../../../shared/components/stat-card/stat-card';
import { toIsoMonth } from '../../../shared/dates';
import { refocusAfterRender } from '../../../shared/focus';
import { apiErrorMessage } from '../../../shared/models/api-error';
import { TimeEntry } from '../../../shared/models/time-entry';

interface DashboardData {
  pendingCount: number;
  teamMembers: number;
  approvedHours: number;
  activeProjects: number;
  review: TimeEntry[];
}

const REVIEW_SIZE = 5;

@Component({
  selector: 'app-manager-dashboard',
  imports: [
    DatePipe,
    DecimalPipe,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinner,
    MatTableModule,
    MatTooltip,
    StatCard,
  ],
  templateUrl: './manager-dashboard.html',
  styleUrl: './manager-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagerDashboard {
  private readonly authService = inject(AuthService);
  private readonly entryService = inject(EntryService);
  private readonly projectService = inject(ProjectService);
  private readonly reportService = inject(ReportService);
  private readonly userService = inject(UserService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);
  private readonly pendingApprovals = inject(PendingApprovals);

  private readonly pageHeading = viewChild.required<string, ElementRef<HTMLHeadingElement>>(
    'pageHeading',
    { read: ElementRef },
  );

  protected readonly userName = computed(() => this.authService.session()?.name ?? '');
  protected readonly reviewColumns = ['employee', 'hours', 'project', 'date', 'actions'];
  protected readonly data = signal<DashboardData | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly busyEntryId = signal<number | null>(null);

  private readonly currentUserId = computed(() => this.authService.session()?.id ?? null);
  protected readonly isOwnEntry = (entry: TimeEntry) => entry.userId === this.currentUserId();

  protected readonly trackById = (_index: number, entry: TimeEntry) => entry.id;

  private readonly reload$ = new Subject<void>();

  constructor() {
    this.destroyRef.onDestroy(() => this.dialog.closeAll());

    this.reload$
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.error.set(null);
        }),
        switchMap(() =>
          this.fetch().pipe(
            catchError((err: unknown) => {
              this.error.set(apiErrorMessage(err, "Could not load your team's dashboard."));
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

  approve(entry: TimeEntry): void {
    if (this.busyEntryId() === entry.id) return;

    const pressed = activeElement();
    this.busyEntryId.set(entry.id);

    this.entryService
      .approveEntry(entry.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.busyEntryId.set(null);
          this.snackBar.open('Entry approved', 'Close', { duration: 4000 });
          if (activeElement() === pressed || activeElement() === document.body) {
            this.pageHeading().nativeElement.focus();
          }
          this.reload();
          this.pendingApprovals.refresh();
        },
        error: (err: unknown) => {
          this.busyEntryId.set(null);
          this.snackBar.open(
            apiErrorMessage(err, 'Could not approve the entry. Try again.'),
            'Close',
            { duration: 6000 },
          );
        },
      });
  }

  openReject(entry: TimeEntry): void {
    if (this.busyEntryId() === entry.id) return;

    const pressed = activeElement();

    this.dialog
      .open<RejectDialog, RejectDialogData, boolean>(RejectDialog, {
        data: { entry },
        disableClose: true,
        restoreFocus: false,
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((rejected) => {
        if (rejected !== true) {
          pressed?.focus();
          return;
        }

        this.snackBar.open('Entry rejected', 'Close', { duration: 4000 });
        this.pageHeading().nativeElement.focus();
        this.reload();
        this.pendingApprovals.refresh();
      });
  }

  private fetch(): Observable<DashboardData> {
    return forkJoin({
      summary: this.reportService.getSummary(toIsoMonth(new Date())),
      users: this.userService.getUsers(),
      projects: this.projectService.getProjects(),
      pending: this.entryService.getEntries(
        { status: 'SUBMITTED' },
        { page: 0, size: REVIEW_SIZE },
      ),
    }).pipe(
      map(({ summary, users, projects, pending }) => ({
        pendingCount: pending.page.totalElements,
        teamMembers: users.filter((user) => user.active).length,
        approvedHours: summary.approvedHours,
        activeProjects: projects.filter((project) => project.active).length,
        review: pending.content,
      })),
    );
  }
}

function activeElement(): HTMLElement | null {
  const active = document.activeElement;
  return active instanceof HTMLElement ? active : null;
}
