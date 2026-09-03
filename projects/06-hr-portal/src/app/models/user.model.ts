export type Role = 'admin' | 'employee';

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
