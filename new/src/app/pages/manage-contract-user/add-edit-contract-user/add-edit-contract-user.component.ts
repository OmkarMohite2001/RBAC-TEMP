import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { finalize, Observable, Subject, takeUntil } from 'rxjs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import {
  NZ_MODAL_DATA,
  NzModalModule,
  NzModalRef,
} from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { Mode } from '../../../core/enums/mode.enum';
import {
  ApiResponse,
  ErrorResponse,
  paginatedResult,
} from '../../../core/models/api-request-response.interface';
import { AuthService } from '../../../core/services/auth.service';
import { LoaderService } from '../../../core/services/loader.service';
import { NotificationService } from '../../../core/services/notification.service';
import { FormComponent } from '../../../shared/components/form/form.component';
import { AccessControlService } from '../../access-control/access-control.service';
import { Role } from '../../access-control/access-control.interface';
import { DepartmentService } from '../../department/department.service';
import { Department } from '../../department/department.interface';
import {
  ContractEmployee,
  ContractUsersListRecord,
} from '../manage-contract-user.interface';
import { ManageContractUsersService } from '../manage-contract-users.service';

@Component({
  selector: 'app-add-edit-contract-user',
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
    NzTagModule,
    NzSwitchModule,
  ],
  templateUrl: './add-edit-contract-user.component.html',
  styleUrl: './add-edit-contract-user.component.scss',
})
export class AddEditContractUserComponent
  extends FormComponent
  implements OnInit, OnDestroy
{
  mode = Mode;
  override originalData = {} as ContractUsersListRecord;
  displayMode: Mode;
  loading = false;
  loadingSync = false;
  loading$: Observable<boolean>;
  destroy$ = new Subject<void>();
  departmentList: Department[] = [];
  roleList: Role[] = [];
  contractUserData!: ContractUsersListRecord;
  originalFormValue: unknown;
  loggedInUserId = 0;

  constructor(
    private modalRef: NzModalRef,
    private fb: FormBuilder,
    private notification: NotificationService,
    private loaderService: LoaderService,
    private accessSrv: AccessControlService,
    private departmentSrv: DepartmentService,
    private userSrv: ManageContractUsersService,
    private authService: AuthService,
    @Inject(NZ_MODAL_DATA)
    public params: { type: Mode; data: ContractUsersListRecord }
  ) {
    super();
    this.loading$ = this.loaderService.loading$;
    this.displayMode = params?.type ?? Mode.ADD;
    this.contractUserData = params?.data ?? ({} as ContractUsersListRecord);
    this.loggedInUserId = Number(
      this.authService.getUserId() ?? this.authService.getEmployeeId() ?? 0
    );
    this.initForm();
    this.getMasterData();
  }

  ngOnInit(): void {
    if (
      this.contractUserData?.employeeCode &&
      (this.displayMode === Mode.EDIT || this.displayMode === Mode.VIEW)
    ) {
      this.getUserById(this.contractUserData.employeeCode);
    } else if (this.contractUserData?.employeeCode) {
      this.patchFormData(this.contractUserData);
    }

    this.formFieldControl();

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.isFormValueChange = this.isFormChanged();
    });
  }

  override isFormChanged(): boolean {
    return (
      JSON.stringify(this.form.getRawValue()) !==
      JSON.stringify(this.originalFormValue)
    );
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
      employeeCode: [null, [Validators.required]],
      firstName: [''],
      lastName: [''],
      userRole: [null, [Validators.required]],
      departmentIds: [[], [Validators.required]],
      employeeStartDate: [null, [Validators.required]],
      employeeEndDate: [null, [Validators.required]],
      employeePassword: [null],
      isTempPassword: [true],
      employeeID: [null],
      isContractorEmployee: [1],
    });
  }

  private patchFormData(data: ContractUsersListRecord): void {
    const selectedRoleId =
      this.roleList.find(role => role.name === data.userRole)?.id ?? null;

    this.form.patchValue({
      employeeCode: data.employeeCode || null,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      userRole: selectedRoleId,
      employeePassword: data.employeePassword || '',
      employeeStartDate: data.employeeStartDate
        ? new Date(data.employeeStartDate)
        : null,
      employeeEndDate: data.employeeEndDate
        ? new Date(data.employeeEndDate)
        : null,
      departmentIds:
        data.departments?.map(department => department.departmentId) || [],
      employeeID: data.employeeId || null,
    });
    this.originalFormValue = this.form.getRawValue();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.updateValueAndValidity();
  }

  syncUserData(): void {
    const empCode = this.form.get('employeeCode')?.value;
    const name = this.form.get('firstName')?.value;

    const payload = {
      EmpCode: empCode ? String(empCode).trim() : null,
      Name: name ? String(name).trim() : null,
    };

    this.loadingSync = true;
    this.userSrv
      .syncContractEmployee(payload)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.loadingSync = false))
      )
      .subscribe({
        next: response => {
          if (!Array.isArray(response) || response.length === 0) {
            this.notification.notify('error', 'No matching employee found');
            return;
          }

          const result = response[0] as unknown as Record<string, unknown>;
          this.form.patchValue({
            employeeID: result['EmployeeID'] ?? null,
            employeeCode: result['EmployeeCode'] ?? null,
            firstName: result['FirstName'] ?? '',
            lastName: result['LastName'] ?? '',
            userRole:
              typeof result['userRole'] === 'object' &&
              result['userRole'] !== null &&
              'id' in (result['userRole'] as Record<string, unknown>)
                ? (result['userRole'] as Record<string, unknown>)['id']
                : null,
            departmentIds: Array.isArray(result['departmentIds'])
              ? (result['departmentIds'] as { departmentId: number }[]).map(
                  department => department.departmentId
                )
              : [],
            employeeStartDate: result['EmployeeStartDate']
              ? new Date(String(result['EmployeeStartDate']))
              : null,
            employeeEndDate: result['EmployeeEndDate']
              ? new Date(String(result['EmployeeEndDate']))
              : null,
          });

          this.originalFormValue = this.form.getRawValue();
          this.notification.notify(
            'success',
            'Contract employee data synced'
          );
        },
        error: () =>
          this.notification.notify('error', 'Failed to sync employee data'),
      });
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();
    const payload = {
      employeeCode: formValue.employeeCode,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      userRole:
        this.roleList.find(role => role.id === formValue.userRole)?.name || '',
      EmployeePassword: formValue.employeePassword || 'KBL@123',
      IsTempPassword: formValue.isTempPassword ?? true,
      EmployeeStartDate: formValue.employeeStartDate
        ? new Date(formValue.employeeStartDate).toISOString()
        : new Date().toISOString(),
      EmployeeEndDate: formValue.employeeEndDate
        ? new Date(formValue.employeeEndDate).toISOString()
        : new Date().toISOString(),
      departmentIds: (formValue.departmentIds || []).map((id: number) => {
        const department = this.departmentList.find(item => item.id === id);
        return {
          departmentId: id,
          departmentName: department ? department.name : '',
        };
      }),
      employeeId:
        this.displayMode === Mode.EDIT
          ? formValue.employeeCode
          : formValue.employeeID,
      isContractEmployee: true,
      CreatedBy: this.loggedInUserId,
    };

    this.loading = true;
    const request$ =
      this.displayMode === Mode.EDIT
        ? this.userSrv.updateContractEmployee(payload)
        : this.userSrv.addContractEmployee(payload);

    request$
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.loading = false))
      )
      .subscribe({
        next: () => {
          this.handleSuccess();
        },
        error: err => {
          this.handleError(err as ErrorResponse);
        },
      });
  }

  getUserById(employeeCode: number) {
    this.loaderService.show();

    const payload = {
      employeeId: employeeCode.toString(),
      Name: null,
    };

    this.userSrv
      .getUserById(payload)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loaderService.hide())
      )
      .subscribe({
        next: response => {
          const employee = response.result as ContractEmployee;
          const selectedRoleId =
            typeof employee.userRole === 'number'
              ? employee.userRole
              : this.roleList.find(role => role.name === employee.userRole)?.id ??
                null;

          const mappedData: ContractUsersListRecord = {
            employeeId: Number(employee.employeeId),
            employeeCode: Number(employee.employeeCode),
            firstName: employee.firstName,
            lastName: employee.lastName,
            userRole: String(employee.userRole ?? ''),
            departmentIds:
              employee.departments?.map(department =>
                String(department.departmentId)
              ) || [],
            departments: employee.departments || [],
            employeePassword: employee.employeePassword,
            employeeStartDate: employee.employeeStartDate,
            employeeEndDate: employee.employeeEndDate,
            isActive: employee.isActive,
            isContractEmployee: employee.isContractEmployee,
          };

          this.originalData = mappedData;

          this.form.patchValue({
            employeeCode: Number(employee.employeeCode),
            firstName: employee.firstName || '',
            lastName: employee.lastName || '',
            userRole: selectedRoleId,
            departmentIds:
              employee.departments?.map(department => department.departmentId) ||
              [],
            employeePassword: employee.employeePassword || '',
            employeeStartDate: employee.employeeStartDate
              ? new Date(employee.employeeStartDate)
              : null,
            employeeEndDate: employee.employeeEndDate
              ? new Date(employee.employeeEndDate)
              : null,
            employeeID: employee.employeeId || null,
          });

          this.originalFormValue = this.form.getRawValue();
          this.form.markAsPristine();
          this.form.markAsUntouched();
          this.form.updateValueAndValidity();
          this.formFieldControl();
        },
        error: error => {
          console.error('Failed to sync user:', error);
          this.notification.notify('error', 'Failed to load contract user');
        },
      });
  }

  formFieldControl() {
    const enableFields = [
      'employeeCode',
      'userRole',
      'departmentIds',
      'isTempPassword',
      'employeeStartDate',
      'employeeEndDate',
    ];

    Object.entries(this.form.controls).forEach(([key, control]) => {
      if (this.displayMode === Mode.VIEW) {
        control.disable();
        return;
      }

      if (key === 'employeeCode') {
        this.displayMode === Mode.ADD ? control.enable() : control.disable();
        return;
      }

      if (key === 'firstName' || key === 'lastName' || key === 'employeeID') {
        control.disable();
        return;
      }

      enableFields.includes(key) ? control.enable() : control.disable();
    });
  }

  changeMode() {
    this.displayMode = this.mode.EDIT;
    this.modalRef.updateConfig({ nzTitle: 'Edit Contract User' });
    this.formFieldControl();
  }

  handleCancel(): void {
    this.modalRef.close();
  }

  handleSuccess() {
    this.notification.notify(
      'success',
      this.displayMode === this.mode.EDIT
        ? 'Contract User Updated Successfully'
        : 'Contract User Created Successfully'
    );
    this.modalRef.close('save');
  }

  handleError(error: ErrorResponse) {
    this.notification.notify('error', error.message);
  }

  resetForm() {
    if (
      this.displayMode === this.mode.EDIT ||
      this.displayMode === this.mode.VIEW
    ) {
      this.form.reset(this.originalFormValue);
      this.formFieldControl();
      return;
    }

    this.form.reset({
      employeeCode: null,
      firstName: '',
      lastName: '',
      userRole: null,
      departmentIds: [],
      employeeStartDate: null,
      employeeEndDate: null,
      employeePassword: null,
      isTempPassword: true,
      employeeID: null,
      isContractorEmployee: 1,
    });
    this.formFieldControl();
  }

  get departmentIds(): FormArray {
    return this.form.get('departmentIds') as FormArray;
  }

  get isTempPasswordControl(): FormControl {
    return this.form.get('isTempPassword') as FormControl;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
