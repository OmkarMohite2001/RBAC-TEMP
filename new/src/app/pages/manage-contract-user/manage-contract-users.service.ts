import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiListResponse } from '../../core/models/api-request-response.interface';
import { ErrorHandlingService } from '../../core/services/error-handling.service';
import { catchError, map, Observable } from 'rxjs';
import { ContractEmployee, Employee } from './manage-contract-user.interface';

@Injectable({
  providedIn: 'root',
})
export class ManageContractUsersService {
  private readonly rbacUrl = `${environment.rbacApiUrl}`;
  private readonly rbacUrlkbl = `${environment.rbacApiSUrl}`;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlingService
  ) {}

  syncContractEmployee(payload: {
    EmpCode: string | null;
    Name: string | null;
  }): Observable<ContractEmployee[]> {
    return this.http
      .post<ContractEmployee[]>(`${this.rbacUrlkbl}`, payload)
      .pipe(catchError(error => this.errorHandler.handleError(error)));
  }

  addContractEmployee(payload: unknown): Observable<unknown> {
    return this.http
      .post<unknown>(`${this.rbacUrl}/RBACEmployee/addEmployee`, payload)
      .pipe(catchError(error => this.errorHandler.handleError(error)));
  }

  updateContractEmployee(payload: unknown): Observable<unknown> {
    return this.http
      .post<unknown>(`${this.rbacUrl}/RBACEmployee/updateEmployee`, payload)
      .pipe(catchError(error => this.errorHandler.handleError(error)));
  }

  getUserById(payload: {
    employeeId: string | null;
    Name: string | null;
  }): Observable<{ result: ContractEmployee }> {
    return this.http
      .post<{ data: ContractEmployee }>(
        `${this.rbacUrl}/RBACEmployee/getById`,
        payload
      )
      .pipe(
        map(response => ({
          result: response.data,
        })),
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  getAllEmployees(
    params?: Record<string, unknown>
  ): Observable<ApiListResponse<Employee>> {
    const cleanedParams: Record<string, string> = {};

    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        cleanedParams[key] = String(value);
      }
    });

    return this.http
      .get<Employee[]>(`${this.rbacUrl}/RBACEmployee/getAllEmployee`, {
        params: cleanedParams,
      })
      .pipe(
        map((employees: Employee[]): ApiListResponse<Employee> => ({
          result: employees,
          message: 'Success',
          statusCode: 200,
          errors: [],
        })),
        catchError(error => this.errorHandler.handleError(error))
      );
  }
}
