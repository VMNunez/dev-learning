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
import { refocusAfterFailedSave } from '../../../shared/focus';
import { notBlank } from '../../../shared/validators';
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
  providers: [provideDateFnsAdapter(), { provide: MAT_DATE_LOCALE, useValue: enGB }],
  templateUrl: './entry-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntryDialog {
  private readonly entryService = inject(EntryService);
  private readonly dialogRef = inject(MatDialogRef<EntryDialog, boolean>);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly data = inject<EntryDialogData>(MAT_DIALOG_DATA);

  protected readonly entry = this.data.entry;
  protected readonly isEdit = this.entry !== null;
  protected readonly canSubmit = this.entry?.status === 'DRAFT';
  protected readonly today = new Date();
  private readonly activeProjectIds = new Set(
    this.data.projects.filter((project) => project.active).map((project) => project.id),
  );
  protected readonly projectOptions = this.buildProjectOptions();
  protected readonly saving = signal<'save' | 'submit' | null>(null);
  protected readonly error = signal<string | null>(null);

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
      validators: [Validators.required, notBlank, Validators.maxLength(255)],
    }),
  });

  constructor() {
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
        this.saved = true;
        this.form.markAsPristine();
        return this.entryService.submitEntry(entryId);
      }),
    );
  }

  private buildRequest(): CreateTimeEntryRequest {
    const { projectId, date, hours, description } = this.form.getRawValue();

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
    refocusAfterFailedSave(this.injector, this.host.nativeElement);

    if (!placeFieldErrors(err, this.form.controls, FORM_FIELDS)) {
      this.error.set(apiErrorMessage(err, 'Could not save the entry. Try again.'));
    }
  }

  private buildProjectOptions(): ProjectOption[] {
    const options: ProjectOption[] = this.data.projects
      .filter((project) => this.activeProjectIds.has(project.id))
      .map(({ id, name }) => ({ id, name }));

    if (this.entry && !options.some((option) => option.id === this.entry!.projectId)) {
      options.push({ id: this.entry.projectId, name: `${this.entry.projectName} (inactive)` });
    }

    return options;
  }
}
