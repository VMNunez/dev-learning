export interface ReportSummary {
  totalEntries: number;
  approvedHours: number;
  pendingHours: number;
}

export interface ProjectHours {
  projectId: number;
  projectName: string;
  totalHours: number;
  active: boolean;
}

export interface UserHours {
  userId: number;
  userName: string;
  totalHours: number;
  active: boolean;
}
