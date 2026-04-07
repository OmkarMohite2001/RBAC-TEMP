import { Injectable } from '@angular/core';
import {
  ApiListResponse,
  ApiResponse,
  paginatedRequest,
} from '../../core/models/api-request-response.interface';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../core/services/error-handling.service';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import {
  paginatedUsers,
  role,
  User,
  UsersListRecord,
} from './manage-users.interface';

@Injectable({
  providedIn: 'root',
})
export class ManageUsersService {
  private readonly baseUrl = `${environment.apiUrl}/User`;
  private readonly user = new BehaviorSubject<paginatedUsers | null>(null);
  user$ = this.user.asObservable();

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlingService
  ) {}

  getUsers(params: paginatedRequest): Observable<paginatedUsers> {
    return this.http
      .post<paginatedUsers>(`${this.baseUrl}/GetAllUsers`, params)
      .pipe(
        tap(response => {
          this.user.next(response);
        }),
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  getUserById(userId: number) {
    return this.http
      .get<UsersListRecord>(`${this.baseUrl}/GetUserById/${userId}`)
      .pipe(
        tap(response => {
          return response;
        }),
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  refreshData() {
    this.getUsers({ page: 1, pageSize: 20 }).subscribe();
  }

  createUser(user: User) {
    return this.http
      .post<ApiResponse<User>>(`${this.baseUrl}/AddUser`, user)
      .pipe(
        tap(() => {
          //refresh data
          this.refreshData();
        }),
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  editUser(userId: number, user: User) {
    return this.http
      .put<ApiResponse<User>>(`${this.baseUrl}/UpdateUser/${userId}`, user)
      .pipe(
        tap(() => {
          //refresh data
          this.refreshData();
        }),
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  getUserByEmployeeId(employeeId: string) {
    return this.http
      .get<
        ApiListResponse<UsersListRecord>
      >(`${this.baseUrl}/GetKBLUserByEmployeeId/${employeeId}`)
      .pipe(
        tap(response => {
          return response;
        }),
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  getUserRoles() {
    return this.http
      .get<ApiListResponse<role>>(`${this.baseUrl}/GetUserRoles`)
      .pipe(
        tap(response => {
          return response;
        }),
        catchError(error => this.errorHandler.handleError(error))
      );
  }
}
