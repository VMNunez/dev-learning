import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
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
import { enGB } from 'date-fns/locale';
import { filter, Observable, switchMap } from 'rxjs';
import { EntryService } from '../../../core/services/entry-service';
import { confirmDiscard } from '../../../shared/components/confirm-dialog/confirm-discard';
import { fromIsoDate, toIsoDate } from '../../../shared/dates';
import { apiErrorMessage, placeFieldErrors } from '../../../shared/models/api-error';
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

// The archived project stays in the list, so the select shows what the entry holds, but it is invalid:
// the API refuses to save or to submit an entry against it (§10), and this says so before Save does.
function activeProject(activeIds: ReadonlySet<number>): ValidatorFn {
  return (control) =>
    control.value == null || activeIds.has(control.value) ? null : { inactiveProject: true };
}

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
  // The native adapter parses typed input with Date.parse, which cannot read a day-first 19/09/2026.
  providers: [provideDateFnsAdapter(), { provide: MAT_DATE_LOCALE, useValue: enGB }],
  templateUrl: './entry-dialog.html',
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
  // Declared before the form: its validator reads this set as the control is constructed.
  private readonly activeProjectIds = new Set(
    this.data.projects.filter((project) => project.active).map((project) => project.id),
  );
  protected readonly projectOptions = this.buildProjectOptions();
  protected readonly saving = signal<'save' | 'submit' | null>(null);
  protected readonly error = signal<string | null>(null);

  // Once a save lands, the page must refetch even if a later step fails and the user cancels.
  private saved = false;

  protected readonly form = new FormGroup({
    projectId: new FormControl<number | null>(this.entry?.projectId ?? null, {
      validators: [Validators.required, activeProject(this.activeProjectIds)],
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
    // An entry on an archived project cannot be saved where it is, so the reason is shown as the
    // dialog opens rather than after a Save that could never succeed.
    if (this.form.controls.projectId.hasError('inactiveProject')) {
      this.form.controls.projectId.markAsTouched();
    }

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

    confirmDiscard(this.dialog, this.form)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((discard) => {
        if (discard) {
          this.dialogRef.close(this.saved);
        }
      });
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
        // The edit is stored now, so if the submit fails Cancel has nothing left to discard.
        this.saved = true;
        this.form.markAsPristine();
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

    if (!placeFieldErrors(err, this.form.controls, FORM_FIELDS)) {
      this.error.set(apiErrorMessage(err, 'Could not save the entry. Try again.'));
    }
  }

  private buildProjectOptions(): ProjectOption[] {
    const options: ProjectOption[] = this.data.projects
      .filter((project) => this.activeProjectIds.has(project.id))
      .map(({ id, name }) => ({ id, name }));

    // An entry may still point at a project archived after it was logged; keep it selectable.
    if (this.entry && !options.some((option) => option.id === this.entry!.projectId)) {
      options.push({ id: this.entry.projectId, name: `${this.entry.projectName} (inactive)` });
    }

    return options;
  }
}
