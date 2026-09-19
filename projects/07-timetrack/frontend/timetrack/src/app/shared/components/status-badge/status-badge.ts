import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ENTRY_STATUS_LABELS, EntryStatus } from '../../models/time-entry';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBadge {
  readonly status = input.required<EntryStatus>();

  protected readonly label = computed(() => ENTRY_STATUS_LABELS[this.status()]);
  protected readonly badgeClass = computed(() => `badge badge-${this.status().toLowerCase()}`);
}
