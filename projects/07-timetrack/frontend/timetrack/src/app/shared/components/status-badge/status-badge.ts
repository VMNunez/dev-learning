import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { EntryStatus } from '../../models/time-entry';

const STATUS_LABELS: Record<EntryStatus, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

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

  protected readonly label = computed(() => STATUS_LABELS[this.status()]);
  protected readonly badgeClass = computed(() => `badge badge-${this.status().toLowerCase()}`);
}
