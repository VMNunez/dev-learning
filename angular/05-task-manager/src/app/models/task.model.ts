export interface Task {
  id: number;
  name: string;
  status: TaskStatus;
  priority: TaskPriority;
  description?: string;
  createdAt: string;
  assignee: string;
}

export type TaskStatus = 'pending' | 'in-progress' | 'done';
export type FilterStatus = 'all' | TaskStatus;

export type TaskPriority = 'low' | 'medium' | 'high';
export type FilterPriority = 'all' | TaskPriority;
