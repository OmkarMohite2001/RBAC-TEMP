import { Component } from '@angular/core';
import { TableComponent } from '../../shared/components/table/table.component';
import { Mode } from '../../core/enums/mode.enum';
import { Subject } from 'rxjs';
import { filterType } from '../../core/enums/filter-type.enum';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTableModule } from 'ng-zorro-antd/table';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { CommonModule } from '@angular/common';
import { TableFooterComponent } from '../../shared/components/table/table-footer/table-footer.component';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-access-logs',
  imports: [
    NzButtonComponent,
    NzDatePickerModule,
    NzTableModule,
    AngularSvgIconModule,
    NzPageHeaderModule,
    CommonModule,
    NzDatePickerModule,
    TableFooterComponent,
    NzTagModule,
    NzSelectModule,
    NzFlexModule,
    NzInputModule,
  ],
  templateUrl: './access-logs.component.html',
  styleUrl: './access-logs.component.scss',
})
export class AccessLogsComponent extends TableComponent {
  // Table Column Header ==========
  mode = Mode;
  destroy$ = new Subject<void>();
  listOfColumns = [
    {
      name: 'Employee Id',
      key: 'employeeId',
      width: '158px',
      sortFn: true,
      filter: {
        type: filterType.TEXT,
      },
    },
    {
      name: 'Name',
      key: 'name',
      width: '158px',
      sortFn: true,
      filter: {
        type: filterType.TEXT,
      },
    },
    {
      name: 'User Role',
      key: 'userRole',
      width: '158px',
      sortFn: true,
      filter: {
        type: filterType.DROPDOWN,
      },
    },
    {
      name: 'Application',
      key: 'application ',
      width: '158px',
      sortFn: true,
      filter: {
        type: filterType.TEXT,
      },
    },
    {
      name: 'Module',
      key: 'module ',
      width: '158px',
      sortFn: true,
      filter: {
        type: filterType.TEXT,
      },
    },
    {
      name: 'Updated On',
      key: 'updateOn',
      width: '120px',
      sortFn: true,
      filter: {
        type: filterType.DATE,
      },
    },
    {
      name: 'Action Perfomed',
      key: 'actionPerfomed',
      width: '158px',
      sortFn: true,
      filter: {
        type: filterType.DROPDOWN,
      },
    },
  ];

  // Table Data ==========
  listOfData = [
    {
      employeeId: '001',
      name: 'Warren',
      userRole: 'Super Admin',
      application: 'Pump Testing Software',
      module: 'Motor',
      updatedOn: new Date(),
    },
    {
      employeeId: '001',
      name: 'Warren',
      userRole: 'Super Admin',
      application: 'Pump Testing Software',
      module: 'Motor',
      updatedOn: new Date(),
    },
    {
      employeeId: '001',
      name: 'Warren',
      userRole: 'Super Admin',
      application: 'Pump Testing Software',
      module: 'Motor',
      updatedOn: new Date(),
    },
    {
      employeeId: '001',
      name: 'Warren',
      userRole: 'Super Admin',
      application: 'Pump Testing Software',
      module: 'Motor',
      updatedOn: new Date(),
    },
    {
      employeeId: '001',
      name: 'Warren',
      userRole: 'Super Admin',
      application: 'Pump Testing Software',
      module: 'Motor',
      updatedOn: new Date(),
    },
  ];

  // Modal
  isVisible1 = false;

  showModal1(): void {
    this.isVisible1 = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible1 = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible1 = false;
  }
  submitForm(): void {
    console.log('submited');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
