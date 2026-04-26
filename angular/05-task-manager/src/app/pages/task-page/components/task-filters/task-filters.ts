import { Component, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FilterPriority, type FilterStatus } from '../../../../models/task.model';
import { MatInput } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-task-filters',
  imports: [MatFormFieldModule, MatSelectModule, MatInput, MatIconModule],
  templateUrl: './task-filters.html',
  styleUrl: './task-filters.css',
})
export class TaskFilters {
  status = output<FilterStatus>();
  priority = output<FilterPriority>();
  searchName = output<string>();

  statusChange(statusValue: FilterStatus) {
    this.status.emit(statusValue);
  }

  priorityChange(priorityValue: FilterPriority) {
    this.priority.emit(priorityValue);
  }

  searchChange(input: Event) {
    const value = (input.target as HTMLInputElement).value;
    this.searchName.emit(value);
  }
}
