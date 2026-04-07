import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ChecableTreeComponent } from '../../../shared/components/checable-tree/checable-tree.component';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import {
  ApplicationListRecord,
  ModuleRecord,
  TreeNode,
} from '../manage-applications.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ManageApplicationService } from '../manage-applications.service';
import { finalize, Observable, Subject, takeUntil } from 'rxjs';
import { ApiResponse } from '../../../core/models/api-request-response.interface';
import { AddModuleComponent } from '../add-module/add-module.component';
import { LoaderService } from '../../../core/services/loader.service';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { Mode } from '../../../core/enums/mode.enum';
import { CommonService } from '../../../core/services/common.service';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-manage-module',
  imports: [
    CommonModule,
    NzPageHeaderModule,
    NzBreadCrumbModule,
    AngularSvgIconModule,
    NzFormModule,
    NzGridModule,
    NzFlexModule,
    NzRadioModule,
    NzInputModule,
    NzDividerModule,
    NzButtonModule,
    ChecableTreeComponent,
    NzModalModule,
    NzSelectModule,
    NzSpinModule,
    NzAlertModule,
  ],
  templateUrl: './manage-module.component.html',
  styleUrl: './manage-module.component.scss',
})
export class ManageModuleComponent {
  applicationData = {} as ApplicationListRecord;
  destroy$ = new Subject<void>();
  loading$: Observable<boolean>;
  loadingSync: boolean = false;
  nodes: TreeNode[] = [];
  mode = Mode;
  // nodes: TreeNode[] = [
  //   {
  //     title: 'Dashboard',
  //     key: '100',
  //     expanded: true,
  //     children: [
  //       { title: 'Dashboard 1-1', key: '1001' },
  //       { title: 'Dashboard 1-2', key: '1002' },
  //     ],
  //   },
  //   {
  //     title: 'Motor',
  //     key: '101',
  //     children: [
  //       { title: 'View Motor', key: '1011' },
  //       { title: 'Add Motor', key: '1012' },
  //       { title: 'Edit Motor', key: '1013' },
  //       { title: 'Delete & Restore Motor', key: '1014' },
  //     ],
  //   },
  //   {
  //     title: 'Engine',
  //     key: '102',
  //     children: [
  //       { title: 'View Engine', key: '1011' },
  //       { title: 'Add Engine', key: '1012' },
  //       { title: 'Edit Engine', key: '1013' },
  //       { title: 'Delete & Restore Engine', key: '1014' },
  //     ],
  //   },
  //   {
  //     title: 'Gearbox',
  //     key: '103',
  //     children: [
  //       { title: 'View Motor', key: '1031' },
  //       { title: 'Add Motor', key: '1032' },
  //       { title: 'Edit Motor', key: '1033' },
  //       { title: 'Delete & Restore Motor', key: '1034' },
  //       {
  //         title: 'Efficiency Graph',
  //         key: '10310',
  //         children: [
  //           { title: 'Gearbox Input', key: '10311' },
  //           { title: 'Gearbox Efficiency', key: '10312' },
  //         ],
  //       },
  //     ],
  //   },
  //   {
  //     title: 'Manufacturer',
  //     key: '104',
  //     children: [
  //       { title: 'View Manufacturer', key: '1041' },
  //       { title: 'Add Manufacturer', key: '1042' },
  //       { title: 'Edit Manufacturer', key: '1043' },
  //       { title: 'Delete & Restore Manufacturer', key: '1044' },
  //     ],
  //   },
  //   {
  //     title: 'Pump',
  //     key: '105',
  //     children: [
  //       { title: 'View Pump', key: '1051' },
  //       { title: 'Add Pump', key: '1052' },
  //       { title: 'Edit Pump', key: '1053' },
  //       { title: 'Delete & Restore Pump', key: '1054' },
  //     ],
  //   },
  // ];

  constructor(
    private route: ActivatedRoute,
    private applicationService: ManageApplicationService,
    private modalService: NzModalService,
    private router: Router,
    private loaderService: LoaderService,
    private cd: ChangeDetectorRef,
    private commonService: CommonService,
    private notification: NotificationService
  ) {
    this.loading$ = this.loaderService.loading$;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.getApplicationbyId(params['id']);
    });
  }

  getApplicationbyId(id: number) {
    this.loaderService.show();
    this.applicationService
      .getApplicationById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ApiResponse<ApplicationListRecord>) => {
          this.applicationData = response.result || {};
          this.nodes = this.commonService.mapToTreeNode(
            this.applicationData?.modules || []
          );
          this.loaderService.hide();
        },
        error: (error: Error) => {
          console.log(error);
          this.loaderService.show();
        },
      });
  }

  syncModules() {
    this.loadingSync = true;
    this.applicationService
      .syncApplicationById(this.applicationData.id)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.loadingSync = false))
      )
      .subscribe({
        next: (response: any) => {
          if (!!response.result) {
            this.notification.notify('success', 'Module synced successfully');
            this.getApplicationbyId(this.applicationData.id);
          }
        },
        error: (error: Error) => {
          console.log(error);
          this.notification.notify('error', error.message);
        },
      });
  }

  openModel(mode: Mode, moduleId?: number) {
    const modal = this.modalService.create({
      nzTitle:
        mode === Mode.ADD
          ? 'Add Module'
          : mode === Mode.EDIT
            ? 'Edit Module'
            : 'Module Detail',
      nzContent: AddModuleComponent,
      nzData: {
        type: mode,
        moduleId: moduleId,
        applicationId: this.applicationData.id,
      },
      nzWidth: '1000px',
      nzCentered: true,
      nzClosable: false,
      nzFooter: null,
    });

    modal.afterClose.subscribe(result => {
      if (result === 'save') {
        this.getApplicationbyId(this.applicationData.id);
      }
    });
  }

  onUpdateModule(event: number) {
    this.openModel(Mode.EDIT, event);
    this.cd.detectChanges();
  }

  goToApplications() {
    this.router.navigate(['/applications']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
