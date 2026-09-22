export interface Project {
  id: number;
  name: string;
  description: string | null;
  active: boolean;
  createdAt: string;
}

export interface CreateProjectRequest {
  name: string;
  description: string | null;
}

export interface UpdateProjectRequest {
  name: string;
  description: string | null;
  active?: boolean;
}
