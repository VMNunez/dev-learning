export type Role = 'admin' | 'employee';

export interface User {
  email: string;
  password: string;
  role: Role;
}
