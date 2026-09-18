import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { filter, Observable, switchMap } from 'rxjs';
import { EntryService } from '../../../core/services/entry-service';
import { confirmDiscard } from '../../../shared/components/confirm-dialog/confirm-discard';
import { fromIsoDate, toIsoDate } from '../../../shared/dates';
import { isApiError } from '../../../shared/models/api-error';
import { Project } from '../../../shared/models/project';
import { CreateTimeEntryRequest, TimeEntry } from '../../../shared/models/time-entry';

export interface EntryDialogData {
  entry: TimeEntry | null;
  projects: Project[];
}

interface ProjectOption {
  id: number;
  name: string;
}

const FORM_FIELDS = ['projectId', 'date', 'hours', 'description'] as const;

@Component({
  selector: 'app-entry-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatProgressSpinner,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './entry-dialog.html',
  styleUrl: './entry-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntryDialog {
  private readonly entryService = inject(EntryService);
  private readonly dialogRef = inject(MatDialogRef<EntryDialog, boolean>);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly data = inject<EntryDialogData>(MAT_DIALOG_DATA);

  protected readonly entry = this.data.entry;
  protected readonly isEdit = this.entry !== null;
  protected readonly canSubmit = this.entry?.status === 'DRAFT';
  protected readonly today = new Date();
  protected readonly projectOptions = this.buildProjectOptions();
  protected readonly saving = signal<'save' | 'submit' | null>(null);
  protected readonly error = signal<string | null>(null);

  // Once a save lands, the page must refetch even if a later step fails and the user cancels.
  private saved = false;

  protected readonly form = new FormGroup({
    projectId: new FormControl<number | null>(this.entry?.projectId ?? null, {
      validators: [Validators.required],
    }),
    date: new FormControl<Date | null>(this.entry ? fromIsoDate(this.entry.date) : this.today, {
      validators: [Validators.required],
    }),
    hours: new FormControl<number | null>(this.entry?.hours ?? null, {
      validators: [Validators.required, Validators.min(0.5), Validators.max(24)],
    }),
    description: new FormControl(this.entry?.description ?? '', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255)],
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
      this.dialogRef.close(this.saved);
      return;
    }

    confirmDiscard(this.dialog)
      .pipe(filter(Boolean), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.dialogRef.close(this.saved));
  }

  save(submitAfterSave = false): void {
    this.error.set(null);
    this.form.markAllAsTouched();

    if (this.form.invalid || this.saving()) return;

    this.saving.set(submitAfterSave ? 'submit' : 'save');
    this.form.disable({ emitEvent: false });

    this.write(submitAfterSave)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.saved = true;
          this.dialogRef.close(true);
        },
        error: (err: HttpErrorResponse) => this.showError(err),
      });
  }

  private write(submitAfterSave: boolean): Observable<TimeEntry> {
    const request = this.buildRequest();

    if (!this.entry) {
      return this.entryService.createEntry(request);
    }

    const entryId = this.entry.id;
    const update$ = this.entryService.updateEntry(entryId, request);

    if (!submitAfterSave) return update$;

    return update$.pipe(
      switchMap(() => {
        this.saved = true;
        return this.entryService.submitEntry(entryId);
      }),
    );
  }

  private buildRequest(): CreateTimeEntryRequest {
    const { projectId, date, hours, description } = this.form.getRawValue();

    // The required validators guarantee these three are set before a request is built.
    return {
      projectId: projectId!,
      date: toIsoDate(date!),
      hours: hours!,
      description,
    };
  }

  private showError(err: HttpErrorResponse): void {
    this.saving.set(null);
    this.form.enable({ emitEvent: false });

    const body = isApiError(err.error) ? err.error : null;
    let placedOnField = false;

    for (const field of FORM_FIELDS) {
      const message = body?.fieldErrors?.[field]?.[0];
      if (message) {
        this.form.controls[field].setErrors({ server: message });
        placedOnField = true;
      }
    }

    if (!placedOnField) {
      this.error.set(body?.message ?? 'Could not save the entry. Try again.');
    }
  }

  private buildProjectOptions(): ProjectOption[] {
    const options: ProjectOption[] = this.data.projects
      .filter((project) => project.active)
      .map(({ id, name }) => ({ id, name }));

    // An entry may still point at a project archived after it was logged; keep it selectable.
    if (this.entry && !options.some((option) => option.id === this.entry!.projectId)) {
      options.push({ id: this.entry.projectId, name: `${this.entry.projectName} (inactive)` });
    }

    return options;
  }
}
