import { Component, inject, computed, signal } from '@angular/core';
import { TaskItem } from '../task-item/task-item';
import { TaskService } from '../../services/task.service';
import type { Task } from '../../models/task.model';

type Filter = 'all' | 'active' | 'completed';

@Component({
  selector: 'app-task-list',
  imports: [TaskItem],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList {
  private taskService: TaskService = inject(TaskService);

  tasks = this.taskService.tasks;

  toggleTask(id: number): void {
    this.taskService.toggleTask(id);
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id);
  }

  pendingCount = computed<number>(
    () => this.tasks().filter((task: Task) => !task.completed).length,
  );

  totalCount = computed<number>(() => this.tasks().length);

  currentFilter = signal<Filter>('all');

  filteredTasks = computed(() => {
    switch (this.currentFilter()) {
      case 'all':
        return this.tasks();

      case 'active':
        return this.tasks().filter((task) => !task.completed);

      case 'completed':
        return this.tasks().filter((task) => task.completed);

      default:
        return this.tasks();
    }
  });
}
