import { Route } from '@angular/router';
import { ThemeComponent } from '../../pages/theme/theme.component';
import { ManageUsersComponent } from '../../pages/manage-users/manage-users.component';
import { ApplicationsComponent } from '../../pages/manage-applications/applications/applications.component';
import { ModuleListComponent } from '../../pages/manage-applications/module-list/module-list.component';
import { ManageModuleComponent } from '../../pages/manage-applications/manage-module/manage-module.component';
import { AccessControlComponent } from '../../pages/access-control/access-control/access-control.component';
import { ViewAccessControlComponent } from '../../pages/access-control/view-access-control/view-access-control.component';
import { AccessLogsComponent } from '../../pages/access-logs/access-logs.component';
import { ManageContractUserComponent } from '../../pages/manage-contract-user/manage-contract-user.component';
import { AddEditContractUserComponent } from '../../pages/manage-contract-user/add-edit-contract-user/add-edit-contract-user.component';

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
        title: 'Manage Users',
      },
      {
        path: 'manage-contract-user',
        component: ManageContractUserComponent,
        title: 'Manage Contract Users',
      },
      {
        path: 'manage-contract-user/add',
        component: AddEditContractUserComponent,
        title: 'Add Contract User',
      },
      {
        path: 'manage-contract-user/edit/:id',
        component: AddEditContractUserComponent,
        title: 'Edit Contract User',
      },
      {
        path: 'applications',
        component: ApplicationsComponent,
        title: 'Applications',
      },
      {
        path: 'module-list',
        component: ModuleListComponent,
        title: 'Module list',
      },
      {
        path: 'applications/manage-module',
        component: ManageModuleComponent,
        title: 'Edit Applications',
      },
      {
        path: 'access-control',
        component: AccessControlComponent,
        title: 'Access Control',
      },
      {
        path: 'access-control/:mode',
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
