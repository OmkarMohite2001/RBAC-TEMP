import { Component } from '@angular/core';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule, NzFormLayoutType } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormComponent } from '../../../shared/components/form/form.component';
import { AuthService } from '../../../core/services/auth.service';
import { finalize, Subject, take, takeUntil } from 'rxjs';
import { ErrorResponse } from '../../../core/models/api-request-response.interface';
import { NotificationService } from '../../../core/services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { EyeInvisibleOutline } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NzFlexModule,
    NzButtonModule,
    NzInputModule,
    NzFormModule,
    NzIconModule,
    ReactiveFormsModule,
    NzSpinModule,
    FormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent extends FormComponent {
  passwordVisible = false;
  password?: string;
  vertical: NzFormLayoutType = 'vertical';
  showPassword = false;
  returnUrl: string = "/manage-users" ;
  loading: boolean = false;
  destroy$ = new Subject<void>();
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notification: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private nzIconSrv: NzIconService
  ) {
    super();
    this.nzIconSrv.addIcon( EyeInvisibleOutline);
    this.initForm();
    this.route.queryParams.subscribe((params) => {
      this.returnUrl = params['returnUrl'] || this.returnUrl; // Use 'returnUrl' or default to '/dashboard'
    });
  }

  initForm() {
    this.form = this.fb.group({
      strLoginId: new FormControl('', [Validators.required]),
      strPassword: new FormControl('', [Validators.required]),
    });
  }

  submitForm() {
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    this.authService
      .login(this.form.value)
      .pipe(
        take(1),
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: () => {
          this.router.navigate([this.returnUrl]);
        },
        error: (error: ErrorResponse) => {
          this.handleError(error);
        },
      });
  }

  handleError(error: ErrorResponse) {
    //display error message
    this.notification.notify('error', error.message);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
