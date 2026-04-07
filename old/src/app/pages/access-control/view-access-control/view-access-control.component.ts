import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { Mode } from '../../../core/enums/mode.enum';
import { finalize, Observable, Subject, take, takeUntil } from 'rxjs';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { CommonModule } from '@angular/common';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { ChecableTreeComponent } from '../../../shared/components/checable-tree/checable-tree.component';
import { FormComponent } from '../../../shared/components/form/form.component';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { LoaderService } from '../../../core/services/loader.service';
import { AccessControlService } from '../access-control.service';
import {
  RoleApplication,
  RoleApplicationModuleUpdateRequest,
  RoleData,
} from '../access-control.interface';
import {
  ApiResponse,
  ErrorResponse,
} from '../../../core/models/api-request-response.interface';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { AssignApplicationComponent } from '../assign-application/assign-application.component';
import { CommonService } from '../../../core/services/common.service';
import {
  ModuleRecord,
  TreeNode,
} from '../../manage-applications/manage-applications.interface';

@Component({
  selector: 'app-view-access-control',
  imports: [
    NzPageHeaderModule,
    AngularSvgIconModule,
    NzModalModule,
    NzGridModule,
    NzFlexModule,
    ReactiveFormsModule,
    NzFormModule,
    NzButtonModule,
    NzSelectModule,
    NzRadioModule,
    NzInputModule,
    NzTreeModule,
    CommonModule,
    NzCheckboxModule,
    ChecableTreeComponent,
    NzCollapseModule,
    NzSpinModule,
  ],
  templateUrl: './view-access-control.component.html',
  styleUrl: './view-access-control.component.scss',
})
export class ViewAccessControlComponent
  extends FormComponent
  implements OnInit, OnDestroy
{
  mode = Mode;
  destroy$ = new Subject<void>();
  displayMode: Mode = Mode.VIEW;
  loading: boolean = false;
  loading$: Observable<boolean>;
  roleData = {} as RoleData;
  applicationData = {} as any;
  permissionList: RoleApplicationModuleUpdateRequest[] = [];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private notification: NotificationService,
    private accessControlService: AccessControlService,
    private loaderService: LoaderService,
    private modalService: NzModalService,
    private commonService: CommonService
  ) {
    super();
    this.loading$ = this.loaderService.loading$;
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      isActive: new FormControl(null, [Validators.required]),
      applications: this.fb.array([]),
    });
  }

  // addApplicationRecord() {
  //   this.applicationRecords.push(this.createApplicationRecord());
  // }

  get applicationRecords(): FormArray {
    return this.form.get('applications') as FormArray;
  }

  createApplicationRecord(application: RoleApplication): FormGroup {
    const group = this.fb.group({
      applicationId: new FormControl(application.applicationId, [
        Validators.required,
      ]),
      modules: this.fb.array(
        application?.modules.map((module: ModuleRecord) =>
          this.createModuleRecord(module)
        )
      ),
    });

    return group;
  }

  getModuleRecords(appIndex: number): FormArray {
    return this.applicationRecords.at(appIndex).get('modules') as FormArray;
  }

  createModuleRecord(module: ModuleRecord): FormGroup {
    return this.fb.group({
      id: new FormControl(module.id, [Validators.required]),
      canRead: new FormControl(module.canRead),
      canWrite: new FormControl(module.canWrite),
      canDelete: new FormControl(module.canDelete),
    });
  }

  ngOnInit(): void {
    this.displayMode = this.route.snapshot.paramMap.get('mode') as Mode;
    this.route.queryParams.subscribe(params => {
      this.getRoleById(params['id']);
    });
    this.displayMode === this.mode.VIEW
      ? this.form.disable()
      : this.form.enable();
  }

  getRoleById(id: number) {
    this.loaderService.show();
    this.accessControlService
      .getRoleById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ApiResponse<RoleData>) => {
          this.roleData = response.result || {};
          this.applicationData = this.roleData.applications.map((app: any) => {
            const modifiedModules = this.commonService.mapToTreeNode(
              app.modules
            );
            return {
              ...app,
              modules: modifiedModules,
            };
          });
          this.bindForm();
          this.loaderService.hide();
        },
        error: (error: Error) => {
          console.log(error);
          this.loaderService.show();
        },
      });
  }

  bindForm() {
    this.form.patchValue(this.roleData);
    this.control('name').setValue(this.roleData.role.name);
    this.control('description').setValue(this.roleData.role.description);
    this.control('isActive').setValue(this.roleData.role.isActive);
    this.form.setControl(
      'applications',
      this.fb.array(
        this.roleData.applications.map((app: RoleApplication) =>
          this.createApplicationRecord(app)
        )
      )
    );
  }

  openModel() {
    const modal = this.modalService.create({
      nzTitle: 'Assign New Application',
      nzContent: AssignApplicationComponent,
      nzWidth: '360px',
      nzData: {
        roleId: this.roleData.roleId,
        applicationIds: this.roleData.role.applicationIds,
      },
      nzCentered: true,
      nzClosable: false,
      nzFooter: null,
    });
    modal.afterClose.subscribe(result => {
      if (result === 'save') {
        this.getRoleById(this.roleData.roleId);
      }
    });
  }

  onExpandChange(node: TreeNode, isExpanded: boolean): void {
    node.expanded = isExpanded;
  }
  isLeafNode(node: any): boolean {
    return !node.children || node.children.length === 0;
  }

  submitForm(): void {
    if (this.form.invalid) {
      return;
    }
    this.loaderService.show();
    this.loading = true;

    this.accessControlService
      .editRole(this.roleData.roleId, this.form.value)
      .pipe(
        take(1),
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: () => {
          this.handleSuccess();
          this.loaderService.hide();
        },
        error: (error: ErrorResponse) => {
          this.handleError(error);
        },
      });
  }

  handleSuccess() {
    this.notification.notify('success', 'Role Updated Successfully');
  }

  handleError(error: ErrorResponse) {
    this.notification.notify('error', error.message);
  }

  changeMode() {
    this.displayMode = this.mode.EDIT;
    this.form.enable();
  }

  onPermissionUpdate(update: RoleApplicationModuleUpdateRequest) {
    const existingIndex = this.permissionList.findIndex(
      item => item.applicationId === update.applicationId
    );

    if (existingIndex !== -1) {
      this.permissionList[existingIndex].modules = update.modules;
    } else {
      this.permissionList.push(update);
    }
    this.control('applications').setValue(this.permissionList);
  }

  // addApplication(app: RoleApplication) {
  //   this.applicationRecords.push(this.createApplicationRecord(app));
  //   app['isRemove'] = false;
  // }

  removeApplication(app: RoleApplication) {
    const index = this.applicationRecords.value.findIndex(
      (a: RoleApplication) => a.applicationId === app.applicationId
    );
    this.applicationRecords.removeAt(index);
    const applicationIndex = this.applicationData.findIndex(
      (f: RoleApplication) => f.applicationId === app.applicationId
    );
    this.applicationData.splice(applicationIndex,1);
    // application['isRemove'] = true;
  }

  resetForm() {
    this.bindForm();
    this.applicationData = this.roleData.applications;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
