import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import {
  NzNotificationService,
  NzNotificationComponent,
} from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-toast',
  imports: [NzButtonModule, NzFlexModule, AngularSvgIconModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  @ViewChild('template1', { static: true }) template1!: TemplateRef<{}>;
  @ViewChild('template2', { static: true }) template2!: TemplateRef<{}>;
  @ViewChild('template3', { static: true }) template3!: TemplateRef<{}>;

  @Input() message: string = '';
  @Input() type: 'success' | 'warning' | 'confirm-success' = 'success';

  constructor(private notification: NzNotificationService) {}

  createNotification(): void {
    let selectedTemplate: TemplateRef<{}>;

    switch (this.type) {
      case 'success':
        selectedTemplate = this.template2;
        break;
      case 'warning':
        selectedTemplate = this.template3;
        break;
      case 'confirm-success':
        selectedTemplate = this.template1;
        break;
      default:
        selectedTemplate = this.template2;
    }

    this.notification.template(selectedTemplate, {
      nzPlacement: 'top',
    });
  }

  closeNotification(notification: NzNotificationComponent): void {
    notification.close();
  }
}
