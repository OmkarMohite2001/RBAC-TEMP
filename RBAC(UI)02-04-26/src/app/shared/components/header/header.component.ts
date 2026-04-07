import { CommonModule } from '@angular/common';
import { Component, HostListener, Renderer2 } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    NzLayoutModule,
    NzSelectModule,
    NzButtonModule,
    AngularSvgIconModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  public isScrolled = false;
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 0;
  }

  // Sidebar Toggle in Mobile View (Open Class)
  constructor(private renderer: Renderer2) {}
  sidebarOpen() {
    const body = document.body;
    this.renderer.addClass(body, 'sidebar-open');
  }
}
