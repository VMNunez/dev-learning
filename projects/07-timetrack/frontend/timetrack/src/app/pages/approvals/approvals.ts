import { DatePipe, DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
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
import { EntryService } from '../../core/services/entry-service';
import { ProjectService } from '../../core/services/project-service';
import { UserService } from '../../core/services/user-service';
import {
  RejectDialog,
  RejectDialogData,
} from '../../shared/components/reject-dialog/reject-dialog';
import { StatusBadge } from '../../shared/components/status-badge/status-badge';
import { recentMonths } from '../../shared/dates';
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

// The queue the page opens on: everything still waiting, oldest submissions included. The month
// filter deliberately starts empty, unlike /entries — a review queue scoped to the current month
// would hide last month's submissions behind a filter nobody set, while the shell's badge kept
// counting them.
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
  // Provided here rather than in app.config.ts, as on /entries: the paginator and everything it
  // pulls in stay out of the initial bundle, and ten rows is the page the layout is designed around.
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
  private readonly entryService = inject(EntryService);
  private readonly projectService = inject(ProjectService);
  private readonly userService = inject(UserService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  // Approving or rejecting takes the row out of the queue, so the control the user pressed is always
  // destroyed by the refetch (§14: a mutation must not destroy the control that holds focus). This
  // page has no header action to fall back on — it creates nothing — so the target is its own
  // heading, which every write survives.
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
  protected readonly busyEntryId = signal<number | null>(null);
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

  // An empty table means two different things, and the filters are what tell them apart: untouched,
  // it is the queue itself being empty — the good state the page exists to report. Narrowed by hand,
  // it is a search that matched nothing.
  protected readonly isQueue = computed(() => {
    const { month, userId, projectId, status } = this.filterValue();
    return !month && userId == null && projectId == null && status === QUEUE_FILTERS.status;
  });

  protected readonly trackById = (_index: number, entry: TimeEntry) => entry.id;

  protected readonly columns = [
    'employee',
    'project',
    'date',
    'hours',
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

  // The way back from a search that matched nothing, and the only control that empty state offers:
  // this page's job is the pending queue, so that is where a reset lands.
  showQueue(): void {
    this.filters.setValue(QUEUE_FILTERS);
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
          // Only while the user has not moved on themselves: the filter bar stays enabled during
          // the write, so a select opened meanwhile would have its focus trap broken by an
          // unconditional move, and a user who tabbed away would be dragged back (§14).
          if (activeElement() === pressed || activeElement() === document.body) {
            this.pageHeading().nativeElement.focus();
          }
          this.reload();
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

  // The dialog owns the write (§6): it is the one the API can refuse field by field, so the note
  // stays under its own input and nothing typed is lost. The page only refetches afterwards.
  openReject(entry: TimeEntry): void {
    if (this.busyEntryId() === entry.id) return;

    const pressed = activeElement();

    this.dialog
      .open<RejectDialog, RejectDialogData, boolean>(RejectDialog, {
        data: { entry },
        disableClose: true,
        // Material's own restore would put focus back on the ✕ the refetch is about to remove, and
        // it runs on close whatever the outcome. Both branches are set by hand instead: back to the
        // button when the manager changed their mind, to the heading when the row is leaving. No
        // condition is needed here — a modal traps focus, so it cannot have moved anywhere else.
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
      });
  }

  private fetch(): Observable<{ users: User[]; projects: Project[]; page: Page<TimeEntry> }> {
    // Both option lists are read once, with the page's first load: they do not change while the
    // manager works through the queue, and refetching them after every approval would cost two
    // calls a row for two lists nobody touched.
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

function activeElement(): HTMLElement | null {
  const active = document.activeElement;
  return active instanceof HTMLElement ? active : null;
}
