import { Component, inject } from '@angular/core';
import { TaskItem } from '../task-item/task-item';
import { TaskService } from '../../services/task.service';

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
}
