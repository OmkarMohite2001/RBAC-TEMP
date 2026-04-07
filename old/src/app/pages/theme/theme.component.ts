import { Component } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormLayoutType, NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'app-theme',
  imports: [
    AngularSvgIconModule,
    NzButtonModule,
    NzFlexModule,
    NzModalModule,
    NzInputModule,
    NzFormModule,
    NzGridModule,
    NzSelectModule,
    NzDatePickerModule,
  ],
  templateUrl: './theme.component.html',
  styleUrl: './theme.component.scss',
})
export class ThemeComponent {
  flexDirection = false;
  vertical: NzFormLayoutType = 'vertical';
  selectedValue = null;
  date = null;

  // Modal
  isVisible = false;

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
}
