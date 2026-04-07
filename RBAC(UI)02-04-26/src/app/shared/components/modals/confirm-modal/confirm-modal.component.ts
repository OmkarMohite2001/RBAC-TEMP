import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-confirm-modal',
  imports: [
    NzModalModule,
    NzFlexModule,
    AngularSvgIconModule,
    NzButtonModule,
    CommonModule,
  ],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss',
})
export class ConfirmModalComponent {
  @Input() isVisible: boolean = false;
  @Input() modalType: 'restore' | 'delete' = 'restore';
  @Input() itemName: string = '';

  @Output() onCancel: EventEmitter<void> = new EventEmitter();
  @Output() onConfirm: EventEmitter<void> = new EventEmitter();

  handleCancel() {
    this.onCancel.emit();
  }

  handleConfirm() {
    this.onConfirm.emit();
  }
}
