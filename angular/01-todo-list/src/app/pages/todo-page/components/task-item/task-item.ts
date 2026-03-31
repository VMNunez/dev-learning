import { Component, input, output } from '@angular/core';
import type { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-item',
  imports: [],
  templateUrl: './task-item.html',
  styleUrl: './task-item.css',
})
export class TaskItem {
  task = input.required<Task>();
  taskToggled = output<number>();
}
