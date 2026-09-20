import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateProjectRequest, Project, UpdateProjectRequest } from '../../shared/models/project';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly http = inject(HttpClient);
  private readonly projectUrl = `${environment.apiUrl}/projects`;

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.projectUrl);
  }

  createProject(request: CreateProjectRequest): Observable<Project> {
    return this.http.post<Project>(this.projectUrl, request);
  }

  updateProject(id: number, request: UpdateProjectRequest): Observable<Project> {
    return this.http.put<Project>(this.projectUrlFor(id), request);
  }

  // The API's DELETE is the soft delete: the project keeps its entries and stops accepting new ones.
  deactivateProject(id: number): Observable<void> {
    return this.http.delete<void>(this.projectUrlFor(id));
  }

  private projectUrlFor(id: number): string {
    return `${this.projectUrl}/${id}`;
  }
}
