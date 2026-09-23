import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Injector,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { filter, Observable } from 'rxjs';
import { ProjectService } from '../../../core/services/project-service';
import { confirmDiscard } from '../../../shared/components/confirm-dialog/confirm-discard';
import { apiErrorMessage, placeFieldErrors } from '../../../shared/models/api-error';
import { refocusAfterFailedSave } from '../../../shared/focus';
import { notBlank } from '../../../shared/validators';
import { CreateProjectRequest, Project } from '../../../shared/models/project';

export interface ProjectDialogData {
  project: Project | null;
}

const FORM_FIELDS = ['name', 'description'] as const;

@Component({
  selector: 'app-project-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinner,
  ],
  templateUrl: './project-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDialog {
  private readonly projectService = inject(ProjectService);
  private readonly dialogRef = inject(MatDialogRef<ProjectDialog, boolean>);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly data = inject<ProjectDialogData>(MAT_DIALOG_DATA);

  protected readonly project = this.data.project;
  protected readonly isEdit = this.project !== null;
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = new FormGroup({
    name: new FormControl(this.project?.name ?? '', {
      nonNullable: true,
      validators: [Validators.required, notBlank, Validators.maxLength(255)],
    }),
    description: new FormControl(this.project?.description ?? '', {
      nonNullable: true,
      validators: [Validators.maxLength(255)],
    }),
  });

  constructor() {
    this.dialogRef
      .keydownEvents()
      .pipe(
        filter((event) => event.key === 'Escape' && !this.saving()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.close());
  }

  close(): void {
    if (!this.form.dirty) {
      this.dialogRef.close(false);
      return;
    }

    confirmDiscard(this.dialog, this.form)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((discard) => {
        if (discard) {
          this.dialogRef.close(false);
        }
      });
  }

  save(): void {
    this.error.set(null);
    this.form.markAllAsTouched();

    if (this.form.invalid || this.saving()) return;

    this.saving.set(true);
    this.form.disable({ emitEvent: false });

    this.write()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.showError(err),
      });
  }

  private write(): Observable<Project> {
    const request = this.buildRequest();

    return this.project
      ? this.projectService.updateProject(this.project.id, request)
      : this.projectService.createProject(request);
  }

  private buildRequest(): CreateProjectRequest {
    const { name, description } = this.form.getRawValue();
    return { name: name.trim(), description: description.trim() || null };
  }

  private showError(err: HttpErrorResponse): void {
    this.saving.set(false);
    this.form.enable({ emitEvent: false });
    refocusAfterFailedSave(this.injector, this.host.nativeElement);

    if (!placeFieldErrors(err, this.form.controls, FORM_FIELDS)) {
      this.error.set(apiErrorMessage(err, 'Could not save the project. Try again.'));
    }
  }
}
