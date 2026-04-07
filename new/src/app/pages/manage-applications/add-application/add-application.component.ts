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

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import {
  ApiResponse,
  ErrorResponse,
  paginatedResult,
} from '../../../core/models/api-request-response.interface';
import { NotificationService } from '../../../core/services/notification.service';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { LoaderService } from '../../../core/services/loader.service';
import { Department } from '../../department/department.interface';
import { Role } from '../../access-control/access-control.interface';
import { AccessControlService } from '../../access-control/access-control.service';
import { DepartmentService } from '../../department/department.service';
import { ManageApplicationService } from '../manage-applications.service';
import {
  ApplicationListRecord,
} from '../manage-applications.interface';

@Component({
  selector: 'app-add-edit-user',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzRadioModule,
    CommonModule,
    NzButtonModule,
    AngularSvgIconModule,
    NzDatePickerModule,
    NzSelectModule,
    NzSpinModule,
    NzFlexModule,
    NzGridModule,
    NzInputModule,
    NzModalModule,
    NzSpinModule,
  ],
  templateUrl: './add-application.component.html',
  styleUrl: './add-application.component.scss',
})
export class AddApplicationComponent
  extends FormComponent
  implements OnInit, OnDestroy
{
  mode = Mode;
  override originalData = {} as ApplicationListRecord;
  displayMode: Mode;
  loading: boolean = false;
  loadingSync: boolean = false;
  loading$: Observable<boolean>;
  isVisibleConfirmationModal = false;
  destroy$ = new Subject<void>();
  departmentList: Department[] = [];
  roleList: Role[] = [];
  //positiveNumberPattern = MASKS.POSITIVE_NUMBER;
  constructor(
    private modalRef: NzModalRef,
    private fb: FormBuilder,
    private applicationService: ManageApplicationService,
    private notification: NotificationService,
    private loaderService: LoaderService,
    private accessSrv: AccessControlService,
    private departmentSrv: DepartmentService,
    @Inject(NZ_MODAL_DATA)
    public params: { type: Mode; data: ApplicationListRecord }
  ) {
    super();
    this.loading$ = this.loaderService.loading$;
    this.initForm();
    this.getMasterData();
    this.displayMode = params.type;
    if (!!params.data) {
      this.getApplicationById(params.data.id);
      this.displayMode === Mode.VIEW
        ? this.form.disable()
        : this.formFieldControl();
    }
    
    this.form.valueChanges.subscribe(() => {
      this.isFormValueChange = this.isFormChanged();
   });
  }

  formFieldControl() {
    const disabledFields = ['apiKey'];
    Object.entries(this.form.controls).forEach(([field, control]) => {
      disabledFields.includes(field) ? control.disable() : control.enable();
    });
  }

  ngOnInit(): void {
    
  }

  async getMasterData() {
    await Promise.all([
      this.accessSrv.getRolesForDropDown().toPromise(),
      this.departmentSrv.getDepartmentsForDropDown().toPromise(),
    ]).then(
      ([roleList, departmentList]: [
        ApiResponse<paginatedResult<Role>> | undefined,
        ApiResponse<paginatedResult<Department>> | undefined,
      ]) => {
        this.roleList = roleList ? roleList.result.data : [];
        this.departmentList = departmentList ? departmentList.result.data : [];
      }
    );
  }

  initForm() {
    this.form = this.fb.group({
      name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      description: new FormControl('', [
        Validators.required,
        Validators.maxLength(255),
      ]),
      apiEndpointUrl: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(http:\/\/|https:\/\/)[\w.-]+(:\d+)?(\/[^\s]*)?$/i
        ),
      ]),
      accessKey: new FormControl('', [
        Validators.required,
        Validators.maxLength(25),
        Validators.pattern(/^[^\s]+$/),
      ]),
      apiKey: new FormControl(''),
      isActive: new FormControl(true),
    });
  }

  getApplicationById(id: number) {
    this.loaderService.show();
    this.applicationService
      .getApplicationById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ApiResponse<ApplicationListRecord>) => {
          this.originalData = response.result || {};
          this.form.patchValue(response.result);
          this.loaderService.hide();
        },
        error: (error: Error) => {
          console.log(error);
          this.loaderService.show();
        },
      });
  }

  changeMode() {
    this.displayMode = this.mode.EDIT;
    this.modalRef.updateConfig({ nzTitle: 'Edit Application' });
    this.formFieldControl();
  }

  handleCancel(): void {
    this.modalRef.close();
  }

  openConfirmModal(): void {
    this.isVisibleConfirmationModal = true;
  }

  submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.form.markAsDirty();
      return;
    }
    this.loading = true;
    const payload = { ...this.form.value, id: this.originalData.id };
    const operation$ =
      this.displayMode === this.mode.EDIT
        ? this.applicationService.editApplication(this.originalData.id, payload)
        : this.applicationService.createApplication(this.form.getRawValue());

    operation$
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
    //display success message
    this.notification.notify(
      'success',
      this.displayMode === this.mode.EDIT
        ? 'Application Updated Successfully'
        : 'Application Created Successfully'
    );
    this.modalRef.close();
  }

  handleError(error: ErrorResponse) {
    //display error message
    this.notification.notify('error', error.message);
  }

  resetForm() {
    this.displayMode === this.mode.EDIT
      ? this.form.patchValue(this.originalData)
      : this.form.reset();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
