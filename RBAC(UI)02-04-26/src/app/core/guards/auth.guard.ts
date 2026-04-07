import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';
import { RuntimeConfigService } from '../services/runtime-config.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const configService = inject(RuntimeConfigService);
  const userData = authService.decodeJwtPayload();
  const employeeId = authService.getEmployeeId();
  const ids = configService.get<number[]>('allowIds');
  if (
    (authService.isAuthenticated() && state.url !== '/applications') ||
    (authService.isAuthenticated() &&
      userData &&
      state.url === '/applications' &&
      ids.includes(Number(employeeId)))
  ) {
    return true;
  } else {
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url },
    });
    localStorage.clear();
    return false;
  }
};
