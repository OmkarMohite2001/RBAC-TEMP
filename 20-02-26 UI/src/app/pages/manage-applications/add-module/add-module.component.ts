import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Mode } from '../../../core/enums/mode.enum';
import { FormComponent } from '../../../shared/components/form/form.component';
import {
  ModuleRecord,
  paginatedModule,
} from '../manage-applications.interface';
import { finalize, Observable, Subject, take, takeUntil } from 'rxjs';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ApiResponse,
  ErrorResponse,
} from '../../../core/models/api-request-response.interface';
import { ManageModuleService } from '../manage-modules.service';
import { NotificationService } from '../../../core/services/notification.service';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { LoaderService } from '../../../core/services/loader.service';

@Component({
  selector: 'app-add-module',
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
  ],
  templateUrl: './add-module.component.html',
  styleUrl: './add-module.component.scss',
})
export class AddModuleComponent
  extends FormComponent
  implements OnInit, OnDestroy
{
  mode = Mode;
  moduleData = {} as ModuleRecord;
  loading: boolean = false;
  displayMode: Mode;
  loading$: Observable<boolean>;
  destroy$ = new Subject<void>();
  parentModuleOption: ModuleRecord[] = [];
  constructor(
    private modalRef: NzModalRef,
    private fb: FormBuilder,
    private moduleService: ManageModuleService,
    private notification: NotificationService,
    private loaderService: LoaderService,
    @Inject(NZ_MODAL_DATA)
    public params: { type: Mode; moduleId: number; applicationId: number }
  ) {
    super();
    this.loading$ = this.loaderService.loading$;
    this.initForm();
    this.displayMode = params.type;
    this.getMasterData();
    if (!!params.moduleId) {
      this.getModulebyId(params.moduleId);
    }
  }

  ngOnInit(): void {}

  async getMasterData() {
    this.moduleService
      .getModuleForDropdown(this.params.applicationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: paginatedModule) => {
          this.parentModuleOption = response.result.data || [];
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  getModulebyId(id: number) {
    this.loaderService.show();
    this.moduleService
      .getModuleById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ApiResponse<ModuleRecord>) => {
          this.moduleData = response.result || {};
          this.form.patchValue(response.result);
          this.loaderService.hide();
        },
        error: (error: Error) => {
          console.log(error);
          this.loaderService.show();
        },
      });
  }

  initForm() {
    this.form = this.fb.group({
      name: new FormControl('', [Validators.required]),
      parentModuleId: new FormControl(null),
    });
  }

  handleCancel(): void {
    this.modalRef.close('cancel');
  }

  submitForm(): void {
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    const operation$ =
      this.displayMode === this.mode.EDIT
        ? this.moduleService.editModule(this.moduleData.id, this.form.value)
        : this.moduleService.createModule({
            applicationId: this.params.applicationId,
            ...this.form.value,
          });

    operation$
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
        },
        error: (error: ErrorResponse) => {
          this.handleError(error);
        },
      });
  }

  handleSuccess() {
    this.form.reset();
    this.notification.notify(
      'success',
      this.displayMode === this.mode.EDIT
        ? 'Module Updated Successfully'
        : 'Module Created Successfully'
    );
    this.modalRef.close('save');
  }

  handleError(error: ErrorResponse) {
    this.notification.notify('error', error.message);
  }

  resetForm() {
    this.displayMode === this.mode.EDIT
      ? this.form.patchValue(this.moduleData)
      : this.form.reset();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
