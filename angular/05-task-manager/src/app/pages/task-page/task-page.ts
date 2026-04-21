import { Component, computed, inject, signal } from '@angular/core';
import { FilterPriority, type FilterStatus } from '../../models/task.model';
import { TaskService } from './services/task.service';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-task-page',
  imports: [MatButtonModule, MatSelectModule, MatFormFieldModule, MatTableModule],
  templateUrl: './task-page.html',
  styleUrl: './task-page.css',
})
export class TaskPage {
  private taskService = inject(TaskService);
  displayedColumns = ['name', 'status', 'priority', 'assignee', 'createdAt', 'actions'];

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
