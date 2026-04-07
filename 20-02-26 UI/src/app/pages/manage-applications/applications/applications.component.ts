import { Component, inject } from '@angular/core';
import { TableComponent } from '../../../shared/components/table/table.component';
import { Mode } from '../../../core/enums/mode.enum';
import { finalize, Subject, takeUntil } from 'rxjs';
import { ColumnItem } from '../../../core/models/common.interface';
import { filterType } from '../../../core/enums/filter-type.enum';
import {
  NzModalComponent,
  NzModalModule,
  NzModalService,
} from 'ng-zorro-antd/modal';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzSelectComponent, NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { ReactiveFormsModule } from '@angular/forms';
import { TableFooterComponent } from '../../../shared/components/table/table-footer/table-footer.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ManageApplicationService } from '../manage-applications.service';
import _ from 'lodash';
import {
  Application,
  ApplicationListRecord,
  paginatedApplication,
} from '../manage-applications.interface';
import { AddApplicationComponent } from '../add-application/add-application.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-applications',
  imports: [
    NzModalModule,
    NzInputModule,
    NzButtonModule,
    NzGridModule,
    CommonModule,
    NzTableModule,
    NzFlexModule,
    AngularSvgIconModule,
    NzSelectModule,
    NzDatePickerModule,
    ReactiveFormsModule,
    TableFooterComponent,
    NzPageHeaderModule,
    NzFormModule,
    NzSwitchModule,
    NzTagModule,
    NzRadioModule,
  ],
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.scss',
})
export class ApplicationsComponent extends TableComponent {
  // Table Column Header ==========
  mode = Mode;
  loading: boolean = false;
  private readonly applicationSrv = inject(ManageApplicationService);
  application$ = this.applicationSrv.application$;
  isVisible1 = false;
  destroy$ = new Subject<void>();
  listOfColumns: ColumnItem[] = [
    {
      name: 'Application Name',
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
      name: 'Module',
      key: 'moduleCount',
      width: '158px',
      sortFn: true,
      filter: {
        type: filterType.TEXT,
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
  ];

  constructor(
    private modalService: NzModalService,
    private router: Router
  ) {
    super();
    this.createFilters(this.listOfColumns);
    this.applicationSrv.application$.subscribe(
      (res: paginatedApplication | null) => {
        this.totalRecord = res?.result?.totalRows ?? 0;
      }
    );
  }

  ngOnInit() {
    this.form?.valueChanges.subscribe(
      _.debounce(async res => {
        await this.changeFilter(res);
      }, 1000)
    );
  }

  override getData() {
    this.loading = true;
    this.applicationSrv
      .getApplications(this.pageOptions)
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

  openModel(mode: Mode, data?: Application) {
    this.modalService.create({
      nzTitle:
        mode === Mode.ADD
          ? 'Add Application'
          : mode === Mode.EDIT
            ? 'Edit Application'
            : 'Application Detail',
      nzContent: AddApplicationComponent, // Component to display
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

  redirectToManageModule(data: ApplicationListRecord) {
    this.router.navigate(['/applications/manage-module'], {
      queryParams: { id: data?.id },
    });
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
