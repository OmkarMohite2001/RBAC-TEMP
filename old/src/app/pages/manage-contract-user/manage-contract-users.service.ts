import { Injectable } from '@angular/core';
import {
  ApiListResponse,
  ApiResponse,
  paginatedRequest,
  Employee,
} from '../../core/models/api-request-response.interface';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../core/services/error-handling.service';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import {
  paginatedContractUsers,
  // role,
  ContractUser,
  ContractEmployee,
  ContractUsersListRecord,
} from './manage-contract-user.interface';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ManageContractUsersService {
  private readonly baseUrl = `${environment.apiUrl}/ContractUser`;
  private readonly rbacUrl = `${environment.rbacApiUrl}`;
  private readonly rbacUrlkbl = `${environment.rbacApiSUrl}`;
  private readonly contractUser = new BehaviorSubject<paginatedContractUsers | null>(null);
  contractUser$ = this.contractUser.asObservable();

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlingService
  ) { }



  contractEmployees: Employee[] = [];
  contractUsers: ContractUsersListRecord[] = [];
  // getAllEmployees(): Observable<ApiListResponse<Employee>> {
  //   return this.http.get<Employee[]>(`${this.rbacUrl}/getAllEmployee`).pipe(
  //     map((employees: Employee[]): ApiListResponse<Employee> => ({
  //       result: employees,
  //       message: 'Success',
  //       statusCode: 200,
  //       errors: []
  //     })),
  //     catchError(error => this.errorHandler.handleError(error))
  //   );
  // }

  // getAllEmployees(): Observable<ApiListResponse<Employee>> {
  //   return this.http.get<Employee[]>(`${this.rbacUrl}/getAllEmployee`).pipe(
  //     map((employees: Employee[]): ApiListResponse<Employee> => ({
  //       result: employees,
  //       message: 'Success',
  //       statusCode: 200,
  //       errors: []
  //     })),
  //     catchError(error => this.errorHandler.handleError(error))
  //   );
  // }

  // getAllEmployees(params?: any): Observable<ApiListResponse<Employee>> {
  //   return this.http.get<Employee[]>(`${this.rbacUrl}/getAllEmployee`, { params }).pipe(
  //     map((employees: Employee[]): ApiListResponse<Employee> => ({
  //       result: employees,
  //       message: 'Success',
  //       statusCode: 200,
  //       errors: []
  //     })),
  //     catchError(error => this.errorHandler.handleError(error))
  //   );
  // }

  // syncContractEmployee(payload: { EmpCode: string | null; Name: string }): Observable<ApiListResponse<ContractEmployee>> {

  //   return this.http.post<ContractEmployee[]>(this.rbacUrlkbl, payload).pipe(
  //     map((employees: ContractEmployee[]): ApiListResponse<ContractEmployee> => ({
  //       result: employees,
  //       message: 'Success',
  //       statusCode: 200,
  //       errors: []
  //     })),
  //     catchError(error => this.errorHandler.handleError(error))
  //   );
  // }

  // syncContractEmployee(payload: { EmpCode: string | null; Name: string | null }): Observable<ApiResponse<ContractEmployee[]>> {
  //   return this.http.post<ApiResponse<ContractEmployee[]>>(`${this.rbacUrlkbl}`, payload).pipe(
  //     catchError(error => this.errorHandler.handleError(error))
  //   );
  // }

  syncContractEmployee(payload: { EmpCode: string | null; Name: string | null }): Observable<ContractEmployee[]> {
    return this.http.post<ContractEmployee[]>(`${this.rbacUrlkbl}`, payload).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  addContractEmployee(payload: any): Observable<any> {
    return this.http.post<any>(`${this.rbacUrl}/RBACEmployee/addEmployee`, payload).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

   updateContractEmployee(payload: any): Observable<any> {
    return this.http.post<any>(`${this.rbacUrl}/RBACEmployee/updateEmployee`, payload).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  // getUserById(payload: { EmpCode: string | null; Name: string | null }): Observable<ContractEmployee[]> {
  //   return this.http.post<ContractEmployee[]>(`${this.rbacUrlkbl}`, payload).pipe(
  //     catchError(error => this.errorHandler.handleError(error))
  //   );
  // }

  // getUserById(payload: { employeeId: string | null; Name: string | null }): Observable<{ result: ContractEmployee }> {
  //   return this.http.post<{ result: ContractEmployee }>(
  //     `${this.rbacUrl}/RBACEmployee/getById`,
  //     payload
  //   ).pipe(
  //     catchError(error => this.errorHandler.handleError(error))
  //   );
  // }

  getUserById(payload: { employeeId: string | null; Name: string | null }): Observable<{ result: ContractEmployee }> {
    return this.http.post<{ data: ContractEmployee }>(
      `${this.rbacUrl}/RBACEmployee/getById`,
      payload
    ).pipe(
      map(response => ({
        result: response.data
      })),
      catchError(error => this.errorHandler.handleError(error))
    );
  }


  getAllEmployees(params?: any): Observable<ApiListResponse<Employee>> {
    const cleanedParams: Record<string, string> = {};

    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        cleanedParams[key] = String(value); // ✅ Safely convert all to string
      }
    });

    return this.http.get<Employee[]>(`${this.rbacUrl}/RBACEmployee/getAllEmployee`, {
      params: cleanedParams
    }).pipe(
      map((employees: Employee[]): ApiListResponse<Employee> => ({
        result: employees,
        message: 'Success',
        statusCode: 200,
        errors: []
      })),
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  // getContractUsers(params: paginatedRequest): Observable<paginatedContractUsers> {
  //   return this.http
  //     .post<paginatedContractUsers>(`${this.baseUrl}/GetAllContractUsers`, params)
  //     .pipe(
  //       tap(response => {
  //         this.contractUser.next(response);
  //       }),
  //       catchError(error => this.errorHandler.handleError(error))
  //     );
  // }

  // getContractUserById(userId: number) {
  //   return this.http
  //     .get<ContractUsersListRecord>(`${this.baseUrl}/GetContractUserById/${userId}`)
  //     .pipe(
  //       tap(response => response),
  //       catchError(error => this.errorHandler.handleError(error))
  //     );
  // }

  refreshData() {
    // this.getAllEmployees({ page: 1, pageSize: 20 }).subscribe();
    this.getAllEmployees({
      page: 1,
      pageSize: 50,
      searchQuery: '', // or remove it completely
    });
  }



  createContractUser(user: ContractUser) {
    return this.http
      .post<ApiResponse<ContractUser>>(`${this.baseUrl}/AddContractUser`, user)
      .pipe(
        tap(() => {
          this.refreshData();
        }),
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  editContractUser(userId: number, user: ContractUser) {
    return this.http
      .put<ApiResponse<ContractUser>>(`${this.baseUrl}/UpdateContractUser/${userId}`, user)
      .pipe(
        tap(() => {
          this.refreshData();
        }),
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  getContractUserByEmployeeId(employeeId: string) {
    return this.http
      .get<ApiListResponse<ContractUsersListRecord>>(
        `${this.baseUrl}/GetContractUserByEmployeeId/${employeeId}`
      )
      .pipe(
        tap(response => response),
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  // getContractUserRoles() {
  //   return this.http
  //     .get<ApiListResponse<role>>(`${this.baseUrl}/GetContractUserRoles`)
  //     .pipe(
  //       tap(response => response),
  //       catchError(error => this.errorHandler.handleError(error))
  //     );
  // }
}
