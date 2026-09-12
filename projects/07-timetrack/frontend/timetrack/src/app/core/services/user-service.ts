import { inject, Injectable } from '@angular/core';
import { ChangePasswordRequest } from '../../shared/models/user';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly userUrl = `${environment.apiUrl}/users`;

  changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.http.patch<void>(`${this.userUrl}/me/password`, request);
  }
}
