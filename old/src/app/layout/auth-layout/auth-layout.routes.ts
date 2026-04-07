import { Route } from '@angular/router';
import { LoginComponent } from '../../pages/auth/login/login.component';

export const authRoutes: Route[] = [
  {
    path: "",
    // canActivate: [authGuard],
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
    ],
  },
];
