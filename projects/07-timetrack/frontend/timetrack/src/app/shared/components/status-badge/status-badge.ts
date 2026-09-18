import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { ENTRY_STATUS_LABELS, EntryStatus } from '../../models/time-entry';

@Component({
  selector: 'app-status-badge',
  imports: [MatTooltip],
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBadge {
  readonly status = input.required<EntryStatus>();
  readonly note = input<string | null>(null);

  protected readonly label = computed(() => ENTRY_STATUS_LABELS[this.status()]);
  protected readonly badgeClass = computed(() => `badge badge-${this.status().toLowerCase()}`);
}
