import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';
import { TimeEntry } from '../../../shared/models/time-entry';

@Component({
  selector: 'app-entry-list',
  imports: [
    DatePipe,
    DecimalPipe,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatTooltip,
    StatusBadge,
  ],
  templateUrl: './entry-list.html',
  styleUrl: './entry-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntryList {
  readonly entries = input.required<TimeEntry[]>();
  readonly showEmployee = input(false);
  readonly showActions = input(false);
  readonly busyIds = input<ReadonlySet<number>>(new Set());
  readonly activeProjectIds = input<ReadonlySet<number> | null>(null);

  readonly edit = output<TimeEntry>();
  readonly remove = output<TimeEntry>();
  readonly submitForReview = output<TimeEntry>();
  readonly reopen = output<TimeEntry>();
  readonly sortChange = output<Sort>();

  protected readonly trackById = (_index: number, entry: TimeEntry) => entry.id;

  protected readonly canSubmit = (entry: TimeEntry) =>
    this.activeProjectIds()?.has(entry.projectId) ?? true;

  protected readonly columns = computed(() => [
    'date',
    ...(this.showEmployee() ? ['employee'] : []),
    'project',
    'hours',
    'description',
    'status',
    ...(this.showActions() ? ['actions'] : []),
  ]);
}
