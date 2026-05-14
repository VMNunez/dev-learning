export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  startDate: string;
  status: 'active' | 'inactive';
}
