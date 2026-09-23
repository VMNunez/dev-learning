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
import { Sort } from '@angular/material/sort';
import { catchError, EMPTY, filter, forkJoin, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { AuthService } from '../../core/services/auth-service';
import { EntryService } from '../../core/services/entry-service';
import { withBusyId, withoutBusyId } from '../../shared/busy-ids';
import { ProjectService } from '../../core/services/project-service';
import {
  ConfirmDialog,
  ConfirmDialogData,
} from '../../shared/components/confirm-dialog/confirm-dialog';
import { recentMonths, toIsoMonth } from '../../shared/dates';
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
  private readonly injector = inject(Injector);

  private readonly logHoursButton = viewChild<string, ElementRef<HTMLButtonElement>>(
    'logHoursButton',
    { read: ElementRef },
  );

  private readonly pageHeading = viewChild.required<string, ElementRef<HTMLHeadingElement>>(
    'pageHeading',
    { read: ElementRef },
  );

  protected readonly isEmployee = computed(() => this.authService.session()?.role === 'EMPLOYEE');
  protected readonly months = recentMonths(new Date(), 12);
  protected readonly statuses = ENTRY_STATUSES;
  protected readonly statusLabels = ENTRY_STATUS_LABELS;

  protected readonly projects = signal<Project[] | null>(null);
  protected readonly activeProjectIds = computed(() => {
    const projects = this.projects();
    return projects
      ? new Set(projects.filter((project) => project.active).map((project) => project.id))
      : null;
  });
  protected readonly entries = signal<TimeEntry[]>([]);
  protected readonly totalElements = signal(0);
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(10);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly busyIds = signal<ReadonlySet<number>>(new Set());
  private readonly sort = signal(DEFAULT_SORT);

  protected readonly filters = new FormGroup({
    month: new FormControl(toIsoMonth(new Date()), { nonNullable: true }),
    projectId: new FormControl<number | null>(null),
    status: new FormControl<EntryStatus | null>(null),
  });

  private readonly filterValue = toSignal(this.filters.valueChanges, {
    initialValue: this.filters.getRawValue(),
  });
  protected readonly filtered = computed(() => {
    const { month, projectId, status } = this.filterValue();
    return !!month || projectId != null || status != null;
  });

  private refocusAfterReload: HTMLElement | null = null;

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
        if (this.clampPageIndex()) return;
        this.loading.set(false);
        this.restoreFocus();
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

  openEdit(entry: TimeEntry): void {
    if (this.busyIds().has(entry.id)) return;
    this.openDialog(entry);
  }

  confirmDelete(entry: TimeEntry): void {
    if (this.busyIds().has(entry.id)) return;

    this.dialog
      .open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, {
        data: {
          title: 'Delete entry?',
          message: `The ${entry.hours}h draft for ${entry.projectName} will be deleted permanently.`,
          confirmLabel: 'Delete',
          destructive: true,
        },
        restoreFocus: this.logHoursButton()?.nativeElement ?? true,
      })
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed === true),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.run(entry, this.entryService.deleteEntry(entry.id), 'Entry deleted'));
  }

  submit(entry: TimeEntry): void {
    if (this.busyIds().has(entry.id)) return;
    this.run(entry, this.entryService.submitEntry(entry.id), 'Entry submitted for review');
  }

  reopen(entry: TimeEntry): void {
    if (this.busyIds().has(entry.id)) return;
    this.run(entry, this.entryService.reopenEntry(entry.id), 'Entry re-opened as a draft');
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
        const fallback = this.isEmployee()
          ? 'Could not load your entries. Check your connection.'
          : "Could not load the team's entries. Check your connection.";
        this.error.set(apiErrorMessage(err, fallback));
        this.loading.set(false);
        this.refocusAfterReload = null;
        refocusAfterRender(this.injector, [this.pageHeading().nativeElement]);
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

  private openDialog(entry: TimeEntry | null): void {
    const projects = this.projects();
    if (!projects) {
      return;
    }

    const opener = activeElement();

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
        this.refocusAfterReload = opener;
        this.reload();
      });
  }

  private restoreFocus(): void {
    const target = this.refocusAfterReload;
    this.refocusAfterReload = null;
    if (!target) return;

    refocusAfterRender(this.injector, [target, this.logHoursButton()?.nativeElement]);
  }

  private run(entry: TimeEntry, action$: Observable<unknown>, successMessage: string): void {
    const pressed = activeElement();
    this.busyIds.update((ids) => withBusyId(ids, entry.id));

    action$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.busyIds.update((ids) => withoutBusyId(ids, entry.id));
        this.snackBar.open(successMessage, 'Close', { duration: 4000 });
        refocusAfterWrite(pressed, this.logHoursButton()?.nativeElement);
        this.reload();
      },
      error: (err: unknown) => {
        this.busyIds.update((ids) => withoutBusyId(ids, entry.id));
        this.snackBar.open(apiErrorMessage(err, 'The action failed. Try again.'), 'Close', {
          duration: 6000,
        });
      },
    });
  }
}
