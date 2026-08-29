import { Injectable, signal } from '@angular/core';
import type { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private nextId = 4;

  tasks = signal<Task[]>([
    { id: 1, title: 'Learn Angular', completed: false },
    { id: 2, title: 'Build a to-do app', completed: false },
    { id: 3, title: 'Get a job in Spain', completed: false },
  ]);

  addTask(title: string): void {
    const newTask = { id: this.nextId++, title, completed: false };
    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  toggleTask(id: number): void {
    this.tasks.update((tasks) =>
      tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)),
    );
  }

  deleteTask(id: number): void {
    this.tasks.update((tasks) => tasks.filter((task) => task.id !== id));
  }
}
