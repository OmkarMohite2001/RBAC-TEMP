import { Route } from '@angular/router';
import { LoginComponent } from '../../pages/auth/login/login.component';
import { publicGuard } from '../../core/guards/public.guard';

export const authRoutes: Route[] = [
  {
    path: "",
    children: [
      {
        path: 'login',
        canActivate: [publicGuard],
        component: LoginComponent,
      },
    ],
  },
];
