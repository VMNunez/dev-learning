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
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_PAGINATOR_DEFAULT_OPTIONS,
  MatPaginatorDefaultOptions,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { catchError, EMPTY, forkJoin, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { AuthService } from '../../core/services/auth-service';
import { EntryService } from '../../core/services/entry-service';
import { withBusyId, withoutBusyId } from '../../shared/busy-ids';
import { ProjectService } from '../../core/services/project-service';
import { UserService } from '../../core/services/user-service';
import { PendingApprovals } from '../../core/state/pending-approvals';
import {
  RejectDialog,
  RejectDialogData,
} from '../../shared/components/reject-dialog/reject-dialog';
import { StatusBadge } from '../../shared/components/status-badge/status-badge';
import { recentMonths } from '../../shared/dates';
import { activeElement, refocusAfterRender, refocusAfterWrite } from '../../shared/focus';
import { apiErrorMessage } from '../../shared/models/api-error';
import { Page } from '../../shared/models/page';
import { Project } from '../../shared/models/project';
import {
  ENTRY_STATUS_LABELS,
  ENTRY_STATUSES,
  EntryStatus,
  TimeEntry,
  TimeEntryFilters,
} from '../../shared/models/time-entry';
import { User } from '../../shared/models/user';

const DEFAULT_SORT = 'date,desc';

const QUEUE_FILTERS = {
  month: '',
  userId: null,
  projectId: null,
  status: 'SUBMITTED' as EntryStatus | null,
};

@Component({
  selector: 'app-approvals',
  imports: [
    DatePipe,
    DecimalPipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinner,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatTooltip,
    StatusBadge,
  ],
  providers: [
    {
      provide: MAT_PAGINATOR_DEFAULT_OPTIONS,
      useValue: { pageSize: 10, hidePageSize: true } satisfies MatPaginatorDefaultOptions,
    },
  ],
  templateUrl: './approvals.html',
  styleUrl: './approvals.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Approvals {
  private readonly authService = inject(AuthService);
  private readonly entryService = inject(EntryService);
  private readonly projectService = inject(ProjectService);
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

  protected readonly months = recentMonths(new Date(), 12);
  protected readonly statuses = ENTRY_STATUSES;
  protected readonly statusLabels = ENTRY_STATUS_LABELS;

  protected readonly users = signal<User[] | null>(null);
  protected readonly projects = signal<Project[] | null>(null);
  protected readonly entries = signal<TimeEntry[]>([]);
  protected readonly totalElements = signal(0);
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(10);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly busyIds = signal<ReadonlySet<number>>(new Set());
  private readonly sort = signal(DEFAULT_SORT);

  protected readonly filters = new FormGroup({
    month: new FormControl(QUEUE_FILTERS.month, { nonNullable: true }),
    userId: new FormControl<number | null>(QUEUE_FILTERS.userId),
    projectId: new FormControl<number | null>(QUEUE_FILTERS.projectId),
    status: new FormControl<EntryStatus | null>(QUEUE_FILTERS.status),
  });

  private readonly filterValue = toSignal(this.filters.valueChanges, {
    initialValue: this.filters.getRawValue(),
  });

  protected readonly isQueue = computed(() => {
    const { month, userId, projectId, status } = this.filterValue();
    return !month && userId == null && projectId == null && status === QUEUE_FILTERS.status;
  });

  private readonly currentUserId = computed(() => this.authService.session()?.id ?? null);

  protected readonly canReview = (entry: TimeEntry) =>
    entry.status === 'SUBMITTED' && entry.userId !== this.currentUserId();

  protected readonly isOwnEntry = (entry: TimeEntry) => entry.userId === this.currentUserId();

  protected readonly trackById = (_index: number, entry: TimeEntry) => entry.id;

  protected readonly columns = [
    'employee',
    'hours',
    'project',
    'date',
    'description',
    'status',
    'actions',
  ];

  private readonly reload$ = new Subject<void>();

  constructor() {
    this.destroyRef.onDestroy(() => this.dialog.closeAll());

    this.reload$
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.error.set(null);
        }),
        switchMap(() => this.fetch()),
        takeUntilDestroyed(),
      )
      .subscribe(({ users, projects, page }) => {
        this.users.set(users);
        this.projects.set(projects);
        this.entries.set(page.content);
        this.totalElements.set(page.page.totalElements);
        if (this.clampPageIndex()) return;
        this.loading.set(false);
      });

    this.filters.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.pageIndex.set(0);
      this.reload();
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

  /**
   * A write can shrink the collection under a page index this page is still asking for, and the
   * server answers that with a valid, empty page rather than an error. Re-ask for the last page
   * the reported total implies, and never fewer than one page back: a count and a slice read in
   * separate statements can disagree under a concurrent write, so a total that still claims this
   * page exists must not send us to ask for it again. The index therefore always decreases, and
   * page 0 is the floor the guard above stops at.
   */
  private clampPageIndex(): boolean {
    const total = this.totalElements();
    if (this.entries().length > 0 || total === 0 || this.pageIndex() === 0) return false;

    const lastPage = Math.ceil(total / this.pageSize()) - 1;
    this.pageIndex.set(Math.min(lastPage, this.pageIndex() - 1));
    this.reload();
    return true;
  }

  onPage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.reload();
  }

  onSort(sort: Sort): void {
    this.sort.set(sort.direction ? `${sort.active},${sort.direction}` : DEFAULT_SORT);
    this.pageIndex.set(0);
    this.reload();
  }

  showQueue(): void {
    this.filters.setValue(QUEUE_FILTERS);
  }

  approve(entry: TimeEntry): void {
    if (this.busyIds().has(entry.id)) return;

    const pressed = activeElement();
    this.busyIds.update((ids) => withBusyId(ids, entry.id));

    this.entryService
      .approveEntry(entry.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.busyIds.update((ids) => withoutBusyId(ids, entry.id));
          this.snackBar.open('Entry approved', 'Close', { duration: 4000 });
          refocusAfterWrite(pressed, this.pageHeading().nativeElement);
          this.reload();
          this.pendingApprovals.refresh();
        },
        error: (err: unknown) => {
          this.busyIds.update((ids) => withoutBusyId(ids, entry.id));
          this.snackBar.open(
            apiErrorMessage(err, 'Could not approve the entry. Try again.'),
            'Close',
            { duration: 6000 },
          );
        },
      });
  }

  openReject(entry: TimeEntry): void {
    if (this.busyIds().has(entry.id)) return;

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
        refocusAfterWrite(pressed, this.pageHeading().nativeElement);
        this.reload();
        this.pendingApprovals.refresh();
      });
  }

  private fetch(): Observable<{ users: User[]; projects: Project[]; page: Page<TimeEntry> }> {
    const loadedUsers = this.users();
    const loadedProjects = this.projects();

    return forkJoin({
      users: loadedUsers ? of(loadedUsers) : this.userService.getUsers(),
      projects: loadedProjects ? of(loadedProjects) : this.projectService.getProjects(),
      page: this.entryService.getEntries(this.currentFilters(), {
        page: this.pageIndex(),
        size: this.pageSize(),
        sort: this.sort(),
      }),
    }).pipe(
      catchError((err: unknown) => {
        this.error.set(
          apiErrorMessage(err, 'Could not load the approvals queue. Check your connection.'),
        );
        this.loading.set(false);
        refocusAfterRender(this.injector, [this.pageHeading().nativeElement]);
        return EMPTY;
      }),
    );
  }

  private currentFilters(): TimeEntryFilters {
    const { month, userId, projectId, status } = this.filters.getRawValue();
    return {
      month: month || undefined,
      userId: userId ?? undefined,
      projectId: projectId ?? undefined,
      status: status ?? undefined,
    };
  }
}
