import { filterType } from '../enums/filter-type.enum';

export interface ITimeStamp {
  createdBy?: string;
  createdOn?: Date;
  updatedBy?: string;
  updatedOn?: Date;
  restoredBy?: string;
  restoredOn?: Date;
  deletedBy?: string;
  deletedOn?: Date;
  updatedByUser?: updatedByUser;
}

export interface updatedByUser {
  id: number;
  firstName: string;
  lastName: string;
}

export interface ColumnItem {
  name: string;
  key: string;
  width: string | null;
  sortFn: boolean;
  filter?: filterItem;
}

export interface filterItem {
  type: filterType;
  filterOptions?: any[];
  initialValue?: string | number | Date | null;
}
