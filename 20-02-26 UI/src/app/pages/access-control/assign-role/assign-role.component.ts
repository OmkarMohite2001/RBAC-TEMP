import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import {
  NZ_MODAL_DATA,
  NzModalModule,
  NzModalRef,
  NzModalService,
} from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormComponent } from '../../../shared/components/form/form.component';
import { Subject, takeUntil } from 'rxjs';
import { AccessControlService } from '../access-control.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ManageApplicationService } from '../../manage-applications/manage-applications.service';
import {
  ApiResponse,
  DropDownOptions,
  paginatedResult,
} from '../../../core/models/api-request-response.interface';
import { Role } from '../access-control.interface';
import { RoleAddComponent } from '../role-add/role-add.component';

@Component({
  selector: 'app-assign-role',
  imports: [
    NzModalModule,
    ReactiveFormsModule,
    NzFormModule,
    NzButtonModule,
    NzSelectModule,
    NzInputModule,
    CommonModule,
  ],
  templateUrl: './assign-role.component.html',
  styleUrl: './assign-role.component.scss',
})
export class AssignRoleComponent
  extends FormComponent
  implements OnDestroy, OnInit
{
  roleOption: Role[] = [];
  isCloneRole: boolean = false;
  loading: boolean = false;
  destroy$ = new Subject<void>();

  constructor(
    private modalRef: NzModalRef,
    private fb: FormBuilder,
    private accessControlService: AccessControlService,
    private modalService: NzModalService
  ) {
    super();
    this.initForm();
    this.getMasterDropDownData();
  }
  ngOnInit() {}

  initForm() {
    this.form = this.fb.group({
      roleId: new FormControl(null, [Validators.required]),
    });
  }

  getMasterDropDownData(params?: DropDownOptions) {
    this.accessControlService
      .getRolesForDropDown(!!params ? params : undefined)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ApiResponse<paginatedResult<Role>>) => {
          this.roleOption = response.result.data || [];
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  handleCancel(): void {
    this.modalRef.close();
  }

  submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched;
      return;
    }
    this.openModel();
    this.handleCancel();
  }

  changeMode() {
    this.isCloneRole = true;
  }

  openModel() {
    this.modalService.create({
      nzTitle: 'Add New User Role',
      nzContent: RoleAddComponent, // Component to display
      nzWidth: '1000px',
      nzData: {
        data: this.value('roleId'),
      },
      nzCentered: true,
      nzClosable: false,
      nzFooter: null, // No footer, or you can customize it
    });
    this.handleCancel();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
