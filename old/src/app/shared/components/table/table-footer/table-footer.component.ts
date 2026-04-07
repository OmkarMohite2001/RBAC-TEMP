import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-table-footer',
  imports: [NzInputModule, NzSelectModule, FormsModule, CommonModule],
  templateUrl: './table-footer.component.html',
  styleUrl: './table-footer.component.scss',
})
export class TableFooterComponent {
  pageNo = 1;
  @Input() sizeOptions: number[] = [10, 20, 30, 50, 75];
  @Input() totalRecords: number = 0; // Total records to calculate total pages

  @Input() set page(pageNo: number) {
    if (pageNo !== this.pageNo) {
      this.pageNo = pageNo;
    }
  }
  @Input() pageSize: number = 20;
  @Output() changePage = new EventEmitter<number>();
  @Output() changePageSize = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize) || 1;
  }

  changeSize() {
    this.changePageSize.emit(this.pageSize);
  }

  goTo() {
    if (!this.pageNo || this.pageNo < 1 || this.pageNo > this.totalPages) {
      return;
    }
    this.changePage.emit(this.pageNo);
  }
}
