import { Injectable } from '@angular/core';
import {
  ApiResponse,
  DropDownOptions,
  paginatedRequest,
} from '../../core/models/api-request-response.interface';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../core/services/error-handling.service';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import {
  paginatedApplication,
  ApplicationListRecord,
  Application,
  applicationOptionsResult,
} from './manage-applications.interface';

@Injectable({
  providedIn: 'root',
})
export class ManageApplicationService {
  private readonly baseUrl = `${environment.apiUrl}/Application`;
  private readonly application =
    new BehaviorSubject<paginatedApplication | null>(null);
  application$ = this.application.asObservable();

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlingService
  ) {}

  getApplications(params: paginatedRequest): Observable<paginatedApplication> {
    return this.http
      .post<paginatedApplication>(`${this.baseUrl}/GetAllApplications`, params)
      .pipe(
        tap(response => {
          this.application.next(response);
        }),
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  getApplicationById(applicationId: number) {
    return this.http
      .get<
        ApiResponse<ApplicationListRecord>
      >(`${this.baseUrl}/GetApplicationById/${applicationId}`)
      .pipe(
        tap(response => {
          return response;
        }),
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  syncApplicationById(applicationId: number) {
    return this.http.get(`${this.baseUrl}/SyncModules/${applicationId}`).pipe(
      tap(response => {
        return response;
      }),
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  refreshData() {
    this.getApplications({ page: 1, pageSize: 20 }).subscribe();
  }

  createApplication(application: Application) {
    return this.http
      .post<
        ApiResponse<Application>
      >(`${this.baseUrl}/AddApplication`, application)
      .pipe(
        tap(() => {
          //refresh data
          this.refreshData();
        }),
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  editApplication(applicationId: number, application: Application) {
    return this.http
      .put<
        ApiResponse<Application>
      >(`${this.baseUrl}/UpdateApplication/${applicationId}`, application)
      .pipe(
        tap(() => {
          //refresh data
          this.refreshData();
        }),
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  getApplicationForDropdown(
    params?: DropDownOptions
  ): Observable<applicationOptionsResult> {
    return this.http
      .post<applicationOptionsResult>(
        `${this.baseUrl}/GetAllApplicationsForDropdown`,
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
