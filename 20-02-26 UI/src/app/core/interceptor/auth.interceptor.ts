import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const lowerCaseUrl = req.url.toLowerCase();
  const isValidateApi = lowerCaseUrl.includes('/validate/');
  const isRouteCardApi = lowerCaseUrl.includes('/routcarduat/') || lowerCaseUrl.includes('/routecard/');
  let modifiedReq = req;

  if(isRouteCardApi || isValidateApi){
    modifiedReq = req.clone({
      withCredentials: true
    });
  }else {
    const token = localStorage.getItem('authToken');
    if(token){
      modifiedReq = req.clone({
        setHeaders:{
          Authorization:`Bearer ${token}`
        }
      });
    }
  }
  return next(modifiedReq).pipe(
    catchError(error => {
      const isCookieBasedApi = isRouteCardApi || isValidateApi;
      if (error.status === 401 && !isCookieBasedApi) {
        localStorage.clear();
        authService.logout();
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
};
