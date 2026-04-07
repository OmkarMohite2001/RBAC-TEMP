import { Injectable } from '@angular/core';
import {
  ApiListResponse,
  ApiResponse,
  DropDownOptions,
  paginatedRequest,
} from '../../core/models/api-request-response.interface';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../core/services/error-handling.service';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import {
  paginatedModule,
  ModuleRecord,
  Module,
} from './manage-applications.interface';

@Injectable({
  providedIn: 'root',
})
export class ManageModuleService {
  private readonly baseUrl = `${environment.apiUrl}/Module`;
  private readonly module = new BehaviorSubject<paginatedModule | null>(null);
  module$ = this.module.asObservable();

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlingService
  ) {}

  getAllModules(params: paginatedRequest): Observable<paginatedModule> {
    return this.http
      .post<paginatedModule>(`${this.baseUrl}/GetAllModules`, params)
      .pipe(
        tap(response => {
          this.module.next(response);
        }),
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  getModuleList() {
    return this.http
      .get<ApiListResponse<ModuleRecord>>(`${this.baseUrl}/GetModuleList`)
      .pipe(
        tap(response => {
          return response;
        }),
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  getModuleById(moduleId: number) {
    return this.http
      .get<
        ApiResponse<ModuleRecord>
      >(`${this.baseUrl}/GetModuleById/${moduleId}`)
      .pipe(
        tap(response => {
          return response;
        }),
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  refreshData() {
    this.getAllModules({ page: 1, pageSize: 20 }).subscribe();
  }

  createModule(module: Module) {
    return this.http
      .post<ApiResponse<Module>>(`${this.baseUrl}/AddModule`, module)
      .pipe(
        tap(() => {
          //refresh data
          this.refreshData();
        }),
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  editModule(moduleId: number, module: Module) {
    return this.http
      .put<
        ApiResponse<Module>
      >(`${this.baseUrl}/UpdateModule/${moduleId}`, module)
      .pipe(
        tap(() => {
          //refresh data
          this.refreshData();
        }),
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  getModuleForDropdown(
    applicationId: number,
    params?: DropDownOptions
  ): Observable<paginatedModule> {
    return this.http
      .post<paginatedModule>(
        `${this.baseUrl}/GetAllModulesForDropdownByApplicationId?applicationId=${applicationId}`,
        params ?? {}
      )
      .pipe(
        tap(response => {
          return response;
        }),
        catchError(error => this.errorHandler.handleError(error))
      );
  }
}
