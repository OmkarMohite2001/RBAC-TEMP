import { Component, inject } from '@angular/core';
import { TableComponent } from '../../../shared/components/table/table.component';
import { filterType } from '../../../core/enums/filter-type.enum';
import { finalize, Subject, takeUntil } from 'rxjs';
import { Mode } from '../../../core/enums/mode.enum';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { TableFooterComponent } from '../../../shared/components/table/table-footer/table-footer.component';
import { CommonModule } from '@angular/common';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableComponent, NzTableModule } from 'ng-zorro-antd/table';
import {
  NzPageHeaderComponent,
  NzPageHeaderModule,
} from 'ng-zorro-antd/page-header';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Router } from '@angular/router';
import { AccessControlService } from '../access-control.service';
import { paginateRole, RoleRecord } from '../access-control.interface';
import _ from 'lodash';
import { RoleAddComponent } from '../role-add/role-add.component';
import { UtcToLocalPipe } from '../../../core/pipes/utc-to-local.pipe';
import { AssignRoleComponent } from '../assign-role/assign-role.component';

@Component({
  selector: 'app-access-control',
  imports: [
    NzFormModule,
    NzModalModule,
    AngularSvgIconModule,
    NzGridModule,
    NzTableModule,
    CommonModule,
    NzSelectModule,
    NzTableComponent,
    NzPageHeaderModule,
    NzTagModule,
    NzFlexModule,
    NzDatePickerModule,
    NzRadioModule,
    ReactiveFormsModule,
    TableFooterComponent,
    NzInputModule,
    NzButtonModule,
    UtcToLocalPipe,
  ],
  templateUrl: './access-control.component.html',
  styleUrl: './access-control.component.scss',
})
export class AccessControlComponent extends TableComponent {
  // Table Column Header ==========
  mode = Mode;
  loading: boolean = false;
  private readonly accessControlSrv = inject(AccessControlService);
  role$ = this.accessControlSrv.role$;
  destroy$ = new Subject<void>();
  listOfColumns = [
    {
      name: 'Role Name',
      key: 'name',
      width: '158px',
      sortFn: true,
      filter: {
        type: filterType.TEXT,
      },
    },
    {
      name: 'Description',
      key: 'description',
      width: '300px',
      sortFn: true,
      filter: {
        type: filterType.TEXT,
      },
    },
    {
      name: 'Status',
      key: 'isActive',
      width: '134px',
      sortFn: true,
      filter: {
        type: filterType.DROPDOWN,
      },
    },
    {
      name: 'Updated By',
      key: 'updatedBy ',
      width: '158px',
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

  constructor(
    private router: Router,
    private modalService: NzModalService
  ) {
    super();
    this.createFilters(this.listOfColumns);
    this.accessControlSrv.role$.subscribe((res: paginateRole | null) => {
      this.totalRecord = res?.result?.totalRows ?? 0;
    });
  }

  override getData() {
    this.loading = true;
    this.accessControlSrv
      .getRoles(this.pageOptions)
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

  ngOnInit() {
    this.form?.valueChanges.subscribe(
      _.debounce(async res => {
        await this.changeFilter(res);
      }, 1000)
    );
  }

  navigateToAccessControl(data: RoleRecord, mode: Mode): void {
    this.router.navigate([`/access-control/${mode}`], {
      queryParams: { id: data?.id },
    });
  }

  openModel() {
    this.modalService.create({
      nzTitle: 'Add New User Role',
      nzContent: AssignRoleComponent,
      nzWidth: '360px',
      nzCentered: true,
      nzClosable: false,
      nzFooter: null,
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
