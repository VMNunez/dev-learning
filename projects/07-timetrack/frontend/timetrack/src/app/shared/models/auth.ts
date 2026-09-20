export const ROLES = ['EMPLOYEE', 'MANAGER'] as const;

export type Role = (typeof ROLES)[number];

export function isRole(value: unknown): value is Role {
  return ROLES.includes(value as Role);
}

export interface LoginRequest {
  email: string;
  password: string;
}

// `id` is the one thing that identifies the caller to the UI. It is not a secret — it is already the
// `sub` claim of the token in the same response — and a name is not an identity: two people share one
// (§10 appends `id` to the by-user report's sort for exactly that reason). Without it no page can tell
// the caller's own row from anyone else's, which §8 needs twice: the entries a manager may not review,
// and the account they may not deactivate.
export interface AuthResponse {
  token: string;
  id: number;
  name: string;
  role: Role;
}
