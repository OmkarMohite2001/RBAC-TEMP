import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { EMPTY, throwError } from 'rxjs';
import { SecurityService } from '../services/secuirity.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const securityService = inject(SecurityService);
  const lowerCaseUrl = req.url.toLowerCase();
  const isValidateApi = lowerCaseUrl.includes('/validate/');

  // -----------------------------
  // Security Validation
  // -----------------------------
  if (!isValidateApi && req.body && typeof req.body === 'object') {
    let isSecurityIssueDetected = false;
    const cleanedBody: Record<string, unknown> = { ...req.body };

    Object.entries(req.body).forEach(([key, value]) => {
      if (typeof value === 'string') {
        const validationResult = securityService.validateInput(value);

        if (!validationResult.isValid && key !== 'scadaUrl') {
          isSecurityIssueDetected = true;

          securityService.showSecurityAlert(
            validationResult.issue || 'Suspicious content detected',
            key
          );

          // Optional: remove the suspicious field
          // delete cleanedBody[key];
        }
      }
    });

    if (isSecurityIssueDetected) {
      return EMPTY; // Stop request completely
    }
  }
  const accept =
    req.url.includes('/api/') || req.url.includes('/API/')
      ? 'application/json'
      : '*/*';
  req = isValidateApi
    ? req.clone({
        withCredentials: true,
        setHeaders: {
          Accept: accept,
        },
      })
    : req.clone({
        setHeaders: {
          Accept: accept,
          ...(authService.isAuthenticated() && {
            Authorization: `Bearer  ${authService.getTokenValue()}`,
          }),
        },
      });

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401 && !isValidateApi) {
        authService.logout();
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
};
