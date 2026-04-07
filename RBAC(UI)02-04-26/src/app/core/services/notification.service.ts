import { inject, Injectable } from '@angular/core';
import {
  NzNotificationPlacement,
  NzNotificationService,
} from 'ng-zorro-antd/notification';
enum NotifyClassEnum {
    success = 'notify-success',
    error = 'notify-error',
    warning = 'notify-warning',
    info = 'notify-info',
    blank = 'notify-blank'
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly notificationService = inject(NzNotificationService);
  notify(
    type: 'success' | 'info' | 'warning' | 'error' | 'blank',
    message: string,
    width: string = '400px',
    placement: NzNotificationPlacement = 'top',
    duration = 3000
  ) {
    const baseConfig = {
      nzPlacement: placement,
      nzDuration: duration,
      nzClass: NotifyClassEnum[type as keyof typeof NotifyClassEnum]
    };

    this.notificationService.create(type, message, '', {
      ...baseConfig,
      nzStyle: {
        width: width,
      },
    });
  }
}
