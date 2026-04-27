import { effect, Injectable, signal } from '@angular/core';
import type { Task } from '../../../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  members = ['Ana', 'Carlos', 'María', 'David', 'Laura'];
  tasks = signal<Task[]>(JSON.parse(localStorage.getItem('tasks') ?? '[]'));

  constructor() {
    effect(() => {
      localStorage.setItem('tasks', JSON.stringify(this.tasks()));
    });
  }

  addTask(task: Task): void {
    this.tasks.update((tasks) => [...tasks, task]);
  }

  deleteTask(taskId: number): void {
    this.tasks.update((tasks) => tasks.filter((task) => task.id !== taskId));
  }

  editTask(updatedTask: Task): void {
    this.tasks.update((tasks) =>
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    );
  }
}
