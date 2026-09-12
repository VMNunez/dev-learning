export const ROLES = ['EMPLOYEE', 'MANAGER'] as const;

export type Role = (typeof ROLES)[number];

export function isRole(value: unknown): value is Role {
  return ROLES.includes(value as Role);
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  name: string;
  role: Role;
}
