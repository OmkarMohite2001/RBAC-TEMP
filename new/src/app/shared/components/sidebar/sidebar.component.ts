import { Component, Renderer2 } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserData } from '../../../pages/manage-users/manage-users.interface';
import { RuntimeConfigService } from '../../../core/services/runtime-config.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    AngularSvgIconModule,
    NzLayoutModule,
    NzMenuModule,
    NzAvatarModule,
    NzDropDownModule,
    NzButtonModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  userData = {} as UserData;
  employeeId?: string;
  allowIds: number[] = [];
  isAllowApplication : boolean = false;
  // Sidebar Toggle in Mobile View (Close Class)
  constructor(
    private renderer: Renderer2,
    private auth: AuthService,
    private config: RuntimeConfigService
  ) {
    this.userData = this.auth.decodeJwtPayload();
    this.employeeId = this.auth.getEmployeeId();
    this.allowIds = this.config.get('allowIds');
    this.isAllowApplication =  this.userData && this.allowIds && this.allowIds.includes(Number(this.employeeId));
  }
  sidebarClose() {
    const body = document.body;
    this.renderer.removeClass(body, 'sidebar-open');
  }

  logout() {
    this.auth.logout();
  }
}
