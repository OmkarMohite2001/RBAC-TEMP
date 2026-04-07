import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormComponent } from '../../../shared/components/form/form.component';
import { Mode } from '../../../core/enums/mode.enum';
import { finalize, Observable, Subject, take, takeUntil } from 'rxjs';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AccessControlService } from '../access-control.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ManageApplicationService } from '../../manage-applications/manage-applications.service';
import { Role, RoleData } from '../access-control.interface';
import {
  ApiResponse,
  DropDownOptions,
  ErrorResponse,
} from '../../../core/models/api-request-response.interface';
import {
  applicationOptions,
  applicationOptionsResult,
} from '../../manage-applications/manage-applications.interface';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { LoaderService } from '../../../core/services/loader.service';

@Component({
  selector: 'app-role-add-edit',
  imports: [
    NzButtonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzIconModule,
    NzInputModule,
    NzModalModule,
    NzFlexModule,
    NzGridModule,
    NzSelectModule,
    CommonModule,
    FormsModule,
    NzSpinModule,
    NzRadioModule,
  ],
  templateUrl: './role-add.component.html',
  styleUrl: './role-add.component.scss',
})
export class RoleAddComponent
  extends FormComponent
  implements OnDestroy, OnInit
{
  mode = Mode;
  applicationOption: applicationOptions[] = [];
  roleOption: Role[] = [];
  loading: boolean = false;
  destroy$ = new Subject<void>();
  loading$: Observable<boolean>;

  constructor(
    private modalRef: NzModalRef,
    private fb: FormBuilder,
    private accessControlService: AccessControlService,
    private notification: NotificationService,
    private loaderService: LoaderService,
    private appService: ManageApplicationService,
    @Inject(NZ_MODAL_DATA)
    public params: { data: number }
  ) {
    super();
    this.loading$ = this.loaderService.loading$;
    this.initForm();
    this.getMasterDropDownData();
    if (params.data) {
      this.getRoleById(params.data);
    }
  }
  ngOnInit() {}

  getRoleById(id: number) {
    this.loaderService.show();
    this.accessControlService
      .getRoleById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ApiResponse<RoleData>) => {
          this.control('description').setValue(
            response.result.role.description
          );
          this.control('isActive').setValue(response.result.role.isActive);
          this.control('applicationIds').setValue(
            response.result.role.applicationIds
          );
          this.control('cloneRoleId').setValue(id);
          this.loaderService.hide();
        },
        error: (error: Error) => {
          console.log(error);
          this.loaderService.show();
        },
      });
  }

  initForm() {
    this.form = this.fb.group({
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      isActive: new FormControl(null, [Validators.required]),
      applicationIds: new FormControl([], [Validators.required]),
      cloneRoleId: new FormControl(null),
    });
  }

  getMasterDropDownData(params?: DropDownOptions) {
    this.appService
      .getApplicationForDropdown(!!params ? params : undefined)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: applicationOptionsResult) => {
          this.applicationOption = response.result.data || [];
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  handleCancel(): void {
    this.modalRef.close();
  }

  submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.form.markAsDirty();
      return;
    }

    this.loading = true;

    this.accessControlService
      .createRole(this.form.value)
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
    this.notification.notify('success', 'Role Created Successfully');
    this.modalRef.close();
  }

  handleError(error: ErrorResponse) {
    this.notification.notify('error', error.message);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
