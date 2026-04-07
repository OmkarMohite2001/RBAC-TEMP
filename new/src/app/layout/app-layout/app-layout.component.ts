import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, NzLayoutModule, SidebarComponent, HeaderComponent],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss',
})
export class AppLayoutComponent {
  @Input() pageType: 'list' | 'entry' | 'dashboard' = 'dashboard';
}
