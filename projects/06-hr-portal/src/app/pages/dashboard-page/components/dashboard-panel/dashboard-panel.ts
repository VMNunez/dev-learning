import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Params } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

/**
 * The panel's chrome — card, title and "View all" link. The rows are projected with
 * `<ng-content>` rather than passed as an input, because the three dashboard panels list
 * different entities; a configuration input would have to grow one field per entity shape.
 */
@Component({
  selector: 'app-dashboard-panel',
  imports: [MatCardModule, RouterLink],
  templateUrl: './dashboard-panel.html',
  styleUrl: './dashboard-panel.css',
})
export class DashboardPanel {
  title = input.required<string>();
  link = input.required<string>();
  queryParams = input<Params | undefined>(undefined);
}
