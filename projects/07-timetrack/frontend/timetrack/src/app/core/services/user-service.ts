import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ChangePasswordRequest,
  CreateUserRequest,
  CreateUserResponse,
  UpdateUserRequest,
  User,
} from '../../shared/models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly userUrl = `${environment.apiUrl}/users`;

  // Unpaged by contract: a company's headcount is tens of rows, and every consumer — the Team page, the
  // manager dashboard's count and the Approvals employee filter — needs the whole list to be correct.
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.userUrl);
  }

  createUser(request: CreateUserRequest): Observable<CreateUserResponse> {
    return this.http.post<CreateUserResponse>(this.userUrl, request);
  }

  updateUser(id: number, request: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(this.userUrlFor(id), request);
  }

  // The API's DELETE is the soft delete: the account keeps every entry it logged and can no longer log in.
  deactivateUser(id: number): Observable<void> {
    return this.http.delete<void>(this.userUrlFor(id));
  }

  changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.http.patch<void>(`${this.userUrl}/me/password`, request);
  }

  private userUrlFor(id: number): string {
    return `${this.userUrl}/${id}`;
  }
}
