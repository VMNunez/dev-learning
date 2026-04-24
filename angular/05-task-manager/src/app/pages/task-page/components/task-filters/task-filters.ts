import { Component, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FilterPriority, type FilterStatus } from '../../../../models/task.model';

@Component({
  selector: 'app-task-filters',
  imports: [MatFormFieldModule, MatSelectModule],
  templateUrl: './task-filters.html',
  styleUrl: './task-filters.css',
})
export class TaskFilters {
  status = output<FilterStatus>();
  priority = output<FilterPriority>();

  statusChange(statusValue: FilterStatus) {
    this.status.emit(statusValue);
  }

  priorityChange(priorityValue: FilterPriority) {
    this.priority.emit(priorityValue);
  }
}
