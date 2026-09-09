export const EMPLOYEE_STATUSES = ['active', 'inactive'] as const;

export type EmployeeStatus = (typeof EMPLOYEE_STATUSES)[number];

export const EMPLOYEE_STATUS_FILTERS = ['', ...EMPLOYEE_STATUSES] as const;

export type EmployeeStatusFilter = (typeof EMPLOYEE_STATUS_FILTERS)[number];

export function isEmployeeStatusFilter(value: string | null): value is EmployeeStatusFilter {
  return EMPLOYEE_STATUS_FILTERS.includes(value as EmployeeStatusFilter);
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  startDate: string;
  status: EmployeeStatus;
}
