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
import { Sort } from '@angular/material/sort';
import { catchError, EMPTY, filter, forkJoin, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { AuthService } from '../../core/services/auth-service';
import { EntryService } from '../../core/services/entry-service';
import { ProjectService } from '../../core/services/project-service';
import {
  ConfirmDialog,
  ConfirmDialogData,
} from '../../shared/components/confirm-dialog/confirm-dialog';
import { recentMonths, toIsoMonth } from '../../shared/dates';
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
import { EntryDialog, EntryDialogData } from './entry-dialog/entry-dialog';
import { EntryList } from './entry-list/entry-list';

const DEFAULT_SORT = 'date,desc';

@Component({
  selector: 'app-entries',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinner,
    MatSelectModule,
    EntryList,
  ],
  // Provided here, not in app.config.ts: importing the paginator there put it and everything it pulls
  // in (select, form field, tooltip) into the initial bundle, for a component only this page renders.
  // Ten rows is the page the layout is designed around, so the paginator shows only the range and
  // the arrows: a page-size select is a full form field that turns the table footer into a form.
  providers: [
    {
      provide: MAT_PAGINATOR_DEFAULT_OPTIONS,
      useValue: { pageSize: 10, hidePageSize: true } satisfies MatPaginatorDefaultOptions,
    },
  ],
  templateUrl: './entries.html',
  styleUrl: './entries.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Entries {
  private readonly authService = inject(AuthService);
  private readonly entryService = inject(EntryService);
  private readonly projectService = inject(ProjectService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  // Deleting a row destroys the button that opened the confirmation, so the dialog's default restore
  // would leave focus on `<body>` (§14 Accessibility floor, WCAG 2.4.3). The header's action survives
  // every mutation on this page, and it is the control a keyboard user would reach for next.
  private readonly logHoursButton = viewChild<string, ElementRef<HTMLButtonElement>>(
    'logHoursButton',
    { read: ElementRef },
  );

  protected readonly isEmployee = computed(() => this.authService.session()?.role === 'EMPLOYEE');
  protected readonly months = recentMonths(new Date(), 12);
  protected readonly statuses = ENTRY_STATUSES;
  protected readonly statusLabels = ENTRY_STATUS_LABELS;

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
    month: new FormControl(toIsoMonth(new Date()), { nonNullable: true }),
    projectId: new FormControl<number | null>(null),
    status: new FormControl<EntryStatus | null>(null),
  });

  // With no filter set, an empty table means the user has no entries at all: a first-use empty state,
  // not a filter that matched nothing.
  private readonly filterValue = toSignal(this.filters.valueChanges, {
    initialValue: this.filters.getRawValue(),
  });
  protected readonly filtered = computed(() => {
    const { month, projectId, status } = this.filterValue();
    return !!month || projectId != null || status != null;
  });

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
      .subscribe(({ projects, page }) => {
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

  // The page opens on the current month, which is empty for its first days while last month's drafts
  // still wait to be submitted; this is the way out of that empty state.
  showAllMonths(): void {
    this.filters.controls.month.setValue('');
  }

  onSort(sort: Sort): void {
    this.sort.set(sort.direction ? `${sort.active},${sort.direction}` : DEFAULT_SORT);
    this.pageIndex.set(0);
    this.reload();
  }

  openCreate(): void {
    this.openDialog(null);
  }

  // The row's action buttons stay focusable while their write is in flight (`disabledInteractive`),
  // so the guard opening each of the four is what keeps one action per row at a time.
  openEdit(entry: TimeEntry): void {
    if (this.busyEntryId() === entry.id) return;
    this.openDialog(entry);
  }

  confirmDelete(entry: TimeEntry): void {
    if (this.busyEntryId() === entry.id) return;

    this.dialog
      .open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, {
        data: {
          title: 'Delete entry?',
          message: `The ${entry.hours}h draft for ${entry.projectName} will be deleted permanently.`,
          confirmLabel: 'Delete',
          destructive: true,
        },
        // `?? true` matters: the key is always present in the merged config, and `undefined` would
        // switch restoration off instead of falling back to the element that opened the dialog.
        restoreFocus: this.logHoursButton()?.nativeElement ?? true,
      })
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed === true),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() =>
        this.runAction(entry, this.entryService.deleteEntry(entry.id), 'Entry deleted'),
      );
  }

  submit(entry: TimeEntry): void {
    if (this.busyEntryId() === entry.id) return;
    this.runAction(entry, this.entryService.submitEntry(entry.id), 'Entry submitted for review');
  }

  reopen(entry: TimeEntry): void {
    if (this.busyEntryId() === entry.id) return;
    this.runAction(entry, this.entryService.reopenEntry(entry.id), 'Entry re-opened as a draft');
  }

  private fetch(): Observable<{ projects: Project[]; page: Page<TimeEntry> }> {
    const loadedProjects = this.projects();
    const projects$ = loadedProjects ? of(loadedProjects) : this.projectService.getProjects();

    return forkJoin({
      projects: projects$,
      page: this.entryService.getEntries(this.currentFilters(), {
        page: this.pageIndex(),
        size: this.pageSize(),
        sort: this.sort(),
      }),
    }).pipe(
      catchError((err: unknown) => {
        // Worded by role, the same convention the empty state follows: a manager is not looking at
        // entries of their own.
        const fallback = this.isEmployee()
          ? 'Could not load your entries. Check your connection.'
          : "Could not load the team's entries. Check your connection.";
        this.error.set(apiErrorMessage(err, fallback));
        this.loading.set(false);
        return EMPTY;
      }),
    );
  }

  private currentFilters(): TimeEntryFilters {
    const { month, projectId, status } = this.filters.getRawValue();
    return {
      month: month || undefined,
      projectId: projectId ?? undefined,
      status: status ?? undefined,
    };
  }

  // The dialog reads its project list once, at open, so it never opens before that list has loaded.
  private openDialog(entry: TimeEntry | null): void {
    const projects = this.projects();
    if (!projects) {
      return;
    }

    this.dialog
      .open<EntryDialog, EntryDialogData, boolean>(EntryDialog, {
        data: { entry, projects },
        disableClose: true,
      })
      .afterClosed()
      .pipe(
        filter((saved) => saved === true),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.snackBar.open(entry ? 'Entry updated' : 'Entry saved', 'Close', { duration: 4000 });
        this.reload();
      });
  }

  private runAction(entry: TimeEntry, action$: Observable<unknown>, successMessage: string): void {
    // Where the user is when the write starts decides whether its result may move them at all.
    const pressed = document.activeElement;
    this.busyEntryId.set(entry.id);

    action$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.busyEntryId.set(null);
        this.snackBar.open(successMessage, 'Close', { duration: 4000 });
        // A status change re-renders the row's actions into a different branch and a delete takes
        // the row away, so either way the control the user pressed is about to be destroyed. Unlike
        // the Projects row, nothing here survives the write, so focus goes to the header's own
        // action — the one target the reload cannot remove. Only when the user has not moved on
        // themselves: the header button stays enabled during the write, so a dialog opened from it
        // meanwhile would have its focus trap broken by an unconditional move, and a user who
        // tabbed away would be dragged back.
        const focusLeftNowhere =
          document.activeElement === pressed || document.activeElement === document.body;
        if (focusLeftNowhere) {
          this.logHoursButton()?.nativeElement.focus();
        }
        this.reload();
      },
      error: (err: unknown) => {
        this.busyEntryId.set(null);
        this.snackBar.open(apiErrorMessage(err, 'The action failed. Try again.'), 'Close', {
          duration: 6000,
        });
      },
    });
  }
}
