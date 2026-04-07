import { NzTableQueryParams } from 'ng-zorro-antd/table';
import {
  paginatedRequest,
  SearchQuery,
} from '../../../core/models/api-request-response.interface';
import _ from 'lodash';
import { FormControl, FormGroup } from '@angular/forms';
import { ColumnItem } from '../../../core/models/common.interface';
import { filterType } from '../../../core/enums/filter-type.enum';
import { FormComponent } from '../form/form.component';
import { format } from 'date-fns';

export class TableComponent extends FormComponent {
  // filter: FormGroup = new FormGroup({});
  totalRecord: number = 0;
  isShowDeletedRecords: boolean = false;
  createFilters(columns: ColumnItem[]) {
    columns.forEach((col: ColumnItem) => {
      if (
        col.filter?.type === filterType.TEXT ||
        col.filter?.type === filterType.DROPDOWN ||
        col.filter?.type === filterType.DATE
      ) {
        // form control created as per filter type
        this.form.addControl(
          col.key,
          new FormControl(
            !!col.filter?.initialValue ? col.filter.initialValue : ''
          )
        );
      } else {
        // default created form control
        this.form.addControl(col.key, new FormControl(''));
      }
    });
  }

  pageOptions: paginatedRequest = {
    page: 1,
    pageSize: 20,
    isDeleted: false,
  };

  resetPageFilters() {
    this.pageOptions = {
      page: 1,
      pageSize: 20,
    };
  }

  onParamsChange(params: NzTableQueryParams) {
    this.pageOptions.pageSize = params.pageSize;
    this.pageOptions.page = params.pageIndex;
    const sortFields = _.filter(params.sort, param => param.value != null);
    if (sortFields.length > 0) {
      this.pageOptions.sortFields = _.map(sortFields, item => ({
        sort: item?.key,
        sortOrder: item?.value === 'ascend' ? 0 : 1,
      }));
    } else {
      const options = this.pageOptions;
      this.pageOptions = {
        page: options.page,
        pageSize: options.pageSize,
        searchQuery: options.searchQuery,
        isDeleted: options.isDeleted,
      };
    }
    this.getData();
  }

  changePage(page: number) {
    if (this.pageOptions.page !== page) {
      this.pageOptions.page = page;
    }
  }

  changePageSize(size: number) {
    if (this.pageOptions.pageSize !== size) {
      this.pageOptions.pageSize = size;
      this.pageOptions.page = 1;
    }
  }

  showDeletedRecords(event: Event) {
    this.isShowDeletedRecords = event ? true : false;
    this.pageOptions.page = 1;
    this.pageOptions.isDeleted = this.isShowDeletedRecords;
    this.getData();
  }

  changeFilter(fields: any) {
    this.pageOptions.searchQuery = [];
    this.setFilters(fields);
    this.pageOptions.page = 1;
  }

  setFilters(fields: any) {
    Object.keys(fields).forEach(key => {
      if (!!fields[key]) {
        if (
          typeof fields[key] === 'object' &&
          !(fields[key] instanceof Date) &&
          fields[key] !== null
        ) {
          this.setFilters(fields[key]);
        } else if (fields[key] instanceof Date) {
          this.pageOptions.searchQuery?.push({
            searchTerm: key,
            searchValue: format(new Date(fields[key]), 'yyyy-MM-dd'),
            isDropdown: false,
          });
        } else if (typeof fields[key] === 'number') {
          this.pageOptions.searchQuery?.push({
            searchTerm: key,
            searchValue: fields[key].toString(),
            isDropdown: true,
          });
        } else {
          this.pageOptions.searchQuery?.push({
            searchTerm: key,
            searchValue: fields[key].toString(),
            isDropdown: false,
          });
        }
      }
    });
    this.getData();
  }

  clearFilter() {
    this.form.reset();
    this.pageOptions.searchQuery = [];
    this.pageOptions.page = 1;
  }

  getData() {
    //override this method in parent component
  }

  get isFilterApplied(): boolean {
    return this.pageOptions.searchQuery
      ? this.pageOptions.searchQuery.length > 0
      : false;
  }
}
