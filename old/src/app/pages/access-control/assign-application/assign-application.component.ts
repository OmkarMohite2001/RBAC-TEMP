import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormComponent } from '../../../shared/components/form/form.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { finalize, Subject, take, takeUntil } from 'rxjs';
import { AccessControlService } from '../access-control.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ManageApplicationService } from '../../manage-applications/manage-applications.service';
import {
  DropDownOptions,
  ErrorResponse,
} from '../../../core/models/api-request-response.interface';
import {
  applicationOptions,
  applicationOptionsResult,
} from '../../manage-applications/manage-applications.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assign-application',
  imports: [
    NzModalModule,
    ReactiveFormsModule,
    NzFormModule,
    NzButtonModule,
    NzSelectModule,
    NzInputModule,
    CommonModule,
  ],
  templateUrl: './assign-application.component.html',
  styleUrl: './assign-application.component.scss',
})
export class AssignApplicationComponent
  extends FormComponent
  implements OnDestroy, OnInit
{
  applicationOption: applicationOptions[] = [];
  loading: boolean = false;
  destroy$ = new Subject<void>();

  constructor(
    private modalRef: NzModalRef,
    private fb: FormBuilder,
    private accessControlService: AccessControlService,
    private notification: NotificationService,
    private appService: ManageApplicationService,
    @Inject(NZ_MODAL_DATA)
    public params: { roleId: number; applicationIds: number[] }
  ) {
    super();
    this.initForm();
    this.getMasterDropDownData();
  }
  ngOnInit() {}

  initForm() {
    this.form = this.fb.group({
      applicationId: new FormControl([], [Validators.required]),
    });
  }

  getMasterDropDownData(params?: DropDownOptions) {
    this.appService
      .getApplicationForDropdown(!!params ? params : undefined)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: applicationOptionsResult) => {
          this.applicationOption = (response.result.data || []).filter(
            app =>
              !this.params.applicationIds?.length ||
              !this.params.applicationIds.includes(app.id)
          );
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  handleCancel(): void {
    this.modalRef.close('cancel');
  }

  submitForm(): void {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.accessControlService
      .assignNewApplication(this.params.roleId, this.form.value.applicationId)
      .pipe(
        take(1),
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: () => {
          this.handleSuccess();
        },
        error: (error: ErrorResponse) => {
          this.handleError(error);
        },
      });
  }

  handleSuccess() {
    this.form.reset();
    this.notification.notify('success', 'Application Assigned Successfully');
    this.modalRef.close('save');
  }

  handleError(error: ErrorResponse) {
    this.notification.notify('error', error.message);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
