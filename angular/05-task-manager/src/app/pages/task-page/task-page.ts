import { Component, computed, inject, signal } from '@angular/core';
import { FilterPriority, Task, type FilterStatus } from '../../models/task.model';
import { TaskService } from './services/task.service';
import { MatButtonModule } from '@angular/material/button';
import { TaskFilters } from './components/task-filters/task-filters';
import { TaskTable } from './components/task-table/task-table';
import { TaskDialog } from './components/task-dialog/task-dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-task-page',
  imports: [MatButtonModule, TaskFilters, TaskTable, MatIconModule],
  templateUrl: './task-page.html',
  styleUrl: './task-page.css',
})
export class TaskPage {
  private taskService = inject(TaskService);
  private dialog = inject(MatDialog);

  tasks = this.taskService.tasks;
  selectedStatus = signal<FilterStatus>('all');
  selectedPriority = signal<FilterPriority>('all');
  searchTerm = signal<string>('');
  totalTasks = computed(() => this.tasks().length);
  doneTasks = computed(() => this.tasks().filter((task) => task.status === 'done').length);
  pendingTasks = computed(() => this.tasks().filter((task) => task.status === 'pending').length);
  inProgressTasks = computed(
    () => this.tasks().filter((task) => task.status === 'in-progress').length,
  );

  filteredTasks = computed(() => {
    return this.tasks().filter((task) => {
      const statusMatch = this.selectedStatus() === 'all' || task.status === this.selectedStatus();
      const priorityMatch =
        this.selectedPriority() === 'all' || task.priority === this.selectedPriority();
      const nameMatch =
        this.searchTerm() === '' ||
        task.name.toLocaleLowerCase().trim().includes(this.searchTerm().toLocaleLowerCase().trim());
      return statusMatch && priorityMatch && nameMatch;
    });
  });

  onStatusChange(status: FilterStatus): void {
    this.selectedStatus.set(status);
  }

  onPriorityChange(priority: FilterPriority): void {
    this.selectedPriority.set(priority);
  }

  onSearchName(input: string) {
    this.searchTerm.set(input);
  }

  onAddTask(task: Task) {
    if (task) {
      this.taskService.addTask(task);
    }
  }

  onDeleteTask(id: number) {
    this.taskService.deleteTask(id);
  }

  onEditTask(task: Task) {
    const dialogRef = this.dialog.open(TaskDialog, {
      width: '500px',
      data: { task },
    });

    dialogRef.afterClosed().subscribe({
      next: (task) => {
        if (task) this.taskService.editTask(task);
      },
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TaskDialog, {
      width: '500px',
    });
    dialogRef.afterClosed().subscribe({
      next: (task) => {
        this.onAddTask(task);
      },
    });
  }
}
