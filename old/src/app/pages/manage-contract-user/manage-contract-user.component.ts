import { Component, inject, OnDestroy } from '@angular/core';
import { TableFooterComponent } from '../../shared/components/table/table-footer/table-footer.component';
import { TableComponent } from '../../shared/components/table/table.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { finalize, Subject, takeUntil } from 'rxjs';
import { Mode } from '../../core/enums/mode.enum';
import { ColumnItem } from '../../core/models/common.interface';
import { filterType } from '../../core/enums/filter-type.enum';
import {
  paginatedUsers,
  role,
  User,
  UsersListRecord,
} from '../manage-users/manage-users.interface';
import { AddEditUserComponent } from '../manage-users/add-edit-user/add-edit-user.component';
import { AddEditContractUserComponent } from './add-edit-contract-user/add-edit-contract-user.component';
// import { ManageUsersService } from '../manage-users/manage-users.service';
import { ManageContractUsersService } from './manage-contract-users.service';
import _ from 'lodash';
import { Role } from '../access-control/access-control.interface';
import { AccessControlService } from '../access-control/access-control.service';
import { Department } from '../department/department.interface';
import { Employee } from '../../core/models/api-request-response.interface';
// import { ContractUser } from '../../core/models/api-request-response.interface';
import { ContractUser, ContractUsersListRecord } from './manage-contract-user.interface';
import {
  ApiResponse,
  paginatedResult,
} from '../../core/models/api-request-response.interface';
import { DepartmentService } from '../department/department.service';
import { UtcToLocalPipe } from '../../core/pipes/utc-to-local.pipe';
// import { paginatedContractUsers } from '../../core/models/api-request-response.interface';
import { paginatedContractUsers } from './manage-contract-user.interface';
// import { ToastComponent } from '../../shared/components/toast/toast.component';

@Component({
  selector: 'app-manage-contract-user',
  imports: [
    CommonModule,
    NzGridModule,
    NzFlexModule,
    NzTableModule,
    NzSelectModule,
    NzModalModule,
    NzInputModule,
    NzFormModule,
    NzDatePickerModule,
    NzButtonModule,
    AngularSvgIconModule,
    FormsModule,
    ReactiveFormsModule,
    NzPageHeaderModule,
    TableFooterComponent,
    NzSwitchModule,
    NzTagModule,
    NzRadioModule,
    // UtcToLocalPipe,
  ],
  templateUrl: './manage-contract-user.component.html',
  styleUrl: './manage-contract-user.component.scss',
})
export class ManageContractUserComponent extends TableComponent implements OnDestroy {
  private readonly userSrv = inject(ManageContractUsersService);
  loading: boolean = false;
  contractUsers$ = this.userSrv.contractUser$;
  mode = Mode;
  userFilterOptions = [];
  destroy$ = new Subject<void>();
  roleList: Role[] = [];
  departmentList: Department[] = [];

  contractEmployees: Employee[] = [];
  employeeList: ContractUser[] = []
  contractUserList: ContractUser[] = [];
  displayedUsers: ContractUser[] = [];


  listOfColumns: ColumnItem[] = [
    {
      name: 'Employee Code',
      key: 'employeeCode',
      width: '160px',
      sortFn: true,
      filter: {
        type: filterType.TEXT,
      },
    },
      {
      name: 'Contract Employee ID',
      key: 'employeeCode',
      width: '160px',
      sortFn: true,
      filter: {
        type: filterType.TEXT,
      },
    },
    {
      name: 'First Name',
      key: 'firstName',
      width: '123px',
      sortFn: true,
      filter: {
        type: filterType.TEXT,
      },
    },
    {
      name: 'Last Name',
      key: 'lastName',
      width: '140px',
      sortFn: true,
      filter: {
        type: filterType.TEXT,
      },
    },

    {
      name: 'User Role',
      key: 'roleId',
      width: '130px',
      sortFn: true,
      filter: {
        type: filterType.DROPDOWN,
      },
    },
    {
      name: 'Department',
      key: 'departmentId',
      width: '130px',
      sortFn: true,
      filter: {
        type: filterType.DROPDOWN,
      },
    },
    {
      name: 'Status',
      key: 'isActive',
      width: '130px',
      sortFn: true,
      filter: {
        type: filterType.DROPDOWN,
      },
    },
    {
      name: 'Start Date',
      key: 'updatedBy',
      width: '120px',
      sortFn: true,
      filter: {
        type: filterType.TEXT,
      },
    },
    {
      name: 'End Date',
      key: 'updatedOn',
      width: '120px',
      sortFn: true,
      filter: {
        type: filterType.DATE,
      },
    },
  ];

  
  listOfData: any[] = [
    {
      firstName: 'Judith',
      lastName: 'Warren',
      email: 'judithwarren@gmail.com',
      userRole: 'Super Admin',
      phoneNumber: '+918555173506',
      updatedBy: 'Wade Warren',
      updatedOn: new Date(),
    },
    {
      firstName: 'Judith',
      lastName: 'Warren',
      email: 'judithwarren@gmail.com',
      userRole: 'Super Admin',
      phoneNumber: '+918555173506',
      updatedBy: 'Wade Warren',
      updatedOn: new Date(),
    },
    {
      firstName: 'Judith',
      lastName: 'Warren',
      email: 'judithwarren@gmail.com',
      userRole: 'Super Admin',
      phoneNumber: '+918555173506',
      updatedBy: 'Wade Warren',
      updatedOn: new Date(),
    },
    {
      firstName: 'Judith',
      lastName: 'Warren',
      email: 'judithwarren@gmail.com',
      userRole: 'Super Admin',
      phoneNumber: '+918555173506',
      updatedBy: 'Wade Warren',
      updatedOn: new Date(),
    },
  ];

 

