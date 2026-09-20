import { Role } from './auth';

// Mirrors `UserResponse`: `GET /api/users` returns deactivated accounts too, because a soft-deleted
// user is only reachable through the row the list gave the manager — and their entries stay in the
// approvals queue, so the employee filter would be wrong without them.
export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  active: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
