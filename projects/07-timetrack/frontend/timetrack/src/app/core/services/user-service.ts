import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChangePasswordRequest, User } from '../../shared/models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly userUrl = `${environment.apiUrl}/users`;

  // Unpaged by contract: a company's headcount is tens of rows, and both of this call's consumers —
  // the Approvals employee filter and the Team page — need the whole list to be correct.
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.userUrl);
  }

  changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.http.patch<void>(`${this.userUrl}/me/password`, request);
  }
}
