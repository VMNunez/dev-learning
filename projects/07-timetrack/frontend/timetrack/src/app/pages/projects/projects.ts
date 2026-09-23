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
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { catchError, EMPTY, filter, Observable, Subject, switchMap, tap } from 'rxjs';
import { ProjectService } from '../../core/services/project-service';
import {
  ConfirmDialog,
  ConfirmDialogData,
} from '../../shared/components/confirm-dialog/confirm-dialog';
import { StatCard } from '../../shared/components/stat-card/stat-card';
import { refocusAfterRender } from '../../shared/focus';
import { apiErrorMessage } from '../../shared/models/api-error';
import { Project } from '../../shared/models/project';
import { ProjectDialog, ProjectDialogData } from './project-dialog/project-dialog';

@Component({
  selector: 'app-projects',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatProgressSpinner,
    MatSortModule,
    MatTableModule,
    MatTooltip,
    StatCard,
  ],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Projects {
  private readonly projectService = inject(ProjectService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);

  private readonly newProjectButton = viewChild.required<string, ElementRef<HTMLButtonElement>>(
    'newProjectButton',
    { read: ElementRef },
  );

  private readonly pageHeading = viewChild.required<string, ElementRef<HTMLHeadingElement>>(
    'pageHeading',
    { read: ElementRef },
  );

  protected readonly columns = ['name', 'description', 'status', 'actions'];
  protected readonly projects = signal<Project[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly busyProjectId = signal<number | null>(null);

  protected readonly counts = computed(() => {
    if (this.loading() && this.projects().length === 0) return null;

    const projects = this.projects();
    const active = projects.filter((project) => project.active).length;
    return { total: projects.length, active, inactive: projects.length - active };
  });

  private readonly sort = signal<Sort>({ active: 'name', direction: 'asc' });

  protected readonly sortedProjects = computed(() => {
    const { active, direction } = this.sort();
    const projects = this.projects();

    if (active === 'status') {
      const activeFirst = direction === 'asc' ? -1 : 1;
      return [...projects].sort((a, b) =>
        a.active === b.active ? 0 : a.active ? activeFirst : -activeFirst,
      );
    }

    return direction === 'desc' ? [...projects].reverse() : projects;
  });

  protected readonly trackById = (_index: number, project: Project) => project.id;

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
      .subscribe((projects) => {
        this.projects.set(projects);
        this.loading.set(false);
        this.restoreFocus();
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

  onSort(sort: Sort): void {
    this.sort.set(sort);
  }

  openCreate(): void {
    this.openDialog(null);
  }

  openEdit(project: Project): void {
    if (this.busyProjectId() === project.id) return;
    this.openDialog(project);
  }

  toggleActive(project: Project): void {
    if (this.busyProjectId() === project.id) return;

    if (!project.active) {
      this.run(
        project,
        this.projectService.updateProject(project.id, {
          name: project.name,
          description: project.description,
          active: true,
        }),
        'Project reactivated',
      );
      return;
    }

    this.dialog
      .open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, {
        data: {
          title: 'Deactivate project?',
          message: `${project.name} keeps the hours already logged against it, but stops accepting new entries.`,
          confirmLabel: 'Deactivate',
          destructive: true,
        },
      })
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed === true),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() =>
        this.run(project, this.projectService.deactivateProject(project.id), 'Project deactivated'),
      );
  }

  private fetch(): Observable<Project[]> {
    return this.projectService.getProjects().pipe(
      catchError((err: unknown) => {
        this.error.set(apiErrorMessage(err, 'Could not load the projects. Check your connection.'));
        this.loading.set(false);
        this.refocusAfterReload = null;
        refocusAfterRender(this.injector, [this.pageHeading().nativeElement]);
        return EMPTY;
      }),
    );
  }

  private openDialog(project: Project | null): void {
    const opener = activeElement();

    this.dialog
      .open<ProjectDialog, ProjectDialogData, boolean>(ProjectDialog, {
        data: { project },
        disableClose: true,
      })
      .afterClosed()
      .pipe(
        filter((saved) => saved === true),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.snackBar.open(project ? 'Project updated' : 'Project created', 'Close', {
          duration: 4000,
        });
        this.refocusAfterReload = opener;
        this.reload();
      });
  }

  private run(project: Project, action$: Observable<unknown>, successMessage: string): void {
    const pressed = activeElement();
    this.busyProjectId.set(project.id);

    action$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.busyProjectId.set(null);
        this.snackBar.open(successMessage, 'Close', { duration: 4000 });
        this.refocusAfterReload = pressed;
        this.reload();
      },
      error: (err: unknown) => {
        this.busyProjectId.set(null);
        this.snackBar.open(apiErrorMessage(err, 'The action failed. Try again.'), 'Close', {
          duration: 6000,
        });
      },
    });
  }

  private restoreFocus(): void {
    const target = this.refocusAfterReload;
    this.refocusAfterReload = null;
    if (!target) return;

    refocusAfterRender(this.injector, [target, this.newProjectButton().nativeElement]);
  }
}

function activeElement(): HTMLElement | null {
  const active = document.activeElement;
  return active instanceof HTMLElement ? active : null;
}
