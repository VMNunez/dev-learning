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

// Mirrors `CreateUserResponse`: the account as `UserResponse` carries it, plus the password the backend
// generated for it. That plaintext exists in this one response and nowhere else — the database keeps
// only its hash — so the page that receives it shows it once and never stores it.
export interface CreateUserResponse extends User {
  generatedPassword: string;
}

// Mirrors `PasswordResetResponse`: the new password a manager's reset generated, with the same one-time
// life as the one above. The page already holds the account it reset, so nothing else comes back.
export interface PasswordResetResponse {
  generatedPassword: string;
}

// No password field: the backend generates it (§8), so the manager never chooses or sees a stored one.
export interface CreateUserRequest {
  name: string;
  email: string;
  role: Role;
}

// `active` is never a form field: the row's own action owns it — DELETE to deactivate, and this
// optional flag on the update as the way back. Omitting it leaves the account as it is.
export interface UpdateUserRequest {
  name: string;
  email: string;
  role: Role;
  active?: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
