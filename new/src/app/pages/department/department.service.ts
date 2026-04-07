import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  DropDownOptions,
  paginatedResult,
} from '../../core/models/api-request-response.interface';
import { catchError, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../core/services/error-handling.service';
import { Department } from './department.interface';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private readonly baseUrl = `${environment.apiUrl}/Department`;
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlingService
  ) {}

  getDepartmentsForDropDown(
    params?: DropDownOptions
  ): Observable<ApiResponse<paginatedResult<Department>>> {
    return this.http
      .post<
        ApiResponse<paginatedResult<Department>>
      >(`${this.baseUrl}/GetAllDepartmentsForDropdown`, params ?? {})
      .pipe(
        tap(response => {
          return response;
        }),
        catchError(error => this.errorHandler.handleError(error))
      );
  }
}
