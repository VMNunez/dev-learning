export const ENTRY_STATUSES = ['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED'] as const;

export type EntryStatus = (typeof ENTRY_STATUSES)[number];

export const ENTRY_STATUS_LABELS: Record<EntryStatus, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

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

// The note the employee reads on the rejected row, so the API refuses a blank one (400 with
// `fieldErrors.rejectionNote`) rather than storing a rejection nobody can act on.
export interface RejectRequest {
  rejectionNote: string;
}
