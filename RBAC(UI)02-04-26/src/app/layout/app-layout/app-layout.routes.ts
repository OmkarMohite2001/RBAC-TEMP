import { Route } from '@angular/router';
import { ThemeComponent } from '../../pages/theme/theme.component';
import { ManageUsersComponent } from '../../pages/manage-users/manage-users.component';
import { ApplicationsComponent } from '../../pages/manage-applications/applications/applications.component';
import { ModuleListComponent } from '../../pages/manage-applications/module-list/module-list.component';
import { ManageModuleComponent } from '../../pages/manage-applications/manage-module/manage-module.component';
import { AccessControlComponent } from '../../pages/access-control/access-control/access-control.component';
import { ViewAccessControlComponent } from '../../pages/access-control/view-access-control/view-access-control.component';
import { AccessLogsComponent } from '../../pages/access-logs/access-logs.component';
import { authGuard } from '../../core/guards/auth.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    // canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'manage-users',
        pathMatch: 'full',
      },
      {
        path: 'manage-users',
        component: ManageUsersComponent,
        canActivate: [authGuard],
        title: 'Manage Users',
      },
      {
        path: 'applications',
        component: ApplicationsComponent,
        canActivate: [authGuard],
        title: 'Applications',
      },
      {
        path: 'module-list',
        canActivate: [authGuard],
        component: ModuleListComponent,
        title: 'Module list',
      },
      {
        path: 'applications/manage-module',
        canActivate: [authGuard],
        component: ManageModuleComponent,
        title: 'Edit Applications',
      },
      {
        path: 'access-control',
        component: AccessControlComponent,
        canActivate: [authGuard],
        title: 'Access Control',
      },
      {
        path: 'access-control/:mode',
        canActivate: [authGuard],
        component: ViewAccessControlComponent,
        title: 'View Access Control',
      },
      {
        path: 'theme',
        component: ThemeComponent,
        title: 'Theme UI',
      },
    ],
  },
];
