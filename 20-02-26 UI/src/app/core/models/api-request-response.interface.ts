export interface ApiResponse<T> extends ErrorResponse {
  result: T;
}

export interface ApiListResponse<T> extends ErrorResponse {
  result: T[];
}

export interface ErrorResponse {
  message: string;
  statusCode: number;
  errors: ErrorDetail[];
}

export interface ErrorDetail {
  field: string;
  description: string;
  detailedMessage: string;
}

export interface paginatedResult<T> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalRows: number;
}

// export type paginatedContractUsers = paginatedResult<ContractUser>;

export interface paginatedRequest {
  pageSize: number;
  page: number;
  sortFields?: SortFields[];
  searchQuery?: SearchQuery[];
  isDeleted?: boolean;
}

export interface SortFields {
  sort: string;
  sortOrder: number;
}

export interface SearchQuery {
  searchTerm: string;
  searchValue: string;
  isDropdown?: boolean;
}

export interface DropDownOptions {
  page?: number;
  pageSize?: number;
  searchValue?: string;
  isDeleted?: boolean;
}

export interface Employee {
  employeeId: number;
  contractEmpId: number,
  employeeCode: number;
  firstName: string;
  lastName: string;
  userRole: string;
  userDepartment: string | null;
  isContractEmployee: boolean;
  employeePassword: string | null;
  employeeStartDate: string;
  employeeEndDate: string;
  isTempPassword: boolean;
  isActive: boolean;
  departments: {
    departmentId: number;
    departmentName: string;
  }[];
}

// export interface ContractUser {
//   employeeCode: string;
//   firstName: string;
//   lastName: string;
//   userRole: string;
//   departmentIds: string[];
//   employeePassword: string;
//   employeeStartDate?: string;
//   employeeEndDate?: string;
//   isTempPassword?: boolean;
//   [key: string]: any; // if dynamic keys are used
// }

