import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, of, switchMap, tap, throwError} from 'rxjs';
import { environment } from '../../../environments/environment';
import { ErrorHandlingService } from './error-handling.service';
import { ApiResponse } from '../models/api-request-response.interface';
import { Login, LoginResponse } from '../../pages/auth/login/login.interface';
// var CryptoJS = require('crypto-js');

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
  ) { }

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
  validateEmployee(operatorId: string, password: string) {
    return this.http.post(
      `${environment.rbacApiUrl}/validate/validateEmployee`, { operatorId, password }
    );
  }
  login(params: Login) {
    return this.validateEmployee(params.strLoginId, params.strPassword).pipe(
      catchError(error => {
      if (error.status === 401) {
        return of(null);
      }
      return throwError(() => error);
    }),
      switchMap(() => {
        return this.http
          .post<LoginResponse>(`${this.API_URL}/Auth/Login`, params)
          .pipe(
            tap(response => {
              // Save token, roles, and permissions in localStorage
              localStorage.setItem('authToken', response.token);
              localStorage.setItem('roles', JSON.stringify(response.roles));
              localStorage.setItem('userId', JSON.stringify(response.userId));
              localStorage.setItem(
                'permissions',
                JSON.stringify(response.permissions)
              );
              this.authStateSubject.next(true);
              this.startSessionTimeout();
            })
          );
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

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('roles');
    localStorage.removeItem('permissions');
    localStorage.removeItem('userId');
    this.router.navigate(['/auth/login']);
  }

  // getAuthToken(): string | null {
  //   const token = localStorage.getItem(this.TOKEN_KEY);
  //   return token && !this.isTokenExpired(token) ? token : null;
  // }

  // Get the current authentication token
  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getTokenValue() {
    //here we will decrypt and return when enc-Dec apply
    return localStorage.getItem('authToken');
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUserId(): string | null {
    const userId = localStorage.getItem('userId');
    return userId ? JSON.parse(userId) : null;
  }

  decodeJwtPayload(): any {
    const token = this.getToken();
    const payload = token?.split('.')[1];
    if (!payload) {
      return null;
    }
    return JSON.parse(atob(payload.replace(/_/g, '/').replace(/-/g, '+')));
  }

  // encryptData(
  //   data: Record<string, unknown>[] | Record<string, unknown> | unknown
  // ) {
  //   return CryptoJS.AES.encrypt(
  //     JSON.stringify(data),
  //     this.SECRET_KEY
  //   ).toString();
  // }

  // decryptData(encryptedData: string) {
  //   if (!encryptedData) {
  //     return null;
  //   }

  //   try {
  //     const decryptedBytes = CryptoJS.AES.decrypt(
  //       encryptedData,
  //       this.SECRET_KEY
  //     );
  //     const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
  //     return JSON.parse(decryptedData);
  //   } catch (error) {
  //     console.error('Decryption failed:', error);
  //     return null;
  //   }
  // }
}


