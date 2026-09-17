import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Page } from '../../shared/models/page';
import { TimeEntry, TimeEntryFilters } from '../../shared/models/time-entry';

@Injectable({
  providedIn: 'root',
})
export class EntryService {
  private readonly http = inject(HttpClient);
  private readonly entryUrl = `${environment.apiUrl}/entries`;

  getEntries(filters: TimeEntryFilters = {}): Observable<Page<TimeEntry>> {
    let params = new HttpParams();

    if (filters.month) {
      params = params.set('month', filters.month);
    }
    if (filters.projectId !== undefined) {
      params = params.set('projectId', filters.projectId);
    }
    if (filters.status) {
      params = params.set('status', filters.status);
    }

    return this.http.get<Page<TimeEntry>>(this.entryUrl, { params });
  }
}
