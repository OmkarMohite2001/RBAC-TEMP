import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  finalize,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { environment } from '../../../environments/environment';
import { ErrorHandlingService } from './error-handling.service';
import * as CryptoJS from 'crypto-js';
import { Login, LoginResponse } from '../../pages/auth/login/login.interface';
import { ApiResponse } from '../models/api-request-response.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly API_URL = environment?.apiUrl;
  private SECRET_KEY = '123';
  private sessionTimeout: any = false;
  private authStateSubject = new BehaviorSubject<boolean>(
    this.isAuthenticated()
  );
  authState$ = this.authStateSubject.asObservable();

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlingService
  ) {}

  // private hasValidToken(): boolean {
  //   const token = localStorage.getItem(this.TOKEN_KEY);
  //   return !!token && !this.isTokenExpired(token);
  // }

  // private isTokenExpired(token: string): boolean {
  //   const expiry = JSON.parse(atob(token.split('.')[1])).exp;
  //   const isExpired = Math.floor(new Date().getTime() / 1000) >= expiry;
  //   return isExpired;
  // }

  // private initializeAuthState(): void {
  //   const token = localStorage.getItem(this.TOKEN_KEY);
  //   if (token && !this.isTokenExpired(token)) {
  //     //manage authentication here -------------
  //     // this.authStateSubject.next({
  //     //   isAuthenticated: true,
  //     //   user,
  //     //   token,
  //     // });
  //   }
  // }

  login(params: Login) {
    return this.http
      .post<LoginResponse>(`${this.API_URL}/Auth/Login`, params)
      .pipe(
        tap(response => {
          // Save token, roles, and permissions in localStorage
          localStorage.setItem(
            'rbacAuthToken',
            this.encryptData(response.token)
          );
          localStorage.setItem('rbacRoles', this.encryptData(response.roles));
          localStorage.setItem(
            'rbacPermissions',
            this.encryptData(response.permissions)
          );
          localStorage.setItem(
            'employeeId',
            this.encryptData(params.strLoginId)
          );

          // Update auth state
          this.authStateSubject.next(true);

          // Start the session timeout
          this.startSessionTimeout();
        }),
        catchError(error => this.errorHandler.handleError(error)),
        switchMap(() => {
          return [true];
        })
      );
  }

  private startSessionTimeout(): void {
    // If there's already a timeout running, clear it
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
    }

    // Set session timeout (e.g., 1 hour)
    this.sessionTimeout = setTimeout(() => {
      this.logout();
    }, 3600000); // 3600000 ms = 1 hour
  }

  logout() {
    localStorage.removeItem('rbacAuthToken');
    localStorage.removeItem('rbacRoles');
    localStorage.removeItem('rbacPermissions');
    localStorage.removeItem('employeeId');
    this.router.navigate(['/auth/login']);
  }

  // logout() {
  //   return this.http
  //     .post<ApiResponse<any>>(`${this.API_URL}/auth/logout`, {})
  //     .pipe(
  //       catchError(error => {
  //         // Optionally log the error
  //         console.error('Logout error:', error);
  //         return of(null); // return a fallback observable to continue the pipe
  //       }),
  //       finalize(() => {
  //         // Clear local storage and other data
  //         localStorage.removeItem('rbacAuthToken');
  //         localStorage.removeItem('rbacRoles');
  //         localStorage.removeItem('rbacPermissions');
  //         localStorage.removeItem('employeeId');
  //         this.router.navigate(['/auth/login']);
  //       })
  //     );
  //   //window.location.reload();
  // }

  // getAuthToken(): string | null {
  //   const token = localStorage.getItem(this.TOKEN_KEY);
  //   return token && !this.isTokenExpired(token) ? token : null;
  // }

  // Get the current authentication token
  private getToken(): string | null {
    const token = localStorage.getItem('rbacAuthToken');
    return !!token ? this.decryptData(token) : null;
  }

  getTokenValue() {
    //here we will decrypt and return when enc-Dec apply
    const token = localStorage.getItem('rbacAuthToken');
    return !!token ? this.decryptData(token) : null;
  }

  getEmployeeId() {
    const empId = localStorage.getItem('employeeId');
    return !!empId ? this.decryptData(empId) : null;
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  decodeJwtPayload(): any {
    const token = this.getToken();
    const payload = token?.split('.')[1];
    if (!payload) {
      return null;
    }
    return JSON.parse(atob(payload.replace(/_/g, '/').replace(/-/g, '+')));
  }

  encryptData(
    data: Record<string, unknown>[] | Record<string, unknown> | unknown
  ) {
    return CryptoJS.AES.encrypt(
      JSON.stringify(data),
      this.SECRET_KEY
    ).toString();
  }

  decryptData(encryptedData: string) {
    if (!encryptedData) {
      return null;
    }

    try {
      const decryptedBytes = CryptoJS.AES.decrypt(
        encryptedData,
        this.SECRET_KEY
      );
      const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  }
}
