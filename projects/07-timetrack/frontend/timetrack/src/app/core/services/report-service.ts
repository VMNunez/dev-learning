import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ReportSummary } from '../../shared/models/report';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private readonly http = inject(HttpClient);
  private readonly reportUrl = `${environment.apiUrl}/reports`;

  getSummary(month: string): Observable<ReportSummary> {
    const params = new HttpParams().set('month', month);
    return this.http.get<ReportSummary>(`${this.reportUrl}/summary`, { params });
  }
}
