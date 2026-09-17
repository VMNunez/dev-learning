export const ENTRY_STATUSES = ['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED'] as const;

export type EntryStatus = (typeof ENTRY_STATUSES)[number];

export interface TimeEntry {
  id: number;
  userId: number;
  userName: string;
  projectId: number;
  projectName: string;
  date: string;
  hours: number;
  description: string;
  status: EntryStatus;
  rejectionNote: string | null;
}

export interface TimeEntryFilters {
  projectId?: number;
  status?: EntryStatus;
  month?: string;
}

export interface CreateTimeEntryRequest {
  projectId: number;
  date: string;
  hours: number;
  description: string;
}

export interface UpdateTimeEntryRequest {
  projectId: number;
  date: string;
  hours: number;
  description: string;
}
