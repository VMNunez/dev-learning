import { Component } from '@angular/core';
import { TaskList } from './components/task-list/task-list';

@Component({
  selector: 'app-todo-page',
  imports: [TaskList],
  templateUrl: './todo-page.html',
  styleUrl: './todo-page.css',
})
export class TodoPage {}
