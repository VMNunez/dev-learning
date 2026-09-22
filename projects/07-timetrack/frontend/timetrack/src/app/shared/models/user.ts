import { Role } from './auth';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  active: boolean;
}

export interface CreateUserResponse extends User {
  generatedPassword: string;
}

export interface PasswordResetResponse {
  generatedPassword: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  role: Role;
}

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
