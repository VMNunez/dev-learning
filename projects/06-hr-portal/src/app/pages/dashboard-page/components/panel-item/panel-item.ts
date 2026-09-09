import { Component, input } from '@angular/core';
import type { LeaveRequestStatus } from '../../../../models/leave-request.model';

@Component({
  selector: 'app-panel-item',
  imports: [],
  templateUrl: './panel-item.html',
  styleUrl: './panel-item.css',
})
export class PanelItem {
  name = input.required<string>();
  meta = input.required<string>();
  /** Only the employee's own leave requests carry a badge; the other two panels leave it null. */
  status = input<LeaveRequestStatus | null>(null);
}
