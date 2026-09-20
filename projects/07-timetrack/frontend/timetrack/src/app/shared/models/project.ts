export interface Project {
  id: number;
  name: string;
  description: string | null;
  active: boolean;
  createdAt: string;
}

// `active` is never a form field: the API opens every project active, and the flag is owned by the
// row's own action — DELETE to deactivate (the soft delete of §8), and this optional `active` on the
// update, which is the only way back. Omitting it leaves the flag as it is.
export interface CreateProjectRequest {
  name: string;
  description: string | null;
}

export interface UpdateProjectRequest {
  name: string;
  description: string | null;
  active?: boolean;
}