  constructor(
    private modalService: NzModalService,
    private accessService: AccessControlService,
    private departmentSrv: DepartmentService,
    private manageContractUserService: ManageContractUsersService,

    // private toastSrv: ToastComponent,
  ) {
    super();
    this.createFilters(this.listOfColumns);

    this.contractUsers$.subscribe((res: paginatedContractUsers | null) => {
      this.totalRecord = res?.result?.totalRows ?? 0;
    });
  }


  ngOnInit() {
    this.getMasterData();
    this.loadContractUsers();
    // this.loadEmployees();
    this.form?.valueChanges.subscribe(
      _.debounce(async res => {
        await this.changeFilter(res);
      }, 1000)
    );
  }



  loadContractUsers(): void {
    this.loading = true;

    this.manageContractUserService.getAllEmployees()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.loading = false))
      )
      .subscribe({
        next: (res) => {
          console.log('API response:', res);

          const mappedEmployees: ContractUsersListRecord[] = res.result
            .filter(e => e.isActive)
            .map(e => ({
              // Required by ContractUsersListRecord
              employeeId: e.employeeId,
              contractEmpId: e.contractEmpId,
              employeeCode: e.employeeCode,
              firstName: e.firstName,
              lastName: e.lastName,
              userRole: e.userRole,
              employeePassword: e.employeePassword,
              employeeStartDate: e.employeeStartDate,
              employeeEndDate: e.employeeEndDate,
              isActive: e.isActive,
              isContractEmployee: e.isContractEmployee,
              departments: e.departments,

              // Additional fields for view logic
              id: e.employeeId,
              empCode: e.employeeCode?.toString(),
              name: `${e.firstName ?? ''} ${e.lastName ?? ''}`.trim(),
              departmentIds: e.departments?.map(d => d.departmentId.toString()) ?? [],
              departmentName: e.departments?.map(d => d.departmentName).join(', ') ?? '',
            }));
          console.log("Get Employee Data:", res.result);
          this.contractUserList = mappedEmployees;
          this.displayedUsers = [...mappedEmployees];
          this.totalRecord = mappedEmployees.length;
        },
        error: (err) => {
          console.error('Error fetching contract users:', err);
          // this.toast.error('Failed to load contract users');
        }
      });
  }




  async getMasterData() {
    await Promise.all([
      this.accessService.getRolesForDropDown().toPromise(),
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

 
  openModel(mode: Mode, data?: ContractUsersListRecord) {
    const mappedData = data
      ? {
        ...data,
        employeeCode: String(data.employeeCode), // ensure it's a string
      }
      : undefined;

    this.modalService.create({
      nzTitle:
        mode === Mode.ADD
          ? 'Add Contract User'
          : mode === Mode.EDIT
            ? 'Edit Contract User'
            : 'Contract User Detail',
      nzContent: AddEditContractUserComponent,
      nzData: {
        type: mode,
        data: mappedData,
      },
      nzWidth: '1000px',
      nzCentered: true,
      nzClosable: false,
      nzFooter: null,
    });
  }






  getRoleNames(roles: Role[]) {
    if (roles.length > 0) {
      return roles.map(r => r.name);
    }
    return [];
  }

  getDepartmentNames(dept: Department[]) {
    if (dept.length > 0) {
      return dept.map(r => r.name);
    }
    return [];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
