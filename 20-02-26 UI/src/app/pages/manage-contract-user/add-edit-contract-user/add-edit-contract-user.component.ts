import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormComponent } from '../../../shared/components/form/form.component';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Mode } from '../../../core/enums/mode.enum';
// import { UsersListRecord } from '../../manage-users/manage-contract-users.interface';
import { ContractUsersListRecord } from '../manage-contract-user.interface';
import { finalize, Observable, Subject, take, takeUntil } from 'rxjs';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormArray,
  FormGroup,
} from '@angular/forms';
import { ManageUsersService } from '../../manage-users/manage-users.service';
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
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { ContractEmployee } from '../manage-contract-user.interface';
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
    NzSpinModule,
    NzTagModule,
    NzSwitchModule,
  ],
  templateUrl: './add-edit-contract-user.component.html',
  styleUrl: './add-edit-contract-user.component.scss',
})
export class AddEditContractUserComponent
  extends FormComponent
  implements OnInit, OnDestroy {
  mode = Mode;
  override originalData = {} as ContractUsersListRecord;
  displayMode: Mode;
  loading = false;
  loadingSync = false;
  loading$: Observable<boolean>;
  isVisibleConfirmationModal = false;
  destroy$ = new Subject<void>();
  departmentList: Department[] = [];
  roleList: Role[] = [];
  allowedDepartments: number[] = [];
  defaultSelectedDepartments: number[] = [];
  isEditMode = false;

  contractUserData!: ContractUsersListRecord;


  loggedInUserId = Number(localStorage.getItem('userId')) || 0;



  // contractUserForm!: FormGroup;
  contractUserForm!: FormGroup;

  constructor(
    private modalRef: NzModalRef,
    private fb: FormBuilder,
    // private userSrv: ManageUsersService,
    private notification: NotificationService,
    private loaderService: LoaderService,
    private accessSrv: AccessControlService,
    private departmentSrv: DepartmentService,
    private userSrv: ManageContractUsersService,




    @Inject(NZ_MODAL_DATA)
    public params: { type: Mode; data: ContractUsersListRecord }
  ) {
    super();
    this.loading$ = this.loaderService.loading$;
    this.initForm();
    this.getMasterData();
    this.displayMode = params.type;

    // const params = this.modalRef.getConfig().nzData;
    this.displayMode = params?.type ?? Mode.ADD;
    this.contractUserData = params?.data ?? ({} as ContractUsersListRecord);
    // if (!!params.data) {
    //   this.patchFormData(params.data); 
    //   // this.getUserById(params.data.employeeCode);

    //   console.log("Data Data Para", params.data.employeeCode);
    //   console.log("Data Data Para", params.data);
    //   // console.log("Data Para Data", params.data.id);
    //   this.control('employeeCode').disable();
    //   this.displayMode === Mode.VIEW ? this.form.disable() : this.formFieldControl();
    // }

    if (!!params.data) {
      if (this.displayMode === Mode.EDIT || this.displayMode === Mode.VIEW) {
        this.getUserById(params.data.employeeCode);
        this.formFieldControl();
      } else {
        this.patchFormData(params.data);
        this.formFieldControl();
      }
    }

    if (this.displayMode === Mode.VIEW) {
      this.form.disable();
    } else {
      this.formFieldControl();
    }

  }

  originalFormValue: any;
  private patchFormData(data: ContractUsersListRecord): void {
    this.form.patchValue({
      employeeCode: data.employeeCode?.toString() || '',
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      userRole: data.userRole || '',
      employeePassword: data.employeePassword || '',
      employeeStartDate: data.employeeStartDate,
      employeeEndDate: data.employeeEndDate,
      // isTempPassword: data.isTempPassword,
      isActive: data.isActive,
      departmentIds: data.departments?.map(d => d.departmentId) || [],
    });
    this.originalFormValue = this.form.getRawValue();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.updateValueAndValidity();
  }

  override isFormChanged(): boolean {
    return JSON.stringify(this.form.getRawValue()) !== JSON.stringify(this.originalData);
  }

  ngOnInit(): void {

    // this.mode = this.modalData?.type ?? Mode.ADD;
    // this.contractUserData = this.modalData?.data ?? {} as ContractUsersListRecord;

    this.loading$ = this.loaderService.loading$;
    this.initForm();

    // ✅ If mode is EDIT, call API and patch form
    if (this.displayMode === Mode.EDIT && this.contractUserData?.employeeCode) {
      this.getUserById(this.contractUserData.employeeCode);
    }

    if (this.displayMode === Mode.VIEW) {
      this.form.disable();
    }

    this.getMasterData();

    // ✅ Properly assign modal data
    // this.mode = this.modalData?.type ?? Mode.ADD;
    // this.contractUserData = this.modalData?.data ?? {} as ContractUsersListRecord;





    this.control('employeeCode').valueChanges.subscribe(res => {
      if (!!res) {
        this.form.patchValue({
          email: '',
          firstName: '',
          lastName: '',
          managerEmail: '',
          managerName: '',
        });
      }
    });

    this.control('email').valueChanges.subscribe(email => {
      if (email) {
        this.handleEmailChange(email);
      }
    });

    this.form.valueChanges.subscribe(() => {
      this.isFormValueChange = this.isFormChanged();

      console.log('Form changed:', this.isFormValueChange);
      console.log('Current:', this.form.getRawValue());
      console.log('Original:', this.originalFormValue);
    });
  }


  async getMasterData() {
    await Promise.all([
      this.accessSrv.getRolesForDropDown().toPromise(),
      this.departmentSrv.getDepartmentsForDropDown().toPromise(),
    ]).then(
      ([roleList, departmentList]: [
        ApiResponse<paginatedResult<Role>> | undefined,
        ApiResponse<paginatedResult<Department>> | undefined
      ]) => {
        this.roleList = roleList ? roleList.result.data : [];
        this.departmentList = departmentList ? departmentList.result.data : [];
      }
    );
  }

  initForm() {
    // this.form = this.fb.group({
    //   employeeCode: [null, [Validators.required]],     // number input
    //   firstName: [null, [Validators.required]],        // name field
    //   lastName: [null],
    //   userRole: [null, [Validators.required]],
    //   departmentIds: this.fb.array([], Validators.required),
    //   employeePassword: [null, Validators.required],
    //   employeeStartDate: [null],
    //   employeeEndDate: [null],
    //   isTempPassword: [false]
    // });
    // this.form = this.fb.group({
    //   employeeCode: [null, [Validators.required]], // should be number if required
    //   firstName: [null, [Validators.required]],
    //   lastName: [null, [Validators.required]],
    //   userRole: [null, [Validators.required]],
    //   departmentIds: [[], [Validators.required]], // should match <nz-select [formControlName]>
    //   employeePassword: [null],
    //   employeeStartDate: [null],
    //   employeeEndDate: [null],
    // });
    this.form = this.fb.group({

      employeeCode: [null],
      firstName: [''],
      lastName: [''],
      // userRole: [''],
      // departmentIds: [[]], // This must be number[] to match mapping logic
      userRole: [null],
      departmentIds: [[]],
      employeeStartDate: [null],
      employeeEndDate: [null],
      employeePassword: [null],
      isTempPassword: [true],
      employeeID: [null],

      
      isContractorEmployee: [1], // Always 1 for contract employees
    });


  }



  syncUserData(): void {
    const empCode = this.form.get('employeeCode')?.value;
    const name = this.form.get('firstName')?.value;

    const payload = {
      EmpCode: empCode ? empCode.trim() : null,
      Name: name ? name.trim() : null
    };

    this.userSrv.syncContractEmployee(payload).subscribe({
      next: (response: any[]) => {
        console.log("Response", response);

        const resultArray = response; // response itself is the array
        console.log('Response Data', resultArray);

        if (!Array.isArray(resultArray) || resultArray.length === 0) {
          alert('No matching employee found');
          return;
        }

        const result = resultArray[0]; // first matched employee
        console.log("Result Data:", result);
        this.form.patchValue({
          // firstName: result.FirstName || '',
          // lastName: result.LastName || ''
          employeeID: result.EmployeeID,
          employeeCode: result.EmployeeCode,
          firstName: result.FirstName,
          lastName: result.LastName,
          userRole: result.userRole?.id ?? null, // ✅ set only roleId
          departmentIds: (result.departmentIds || []).map((d: any) => d.departmentId),
          employeeStartDate: result.EmployeeStartDate ? new Date(result.EmployeeStartDate) : null,
          employeeEndDate: result.EmployeeEndDate ? new Date(result.EmployeeEndDate) : null
        });

        console.log("Sync Data:", this.form.value);

        alert('Contract employee data synced');
      },
      error: () => alert('Failed to sync employee data')
    });
  }


  onSave(): void {
    // if (this.form.invalid) {
    //   alert('Please fill all required fields.');
    //   this.form.markAllAsTouched();
    //   return;
    // }

    // const formValue = this.form.value;
    const formValue = this.form.getRawValue();
    console.log('Form value on save:', formValue);
console.log('Employee ID on save:', formValue.employeeId);

    const payload = {

      employeeCode: formValue.employeeCode,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      // UserRole: formValue.userRole,
      userRole: this.roleList.find(role => role.id === formValue.userRole)?.name || '',
      EmployeePassword: formValue.employeePassword || 'KBL@123',
      IsTempPassword: formValue.isTempPassword ?? true,
      EmployeeStartDate: formValue.employeeStartDate
        ? new Date(formValue.employeeStartDate).toISOString()
        : new Date().toISOString(),
      EmployeeEndDate: formValue.employeeEndDate
        ? new Date(formValue.employeeEndDate).toISOString()
        : new Date().toISOString(),
      // departmentIds: formValue.departmentIds.map((id: number) => ({ departmentId: id })),
            departmentIds: formValue.departmentIds.map((id: number) => {
  const dept = this.departmentList.find(d => d.id === id);
  return {
    departmentId: id,
    departmentName: dept ? dept.name : ''
  };
}),
      // employeeId: formValue.employeeCode
      employeeId: this.displayMode === Mode.EDIT ? formValue.employeeCode : formValue.employeeID,
      isContractEmployee: true,
      CreatedBy: this.loggedInUserId
    };


    // this.userSrv.addContractEmployee(payload).subscribe({
    //   next: () => {
    //     alert('Contract employee saved successfully.');
    //     // this.router.navigate(['/manage-contract-user']);
    //   },
    //   error: () => alert('Error saving contract employee.')
    // });

    if (this.displayMode === Mode.EDIT) {
      this.userSrv.updateContractEmployee(payload).subscribe({
        next: () => {
          this.handleSuccess();
        },
        error: (err) => {
          this.handleError(err);
        }
      });
    } else {
      this.userSrv.addContractEmployee(payload).subscribe({
        next: () => {
          this.handleSuccess();
        },
        error: (err) => {
          this.handleError(err);
        }
      });
    }

  }




  mapDepartments(selectedIds: number[]): { departmentId: number; departmentName: string }[] {
    return this.departmentList
      .filter((dept) => selectedIds.includes(dept.id))
      .map((dept) => ({
        departmentId: dept.id,
        departmentName: dept.name
      }));
  }

  onReset(): void {
    this.form.reset();
    // this.setInitialFormValues(); // Optional: Refill values if editing
  }



  getUserById(employeeCode: number) {
    this.loaderService.show();

    console.log("Employee Code in Edit:", employeeCode)

    const payload = {
      employeeId: employeeCode.toString(),
      Name: null
    };

    this.userSrv
      .getUserById(payload)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loaderService.hide())
      )
      .subscribe({
        next: (response) => {
          const emp = response.result;
          console.log("Record:", emp)

          const mappedData: ContractUsersListRecord = {
            // id: 0,
            employeeId: Number(emp.employeeId),
            employeeCode: Number(emp.employeeCode),
            firstName: emp.firstName,
            lastName: emp.lastName,
            userRole: emp.userRole,
            departmentIds: emp.departments?.map(dep => String(dep.departmentId)) || [],
            departments: emp.departments || [],
            employeePassword: emp.employeePassword,
            employeeStartDate: emp.employeeStartDate,
            employeeEndDate: emp.employeeEndDate,
            isActive: true,
            isContractEmployee: true,
          };

          this.originalData = mappedData;

          // Patch form only if in Edit mode
          // if (this.displayMode === Mode.EDIT) {
          //   this.form.patchValue(mappedData);
          // }

          if (this.displayMode === Mode.EDIT || this.displayMode === Mode.VIEW) {
            this.form.patchValue({
              employeeCode: Number(emp.employeeCode),
              firstName: emp.firstName || '',
              lastName: emp.lastName || '',
              userRole: emp.userRole,
              departmentIds: emp.departments?.map(dep => dep.departmentId) || [],
              employeePassword: emp.employeePassword || '',
              employeeStartDate: emp.employeeStartDate ? new Date(emp.employeeStartDate) : null,
              employeeEndDate: emp.employeeEndDate ? new Date(emp.employeeEndDate) : null
            });
            this.form.get('employeeID')?.setValue(emp.employeeId || null);
            console.log("Edit Mode:", this.form.value)
            // ✅ Set originalFormValue after patching
            this.originalFormValue = this.form.getRawValue();

            this.form.markAsPristine();
            this.form.markAsUntouched();
            this.form.updateValueAndValidity();
            this.formFieldControl();

            this.form.valueChanges
              .pipe(takeUntil(this.destroy$))
              .subscribe(() => {
                this.isFormValueChange = this.isFormChanged();
              });
          }


          console.log('Form after patchValue:', this.form.value);

          // this.toast.success('User synced successfully');
        },
        error: (error) => {
          console.error('Failed to sync user:', error);
          // this.toast.error('Failed to sync user');
        }
      });
  }






  formFieldControl() {
    const enableFields = ['userRole', 'departmentIds', 'isTempPassword', 'employeeStartDate', 'employeeEndDate'];
    Object.entries(this.form.controls).forEach(([key, control]) => {
      if (key !== 'employeeCode') {
        enableFields.includes(key) ? control.enable() : control.disable();
      }

    });
    //    Object.entries(this.form.controls).forEach(([key, control]) => {
    //   // Enable employeeCode ONLY in Add mode
    //   if (key === 'employeeCode') {
    //     this.displayMode === Mode.ADD ? control.enable() : control.disable();
    //   } else {
    //     enableFields.includes(key) ? control.enable() : control.disable();
    //   }
    // });
    // Object.entries(this.form.controls).forEach(([key, control]) => {
    //   if (this.displayMode === Mode.ADD) {
    //     // ADD mode: enable employeeCode + specific fields
    //     if (key === 'employeeCode' || enableFields.includes(key)) {
    //       control.enable();
    //     } else {
    //       control.disable();
    //     }

    //   } else if (this.displayMode === Mode.EDIT) {
    //     // EDIT mode: enable only specific fields (NOT employeeCode)
    //     if (enableFields.includes(key)) {
    //       control.enable();
    //     } else {
    //       control.disable();
    //     }

    //   } else {
    //     // VIEW mode: disable everything
    //     control.disable();
    //   }
    // });

    // Object.entries(this.form.controls).forEach(([key, control]) => {
    //   // First & Last name are always readonly → always disable
    //   if (key === 'firstName' || key === 'lastName') {
    //     control.disable();
    //     return;
    //   }

    //   if (this.displayMode === Mode.ADD) {
    //     // ADD mode: enable employeeCode + enableFields
    //     if (key === 'employeeCode' || enableFields.includes(key)) {
    //       control.enable();
    //     } else {
    //       control.disable();
    //     }

    //   } else if (this.displayMode === Mode.EDIT) {
    //     // EDIT mode: enable only enableFields
    //     if (enableFields.includes(key)) {
    //       control.enable();
    //     } else {
    //       control.disable();
    //     }

    //   } else {
    //     // VIEW mode: disable everything
    //     control.disable();
    //   }
    // });

  }

  changeMode() {
    this.displayMode = this.mode.EDIT;
    this.modalRef.updateConfig({ nzTitle: 'Edit Contract User' });
    this.formFieldControl();
  }

  handleCancel(): void {
    this.modalRef.close();
  }

  isDepartmentDisabled(dept: Department): boolean {
    return !this.allowedDepartments.includes(dept.id);
  }

  handleEmailChange(email: string): void {
    const lower = email?.toLowerCase();
    if (lower.includes('kbl')) {
      this.setDepartmentSelection([1, 2], [1, 2]);
    } else if (lower.includes('kepl')) {
      this.setDepartmentSelection([3], [3]);
    } else {
      this.setDepartmentSelection([], []);
    }
  }

  private setDepartmentSelection(allowed: number[], preselect: number[]) {
    this.allowedDepartments = allowed;
    this.defaultSelectedDepartments = preselect;
    if (preselect.length) {
      this.form.get('departmentIds')?.setValue(preselect);
    } else {
      this.form.get('departmentIds')?.reset();
    }
  }



  handleSuccess() {
    this.notification.notify(
      'success',
      this.displayMode === this.mode.EDIT
        ? 'Contract User Updated Successfully'
        : 'Contract User Created Successfully'
    );
    this.modalRef.close();
  }

  handleError(error: ErrorResponse) {
    this.notification.notify('error', error.message);
  }

  resetForm() {
    if (this.displayMode === this.mode.EDIT) {
      this.form.patchValue(this.originalData);
    } else {
      this.form.reset();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get departmentIds(): FormArray {
    return this.form.get('departmentIds') as FormArray;
  }

  get isTempPasswordControl(): FormControl {
    return this.form.get('isTempPassword') as FormControl;
  }


}
