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

// The first page of the queue: the dashboard is a glance, and /approvals holds the rest.
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
  // The shell's badge counts this queue; each write re-reads it so the two never disagree (§13).
  private readonly pendingApprovals = inject(PendingApprovals);

  // Approving or rejecting takes the row out of the list, so the control the user pressed is always
  // destroyed by the refetch (§14: a mutation must not destroy the control that holds focus). The
  // heading survives every write, as on /approvals, and every reload Retry starts.
  private readonly pageHeading = viewChild.required<string, ElementRef<HTMLHeadingElement>>(
    'pageHeading',
    { read: ElementRef },
  );

  protected readonly userName = computed(() => this.authService.session()?.name ?? '');
  protected readonly reviewColumns = ['employee', 'project', 'date', 'hours', 'actions'];
  // Kept across a refetch: every approval reloads the dashboard, and blanking four numbers the page is
  // still showing would read as breakage rather than as loading (§14, the same answer as Projects).
  protected readonly data = signal<DashboardData | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly busyEntryId = signal<number | null>(null);

  // §8 refuses a review of the caller's own entry, and the queue is shared, so that row keeps its place
  // for the manager who can review it and only its two buttons go — the same rule as /approvals.
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

  // Retry sits in the error block its own reload takes away, so the focus it held would fall to
  // `<body>`; the heading is on screen in every state, failed again or loaded.
  retry(): void {
    this.reload();
    refocusAfterRender(this.injector, [this.pageHeading().nativeElement]);
  }

  approve(entry: TimeEntry): void {
    // The row's buttons stay focusable while their write is in flight (`disabledInteractive`), so
    // this guard is what keeps one action per row at a time.
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
          // Only while the user has not moved on themselves: a dialog opened meanwhile would have its
          // focus trap broken by an unconditional move (§14).
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

  // The dialog owns the write (§6); the dashboard only refetches once it reports a rejection.
  openReject(entry: TimeEntry): void {
    if (this.busyEntryId() === entry.id) return;

    const pressed = activeElement();

    this.dialog
      .open<RejectDialog, RejectDialogData, boolean>(RejectDialog, {
        data: { entry },
        disableClose: true,
        // Material's own restore would put focus back on the ✕ the refetch is about to remove, so
        // both branches are set by hand, as on /approvals.
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
    // Four independent calls, one all-or-nothing result: a dashboard showing three of its four numbers
    // would be misleading, so any failure fails the whole load (§14).
    return forkJoin({
      summary: this.reportService.getSummary(toIsoMonth(new Date())),
      users: this.userService.getUsers(),
      projects: this.projectService.getProjects(),
      // The list and the "Pending approval" count are one query: the paged response carries the
      // count of every SUBMITTED entry, not just the ones on its first page.
      pending: this.entryService.getEntries(
        { status: 'SUBMITTED' },
        { page: 0, size: REVIEW_SIZE },
      ),
    }).pipe(
      map(({ summary, users, projects, pending }) => ({
        pendingCount: pending.page.totalElements,
        // `GET /api/users` also returns deactivated accounts; they log no hours, so they are not team.
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
