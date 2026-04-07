import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormComponent } from '../../../shared/components/form/form.component';
import { Mode } from '../../../core/enums/mode.enum';
import { UsersListRecord } from '../manage-users.interface';
import { finalize, Observable, Subject, take, takeUntil } from 'rxjs';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ManageUsersService } from '../manage-users.service';
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
import { ManageContractUsersService } from '../../manage-contract-user/manage-contract-users.service';

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
  templateUrl: './add-edit-user.component.html',
  styleUrl: './add-edit-user.component.scss',
})
export class AddEditUserComponent
  extends FormComponent
  implements OnInit, OnDestroy {
  mode = Mode;
  override originalData = {} as UsersListRecord;
  displayMode: Mode;
  loading: boolean = false;
  loadingSync: boolean = false;
  loading$: Observable<boolean>;
  isVisibleConfirmationModal = false;
  destroy$ = new Subject<void>();
  departmentList: Department[] = [];
  roleList: Role[] = [];
  allowedDepartments: number[] = [];
  defaultSelectedDepartments: number[] = [];
  //positiveNumberPattern = MASKS.POSITIVE_NUMBER;
  constructor(
    private modalRef: NzModalRef,
    private fb: FormBuilder,
    private userSrv: ManageUsersService,
    private contractUserSrv: ManageContractUsersService,
    private notification: NotificationService,
    private loaderService: LoaderService,
    private accessSrv: AccessControlService,
    private departmentSrv: DepartmentService,
    @Inject(NZ_MODAL_DATA)
    public params: { type: Mode; data: UsersListRecord }
  ) {
    super();
    this.loading$ = this.loaderService.loading$;
    this.initForm();
    this.getMasterData();
    this.displayMode = params.type;
    if (!!params.data) {
      //this.userData = params.data;
      this.getUserById(params.data.id);
      this.control('employeeId').disable();
      this.displayMode === Mode.VIEW
        ? this.form.disable()
        : this.formFieldControl();
    }
  }

  ngOnInit(): void {
    this.control('employeeId').valueChanges.subscribe(res => {
      if (!!res) {
        this.control('email').setValue('');
        this.control('firstName').setValue('');
        this.control('lastName').setValue('');
        this.control('managerEmail').setValue('');
        this.control('managerName').setValue('');
      }
    });
    this.control('email').valueChanges.subscribe(email => {
      if (email) {
        this.handleEmailChange(email);
      }
    });

    this.form.valueChanges.subscribe(() => {
      this.isFormValueChange = this.isFormChanged();
    });
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
      email: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      firstName: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      lastName: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      employeeId: new FormControl('', [Validators.required]),
      managerName: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      managerEmail: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      roleIds: new FormControl([], [Validators.required]),

      departmentIds: new FormControl([], [Validators.required]),
      isActive: new FormControl(true, [Validators.required]),
    });
  }

  syncUserData() {
    if (!this.value('employeeId')) {
      return;
    }
    this.loadingSync = true;
    this.userSrv
      .getUserByEmployeeId(this.value('employeeId'))
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.loadingSync = false))
      )
      .subscribe({
        next: (response: any) => {
          this.form.patchValue(response.result);
        },
        error: (error: ErrorResponse) => {
          console.log(error);
          this.notification.notify(
            'error',
            'Employee ID not found or is invalid'
          );
        },
      });
  }

  getUserById(userId: number) {
    this.loaderService.show();
    this.userSrv
      .getUserById(userId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loaderService.hide())
      )
      .subscribe({
        next: (response: any) => {
          this.originalData = response.result;
          this.form.patchValue(response.result);
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  formFieldControl() {
    const enableFields = ['roleIds', 'departmentIds', 'isActive'];
    Object.entries(this.form.controls).forEach(([field, control]) => {
      if (field !== 'employeeId') {
        enableFields.includes(field) ? control.enable() : control.disable();
      }
    });
  }

  changeMode() {
    this.displayMode = this.mode.EDIT;
    this.modalRef.updateConfig({ nzTitle: 'Edit User' });
    this.formFieldControl();
  }

  handleCancel(): void {
    this.modalRef.close();
  }

  openConfirmModal(): void {
    this.isVisibleConfirmationModal = true;
  }

  isDepartmentDisabled(department: Department): boolean {
    return !this.allowedDepartments.includes(department.id);
  }

  handleEmailChange(email: string): void {
    const lowerEmail = email?.toLowerCase();
    if (lowerEmail.includes('kbl')) {
      this.setDepartmentSelection([1, 2], [1, 2]);
      return;
    }
    if (lowerEmail.includes('kepl')) {
      this.setDepartmentSelection([3], [3]);
      return;
    }
    this.setDepartmentSelection([], []);
  }

  private setDepartmentSelection(
    allowed: number[],
    preselected: number[]
  ): void {
    this.allowedDepartments = allowed;
    this.defaultSelectedDepartments = preselected;
    if (preselected.length) {
      this.form.get('departmentIds')?.setValue(preselected);
    } else {
      this.form.get('departmentIds')?.reset();
    }
  }

  submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.form.markAsDirty();
      return;
    }
    this.loading = true;

    // const payload = this.form.getRawValue();
    const formValue = this.form.getRawValue();
    console.log("Formvalue Data:", formValue)


    const selectedRoleName =
    this.roleList.find(
      role =>
        (formValue.roleIds || []).includes(role.id) &&
        (role.name === 'Operator' || role.name === 'Supervisor' || role.name === 'DRC_admin')
    )?.name || null;

    const payload = {
      ...formValue,
      userRole: selectedRoleName,
      departmentIds: (formValue.departmentIds || []).map((id: number) => ({
        departmentId: id,
        departmentName: null
      }))
    };

    console.log("Contract Payload:", payload);

    const operation$ =
      this.displayMode === this.mode.EDIT
        ? this.userSrv.editUser(this.originalData.id, this.form.getRawValue())
        : this.userSrv.createUser(this.form.getRawValue());

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
          // this.handleSuccess();

          this.contractUserSrv.addContractEmployee(payload).pipe(take(1)).subscribe({
            next: () => {
              console.log('Contract employee saved via addContractEmployee()');
            },
            error: (error) => {
              console.error('Failed to save contract employee:', error);
            }
          });
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
        ? 'User Updated Successfully'
        : 'User Created Successfully'
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
