import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProjectHours, ReportSummary, UserHours } from '../../shared/models/report';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private readonly http = inject(HttpClient);
  private readonly reportUrl = `${environment.apiUrl}/reports`;

  getSummary(month: string): Observable<ReportSummary> {
    return this.http.get<ReportSummary>(`${this.reportUrl}/summary`, { params: monthParam(month) });
  }

  // Ordered by the API — hours descending, then name — so the page renders the rows as they arrive.
  getHoursByProject(month: string): Observable<ProjectHours[]> {
    return this.http.get<ProjectHours[]>(`${this.reportUrl}/by-project`, {
      params: monthParam(month),
    });
  }

  getHoursByUser(month: string): Observable<UserHours[]> {
    return this.http.get<UserHours[]>(`${this.reportUrl}/by-user`, { params: monthParam(month) });
  }
}

function monthParam(month: string): HttpParams {
  return new HttpParams().set('month', month);
}
