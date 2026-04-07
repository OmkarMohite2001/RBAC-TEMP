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
} from './manage-users.interface';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';
import { ManageUsersService } from './manage-users.service';
import _ from 'lodash';
import { Role } from '../access-control/access-control.interface';
import { AccessControlService } from '../access-control/access-control.service';
import { Department } from '../department/department.interface';
import {
  ApiResponse,
  paginatedResult,
} from '../../core/models/api-request-response.interface';
import { DepartmentService } from '../department/department.service';
import { UtcToLocalPipe } from '../../core/pipes/utc-to-local.pipe';

@Component({
  selector: 'app-manage-users',
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
    UtcToLocalPipe,
  ],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss',
})
export class ManageUsersComponent extends TableComponent implements OnDestroy {
  // Table Column Header ==========
  private readonly userSrv = inject(ManageUsersService);
  loading: boolean = false;
  users$ = this.userSrv.user$;
  mode = Mode;
  userFilterOptions = [];
  destroy$ = new Subject<void>();
  roleList: Role[] = [];
  departmentList: Department[] = [];
  listOfColumns: ColumnItem[] = [
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
      name: 'Email',
      key: 'email',
      width: '160px',
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
      name: 'Updated By',
      key: 'updatedBy',
      width: '120px',
      sortFn: true,
      filter: {
        type: filterType.TEXT,
      },
    },
    {
      name: 'Updated On',
      key: 'updatedOn',
      width: '120px',
      sortFn: true,
      filter: {
        type: filterType.DATE,
      },
    },
  ];

  // Table Data ==========
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
    private departmentSrv: DepartmentService
  ) {
    super();
    this.createFilters(this.listOfColumns);
    this.userSrv.user$.subscribe((res: paginatedUsers | null) => {
      this.totalRecord = res?.result?.totalRows ?? 0;
    });
  }

  ngOnInit() {
    this.getMasterData();
    this.form?.valueChanges.subscribe(
      _.debounce(async res => {
        await this.changeFilter(res);
      }, 1000)
    );
  }

  override getData() {
    this.loading = true;
    // get table data call here
    this.userSrv
      .getUsers(this.pageOptions)
      .pipe(
        finalize(() => (this.loading = false)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        error: (error: Error) => {
          console.log(error);
        },
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

  openModel(mode: Mode, data?: UsersListRecord) {
    this.modalService.create({
      nzTitle:
        mode === Mode.ADD
          ? 'Add User'
          : mode === Mode.EDIT
            ? 'Edit User'
            : 'User Detail',
      nzContent: AddEditUserComponent, // Component to display
      nzData: {
        type: mode, // Pass data to the component
        data: data,
      },
      nzWidth: '1000px',
      nzCentered: true,
      nzClosable: false,
      nzFooter: null, // No footer, or you can customize it
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
