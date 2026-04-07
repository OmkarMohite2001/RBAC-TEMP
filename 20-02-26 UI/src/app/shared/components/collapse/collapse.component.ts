import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';

@Component({
  selector: 'app-collapse',
  imports: [NzCollapseModule, AngularSvgIconModule,CommonModule],
  templateUrl: './collapse.component.html',
  styleUrl: './collapse.component.scss',
})
export class CollapseComponent {
  @Input() panels: { header: string; content: any }[] = [];
}
