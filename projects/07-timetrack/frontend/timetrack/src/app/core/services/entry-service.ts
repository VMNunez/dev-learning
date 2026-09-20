import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Page, PageRequest } from '../../shared/models/page';
import {
  CreateTimeEntryRequest,
  RejectRequest,
  TimeEntry,
  TimeEntryFilters,
  UpdateTimeEntryRequest,
} from '../../shared/models/time-entry';

@Injectable({
  providedIn: 'root',
})
export class EntryService {
  private readonly http = inject(HttpClient);
  private readonly entryUrl = `${environment.apiUrl}/entries`;

  getEntries(
    filters: TimeEntryFilters = {},
    pageRequest?: PageRequest,
  ): Observable<Page<TimeEntry>> {
    let params = new HttpParams();

    if (pageRequest) {
      params = params.set('page', pageRequest.page).set('size', pageRequest.size);
      if (pageRequest.sort) {
        params = params.set('sort', pageRequest.sort);
      }
    }

    if (filters.month) {
      params = params.set('month', filters.month);
    }
    if (filters.userId !== undefined) {
      params = params.set('userId', filters.userId);
    }
    if (filters.projectId !== undefined) {
      params = params.set('projectId', filters.projectId);
    }
    if (filters.status) {
      params = params.set('status', filters.status);
    }

    return this.http.get<Page<TimeEntry>>(this.entryUrl, { params });
  }

  createEntry(request: CreateTimeEntryRequest): Observable<TimeEntry> {
    return this.http.post<TimeEntry>(this.entryUrl, request);
  }

  updateEntry(id: number, request: UpdateTimeEntryRequest): Observable<TimeEntry> {
    return this.http.put<TimeEntry>(this.entryUrlFor(id), request);
  }

  deleteEntry(id: number): Observable<void> {
    return this.http.delete<void>(this.entryUrlFor(id));
  }

  submitEntry(id: number): Observable<TimeEntry> {
    return this.http.patch<TimeEntry>(`${this.entryUrlFor(id)}/submit`, null);
  }

  reopenEntry(id: number): Observable<TimeEntry> {
    return this.http.patch<TimeEntry>(`${this.entryUrlFor(id)}/reopen`, null);
  }

  approveEntry(id: number): Observable<TimeEntry> {
    return this.http.patch<TimeEntry>(`${this.entryUrlFor(id)}/approve`, null);
  }

  // The only one of the six workflow calls that carries a body: the note is what the employee reads
  // on the rejected row, and the API refuses a blank one.
  rejectEntry(id: number, request: RejectRequest): Observable<TimeEntry> {
    return this.http.patch<TimeEntry>(`${this.entryUrlFor(id)}/reject`, request);
  }

  private entryUrlFor(id: number): string {
    return `${this.entryUrl}/${id}`;
  }
}
