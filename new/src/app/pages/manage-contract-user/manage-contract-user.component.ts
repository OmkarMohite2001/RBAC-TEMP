import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { finalize, Subject, takeUntil } from 'rxjs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import _ from 'lodash';
import { Mode } from '../../core/enums/mode.enum';
import { filterType } from '../../core/enums/filter-type.enum';
import {
  ApiResponse,
  paginatedResult,
} from '../../core/models/api-request-response.interface';
import { ColumnItem } from '../../core/models/common.interface';
import { TableFooterComponent } from '../../shared/components/table/table-footer/table-footer.component';
import { TableComponent } from '../../shared/components/table/table.component';
import { AccessControlService } from '../access-control/access-control.service';
import { Role } from '../access-control/access-control.interface';
import { DepartmentService } from '../department/department.service';
import { Department } from '../department/department.interface';
import { AddEditContractUserComponent } from './add-edit-contract-user/add-edit-contract-user.component';
import { ContractUsersListRecord } from './manage-contract-user.interface';
import { ManageContractUsersService } from './manage-contract-users.service';

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
  ],
  templateUrl: './manage-contract-user.component.html',
  styleUrl: './manage-contract-user.component.scss',
})
export class ManageContractUserComponent
  extends TableComponent
  implements OnDestroy
{
  private readonly userSrv = inject(ManageContractUsersService);
  loading = false;
  mode = Mode;
  destroy$ = new Subject<void>();
  roleList: Role[] = [];
  departmentList: Department[] = [];
  contractUserList: ContractUsersListRecord[] = [];

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
      key: 'contractEmpId',
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
      key: 'employeeStartDate',
      width: '120px',
      sortFn: true,
      filter: {
        type: filterType.DATE,
      },
    },
    {
      name: 'End Date',
      key: 'employeeEndDate',
      width: '120px',
      sortFn: true,
      filter: {
        type: filterType.DATE,
      },
    },
  ];

  constructor(
    private modalService: NzModalService,
    private accessService: AccessControlService,
    private departmentSrv: DepartmentService
  ) {
    super();
    this.createFilters(this.listOfColumns);
  }

  ngOnInit() {
    this.getMasterData();
    this.getData();
    this.form?.valueChanges.subscribe(
      _.debounce(async res => {
        await this.changeFilter(res);
      }, 1000)
    );
  }

  override getData() {
    this.loading = true;
    this.userSrv
      .getAllEmployees(this.pageOptions as unknown as Record<string, unknown>)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.loading = false))
      )
      .subscribe({
        next: res => {
          const mappedEmployees: ContractUsersListRecord[] = res.result
            .filter(employee => employee.isActive)
            .map(employee => ({
              employeeId: employee.employeeId,
              contractEmpId: employee.contractEmpId,
              employeeCode: employee.employeeCode,
              firstName: employee.firstName,
              lastName: employee.lastName,
              userRole: employee.userRole,
              employeePassword: employee.employeePassword ?? null,
              employeeStartDate: employee.employeeStartDate,
              employeeEndDate: employee.employeeEndDate,
              isActive: employee.isActive,
              isContractEmployee: employee.isContractEmployee,
              departments: employee.departments,
              empCode: employee.employeeCode?.toString(),
              name: `${employee.firstName ?? ''} ${employee.lastName ?? ''}`.trim(),
              departmentIds:
                employee.departments?.map(department =>
                  department.departmentId.toString()
                ) ?? [],
              departmentName:
                employee.departments
                  ?.map(department => department.departmentName)
                  .join(', ') ?? '',
            }));

          this.contractUserList = mappedEmployees;
          this.totalRecord = mappedEmployees.length;
        },
        error: err => {
          console.error('Error fetching contract users:', err);
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

  openModel(mode: Mode, data?: ContractUsersListRecord) {
    const mappedData = data
      ? {
          ...data,
          employeeCode: Number(data.employeeCode),
        }
      : undefined;

    const modal = this.modalService.create({
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

    modal.afterClose.subscribe(result => {
      if (result === 'save') {
        this.getData();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
