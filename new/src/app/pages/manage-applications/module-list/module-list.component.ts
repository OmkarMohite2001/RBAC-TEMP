import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTreeModule } from 'ng-zorro-antd/tree';

interface TreeNode {
  title: string;
  key: string;
  children?: TreeNode[];
  expanded?: boolean;
}
@Component({
  selector: 'app-module-list',
  imports: [
    AngularSvgIconModule,
    NzBreadCrumbModule,
    NzTreeModule,
    CommonModule,
    NzInputModule,
    NzFormModule,
  ],
  templateUrl: './module-list.component.html',
  styleUrl: './module-list.component.scss',
})
export class ModuleListComponent {
  nodes: TreeNode[] = [
    {
      title: 'Dashboard',
      key: '100',
      expanded: true,
      children: [
        { title: 'Dashboard 1-1', key: '1001' },
        { title: 'Dashboard 1-2', key: '1002' },
      ],
    },
    {
      title: 'Motor',
      key: '101',
      children: [
        { title: 'View Motor', key: '1011' },
        { title: 'Add Motor', key: '1012' },
        { title: 'Edit Motor', key: '1013' },
        { title: 'Delete & Restore Motor', key: '1014' },
      ],
    },
    {
      title: 'Engine',
      key: '102',
      children: [
        { title: 'View Engine', key: '1011' },
        { title: 'Add Engine', key: '1012' },
        { title: 'Edit Engine', key: '1013' },
        { title: 'Delete & Restore Engine', key: '1014' },
      ],
    },
    {
      title: 'Gearbox',
      key: '103',
      children: [
        { title: 'View Motor', key: '1031' },
        { title: 'Add Motor', key: '1032' },
        { title: 'Edit Motor', key: '1033' },
        { title: 'Delete & Restore Motor', key: '1034' },
        {
          title: 'Efficiency Graph',
          key: '10310',
          children: [
            { title: 'Gearbox Input', key: '10311' },
            { title: 'Gearbox Efficiency', key: '10312' },
          ],
        },
      ],
    },
    {
      title: 'Manufacturer',
      key: '104',
      children: [
        { title: 'View Manufacturer', key: '1041' },
        { title: 'Add Manufacturer', key: '1042' },
        { title: 'Edit Manufacturer', key: '1043' },
        { title: 'Delete & Restore Manufacturer', key: '1044' },
      ],
    },
    {
      title: 'Pump',
      key: '105',
      children: [
        { title: 'View Pump', key: '1051' },
        { title: 'Add Pump', key: '1052' },
        { title: 'Edit Pump', key: '1053' },
        { title: 'Delete & Restore Pump', key: '1054' },
      ],
    },
  ];
  onExpandChange(node: TreeNode, isExpanded: boolean): void {
    node.expanded = isExpanded;
  }
  isLeafNode(node: any): boolean {
    return !node.children || node.children.length === 0;
  }
}
