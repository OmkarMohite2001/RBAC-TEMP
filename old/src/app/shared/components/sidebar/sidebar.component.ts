import { Component, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserData } from '../../../pages/manage-users/manage-users.interface';
import { Role, RoleModulePermission } from '../../../pages/access-control/access-control.interface';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    AngularSvgIconModule,
    NzLayoutModule,
    NzMenuModule,
    NzAvatarModule,
    NzDropDownModule,
    NzButtonModule,
    RouterModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  userData = {} as UserData;
  isSupervisor = false;
  // Sidebar Toggle in Mobile View (Close Class)
  constructor(
    private renderer: Renderer2,
    private auth: AuthService
  ) {
    this.userData = this.auth.decodeJwtPayload();

    const storedRoles = localStorage.getItem('roles'); 
    if (storedRoles) {
      try {
        const parsedRoles = JSON.parse(storedRoles) as { roleId: number; roleName: string }[];
        this.isSupervisor = parsedRoles.some(
          (role) => role.roleName?.toLowerCase() === 'supervisor'
        );
      } catch (e) {
        console.error('Failed to parse roles from localStorage', e);
      }
    }


    // Check role
    // this.isSupervisor = this.userData?.roles?.some(
    //   (role: Role) => role.name?.toLowerCase() === 'supervisor'
    // );
  }


  sidebarClose() {
    const body = document.body;
    this.renderer.removeClass(body, 'sidebar-open');
  }

  logout() {
    this.auth.logout();
  }
}
