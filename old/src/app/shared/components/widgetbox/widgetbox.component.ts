import { Component, Input } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NzFlexModule } from 'ng-zorro-antd/flex';

@Component({
  selector: 'app-widgetbox',
  standalone: true,
  imports: [AngularSvgIconModule, NzFlexModule],
  templateUrl: './widgetbox.component.html',
  styleUrls: ['./widgetbox.component.scss'],
})
export class WidgetboxComponent {
  @Input() title: string = '';
  @Input() number: number = 0;
  @Input() svg: string = '/assets/icon/icon-presentation.svg';
  @Input() iconClass: string = '';
  @Input() linkIconClass: string = '';
}
