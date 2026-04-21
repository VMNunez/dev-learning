import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TaskService } from './services/task.service';
import { FilterPriority, type FilterStatus, type Task } from '../../models/task.model';

@Component({
  selector: 'app-task-page',
  imports: [MatButtonModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './task-page.html',
  styleUrl: './task-page.css',
})
export class TaskPage {
  private taskService = inject(TaskService);

  tasks = this.taskService.tasks;
  selectedStatus = signal<FilterStatus>('all');
  selectedPriority = signal<FilterPriority>('all');

  filteredTasks = computed(() => {
    return this.tasks().filter((task) => {
      const statusMatch = this.selectedStatus() === 'all' || task.status === this.selectedStatus();
      const priorityMatch =
        this.selectedPriority() === 'all' || task.priority === this.selectedPriority();
      return statusMatch && priorityMatch;
    });
  });

  onStatusChange(status: FilterStatus): void {
    this.selectedStatus.set(status);
  }

  onPriorityChange(priority: FilterPriority): void {
    this.selectedPriority.set(priority);
  }
}
