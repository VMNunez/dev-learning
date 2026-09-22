export const ROLES = ['EMPLOYEE', 'MANAGER'] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  EMPLOYEE: 'Employee',
  MANAGER: 'Manager',
};

export function isRole(value: unknown): value is Role {
  return ROLES.includes(value as Role);
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  name: string;
  role: Role;
}

export function isAuthResponse(value: unknown): value is AuthResponse {
  if (typeof value !== 'object' || value === null) return false;

  const candidate = value as Partial<AuthResponse>;
  return (
    typeof candidate.id === 'number' &&
    typeof candidate.name === 'string' &&
    typeof candidate.token === 'string' &&
    isRole(candidate.role)
  );
}
