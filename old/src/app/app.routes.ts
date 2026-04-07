import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';

const authRoutes: Routes = [
  {
    path: 'auth',
    //  canActivate: [authGuard],
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./layout/auth-layout/auth-layout.routes').then(m => m.authRoutes),
  },
];

const applicationRoutes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    loadChildren: () =>
      import('./layout/app-layout/app-layout.routes').then(m => m.appRoutes),
  },
];

export const routes: Routes = [
  ...authRoutes,
  ...applicationRoutes,
  { path: '**', redirectTo: '/auth/login' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      paramsInheritanceStrategy: 'always',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
