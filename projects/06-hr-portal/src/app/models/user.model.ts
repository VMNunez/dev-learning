export const ROLES = ['admin', 'employee'] as const;

export type Role = (typeof ROLES)[number];

export function isRole(value: unknown): value is Role {
  return ROLES.includes(value as Role);
}

export interface User {
  email: string;
  password: string;
  role: Role;
}

/**
 * What the app keeps about the logged-in user, and the only shape that is persisted.
 * `User` is the credential record and never leaves `AuthService`.
 */
export type SessionUser = Omit<User, 'password'>;
