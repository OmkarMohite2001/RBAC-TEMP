import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  DropDownOptions,
  paginatedRequest,
  paginatedResult,
} from '../../core/models/api-request-response.interface';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import {
  paginateRole,
  Role,
  RoleData,
  RoleItem,
} from './access-control.interface';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../core/services/error-handling.service';

@Injectable({
  providedIn: 'root',
})
export class AccessControlService {
  private readonly baseUrl = `${environment.apiUrl}/Role`;
  private readonly role = new BehaviorSubject<paginateRole | null>(null);
  role$ = this.role.asObservable();

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlingService
  ) {}

  getRoles(params: paginatedRequest): Observable<paginateRole> {
    return this.http
      .post<paginateRole>(`${this.baseUrl}/GetAllRoles`, params)
      .pipe(
        tap(response => {
          this.role.next(response);
        }),
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  getRoleById(roleId: number) {
    return this.http
      .get<ApiResponse<RoleData>>(`${this.baseUrl}/GetRoleById/${roleId}`)
      .pipe(
        tap(response => {
          return response;
        }),
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  refreshData() {
    this.getRoles({ page: 1, pageSize: 20 }).subscribe();
  }

  createRole(role: RoleItem) {
    return this.http
      .post<ApiResponse<RoleItem>>(`${this.baseUrl}/AddRole`, role)
      .pipe(
        tap(() => {
          //refresh data
          this.refreshData();
        }),
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  editRole(roleId: number, role: RoleItem) {
    return this.http
      .put<ApiResponse<RoleItem>>(`${this.baseUrl}/UpdateRole/${roleId}`, role)
      .pipe(catchError(error => this.errorHandler.handleError(error)));
  }

  getRolesForDropDown(
    params?: DropDownOptions
  ): Observable<ApiResponse<paginatedResult<Role>>> {
    return this.http
      .post<
        ApiResponse<paginatedResult<Role>>
      >(`${this.baseUrl}/GetAllRolesForDropdown`, params ?? {})
      .pipe(
        tap(response => {
          return response;
        }),
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  assignNewApplication(roleId: number, applicationId: number) {
    return this.http
      .post<
        ApiResponse<RoleItem>
      >(`${this.baseUrl}/AssignNewApplication?roleId=${roleId}`, applicationId)
      .pipe(catchError(error => this.errorHandler.handleError(error)));
  }
}
