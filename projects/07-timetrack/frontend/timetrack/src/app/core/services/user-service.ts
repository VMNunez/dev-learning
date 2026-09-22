import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ChangePasswordRequest,
  CreateUserRequest,
  CreateUserResponse,
  PasswordResetResponse,
  UpdateUserRequest,
  User,
} from '../../shared/models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly userUrl = `${environment.apiUrl}/users`;

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.userUrl);
  }

  createUser(request: CreateUserRequest): Observable<CreateUserResponse> {
    return this.http.post<CreateUserResponse>(this.userUrl, request);
  }

  updateUser(id: number, request: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(this.userUrlFor(id), request);
  }

  deactivateUser(id: number): Observable<void> {
    return this.http.delete<void>(this.userUrlFor(id));
  }

  resetPassword(id: number): Observable<PasswordResetResponse> {
    return this.http.post<PasswordResetResponse>(`${this.userUrlFor(id)}/password-reset`, null);
  }

  changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.http.patch<void>(`${this.userUrl}/me/password`, request);
  }

  private userUrlFor(id: number): string {
    return `${this.userUrl}/${id}`;
  }
}
