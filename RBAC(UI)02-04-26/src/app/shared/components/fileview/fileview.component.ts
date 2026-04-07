import { Component, Input } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';

@Component({
  selector: 'app-fileview',
  imports: [NzFlexModule, AngularSvgIconModule, NzButtonModule],
  templateUrl: './fileview.component.html',
  styleUrl: './fileview.component.scss',
})
export class FileviewComponent {
  @Input() filename: string = '';
}
