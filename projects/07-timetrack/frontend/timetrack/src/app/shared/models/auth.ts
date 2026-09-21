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

// `post<AuthResponse>` and `JSON.parse` only tell the compiler what arrived; neither checks it. The
// login response and the stored session are both read through this guard, so the app never holds a
// session it would later refuse. A session stored before `id` existed fails here and starts the user
// logged out — the right answer rather than a migration, since one login restores it.
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
