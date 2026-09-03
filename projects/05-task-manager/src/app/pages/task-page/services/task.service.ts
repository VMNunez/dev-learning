import { effect, Injectable, signal } from '@angular/core';
import type { Task } from '../../../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly STORAGE_KEY = 'tasks';

  members = ['Ana', 'Carlos', 'María', 'David', 'Laura'];
  tasks = signal<Task[]>(this.loadTasks());

  constructor() {
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks()));
    });
  }

  addTask(task: Task): void {
    this.tasks.update((tasks) => [...tasks, task]);
  }

  deleteTask(taskId: string): void {
    this.tasks.update((tasks) => tasks.filter((task) => task.id !== taskId));
  }

  editTask(updatedTask: Task): void {
    this.tasks.update((tasks) =>
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    );
  }

  private loadTasks(): Task[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];

    try {
      const parsed: unknown = JSON.parse(data);

      if (!Array.isArray(parsed)) {
        console.error('Stored tasks are not an array; starting empty.', parsed);
        return [];
      }

      return parsed;
    } catch (error) {
      console.error('Stored tasks could not be parsed; starting empty.', error);
      return [];
    }
  }
}
