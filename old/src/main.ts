import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

const base = document.querySelector('base');
if (base) {
  base.setAttribute('href', environment.baseHref);
} else {
  const newBase = document.createElement('base');
  newBase.setAttribute('href', environment.baseHref);
  document.head.appendChild(newBase);
}

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
