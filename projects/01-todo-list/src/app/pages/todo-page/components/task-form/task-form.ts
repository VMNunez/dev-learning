import { Component, inject } from '@angular/core';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  imports: [],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskForm {
  private taskService = inject(TaskService);

  submit(input: HTMLInputElement) {
    const title = input.value.trim();
    if (!title) return;

    this.taskService.addTask(title);
    input.value = '';
  }
}
