export interface Task {
  id: number;
  name: string;
  status: 'pending' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  description: string;
  createdAt: string;
  assignee: string;
}
