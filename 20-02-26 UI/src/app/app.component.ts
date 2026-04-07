import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { en_US, NZ_I18N, NzI18nService } from 'ng-zorro-antd/i18n';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [{ provide: NZ_I18N, useValue: en_US }],
})
export class AppComponent {
  title = 'rbac_frontend_angular';
  constructor(private i18n: NzI18nService) {
    this.i18n.setLocale(en_US);
  }
}
