import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTreeComponent, NzTreeModule, NzTreeNode } from 'ng-zorro-antd/tree';
import { TreeNode } from '../../../pages/manage-applications/manage-applications.interface';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  RoleApplicationModuleUpdateRequest,
  RoleModulePermission,
} from '../../../pages/access-control/access-control.interface';
@Component({
  selector: 'app-checable-tree',
  imports: [
    NzTreeModule,
    AngularSvgIconModule,
    NzCheckboxModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './checable-tree.component.html',
  styleUrl: './checable-tree.component.scss',
})
export class ChecableTreeComponent {
  @Input() nodes: TreeNode[] = [];
  @Input() view: boolean = false;
  @Input() applicationId: number = 0;
  @Input() table?: boolean = false;
  @Input() form?: FormGroup;
  @Output() updateModule = new EventEmitter<number>();
  @Output() permissionChanged =
    new EventEmitter<RoleApplicationModuleUpdateRequest>();
  @ViewChild('nzTree', { static: false }) treeComponent!: NzTreeComponent;

  onExpandChange(node: TreeNode, isExpanded: boolean): void {
    node.expanded = isExpanded;
  }
  isLeafNode(node: any): boolean {
    return !node.children || node.children.length === 0;
  }
  onUpdateModule(node: TreeNode) {
    this.updateModule.emit(+node.key);
  }

  getModule(key: string, ctrlName: string): FormControl {
    return (
      ((
        (
          (
            this.form?.get('applications') as FormArray
          )?.controls
            .find(
              ctrl => ctrl.get('applicationId')?.value === this.applicationId
            )
            ?.get('modules') as FormArray
        )?.controls.find(
          ctrl => ctrl.get('id')?.value === +key
        ) as FormGroup
      )?.get(ctrlName) as FormControl) || new FormControl()
    );
  }

  onPermissionChange(
    node: NzTreeNode,
    type: 'canRead' | 'canWrite' | 'canDelete',
    value: boolean
  ) {
    node.origin[type] = value;

    const fullTreeNodes = this.treeComponent.getTreeNodes();

    const modules = this.getPermissionsFromTree(fullTreeNodes);

    this.permissionChanged.emit({
      applicationId: this.applicationId,
      modules,
    });
  }

  getPermissionsFromTree(treeNodes: NzTreeNode[]): RoleModulePermission[] {
    const result: RoleModulePermission[] = [];

    const recurse = (nodes: NzTreeNode[]) => {
      for (let node of nodes) {
        result.push({
          id: Number(node.key),
          canRead: !!node.origin['canRead'],
          canWrite: !!node.origin['canWrite'],
          canDelete: !!node.origin['canDelete'],
        });

        if (node.children && node.children.length > 0) {
          recurse(node.children);
        }
      }
    };

    recurse(treeNodes);
    return result;
  }
}
