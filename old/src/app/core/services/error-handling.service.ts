import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ApiResponse, ErrorResponse } from '../models/api-request-response.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlingService {
  private readonly DEFAULT_ERROR = 'An unexpected error occurred';
  private readonly AUTH_ERROR = 'Authentication failed';
  private readonly SERVER_ERROR = 'Server error occurred';
  private readonly NETWORK_ERROR = 'Network error occurred';

  handleError = (error: HttpErrorResponse): Observable<never> => {
    const errorResponse = this.parseError(error);
    this.logError(errorResponse);
    return throwError(() => errorResponse);
  };

  private parseError(error: HttpErrorResponse): ErrorResponse {
    if (error.status === 0) {
      return this.handleNetworkError(error);
    }

    if (error.error instanceof ErrorEvent) {
      return this.handleClientError(error.error);
    }
    return this.handleServerError(error);
  }

  private handleNetworkError(error: HttpErrorResponse): ErrorResponse {
    return {
      message: this.NETWORK_ERROR,
      statusCode: 0,
      errors: [
        {
          field: 'network',
          description: 'Something went wrong, so please try again.',
          detailedMessage:
            error.message || 'Something went wrong, so please try again.',
        },
      ],
    };
  }

  private handleClientError(error: ErrorEvent): ErrorResponse {
    return {
      message: error.message || this.NETWORK_ERROR,
      statusCode: 0,
      errors: [
        {
          field: 'client',
          description: 'Client-side error',
          detailedMessage: error.message,
        },
      ],
    };
  }

  private handleServerError(error: HttpErrorResponse): ErrorResponse {
    const apiResponse = error.error as ApiResponse<unknown>;

    if (!apiResponse) {
      return this.createDefaultError(error.status);
    }

    return {
      message: this.getErrorMessage(apiResponse, error.status),
      statusCode: error.status,
      errors: apiResponse.errors || [],
    };
  }

  private getErrorMessage(
    response: ApiResponse<unknown>,
    status: number
  ): string {
    if (response.errors?.[0]?.detailedMessage) {
      return response.errors[0].detailedMessage;
    }

    if (response.message) {
      return response.message;
    }

    return this.getStatusBasedMessage(status);
  }

  private getStatusBasedMessage(status: number): string {
    switch (status) {
      case 401:
        return this.AUTH_ERROR;
      case 403:
        return 'Access denied';
      case 404:
        return 'Resource not found';
      case 500:
        return this.SERVER_ERROR;
      default:
        return this.DEFAULT_ERROR;
    }
  }

  private createDefaultError(status: number): ErrorResponse {
    return {
      message: this.getStatusBasedMessage(status),
      statusCode: status,
      errors: [],
    };
  }

  logError(error: ErrorResponse): void {
    if (!environment.production) {
      console.error('Error details:', {
        message: error.message,
        statusCode: error.statusCode,
        errors: error.errors,
        timestamp: new Date().toISOString(),
      });
    }
  }
}
