import {
  ApiResponse,
  paginatedResult,
} from '../../core/models/api-request-response.interface';
import { ITimeStamp } from '../../core/models/common.interface';
import { Role } from '../access-control/access-control.interface';
// import { Department } from '../department/department.interface';

// export interface ContractUser {
//   employeeCode: string; // Changed from employeeId
//   departmentIds: number;
//   departments: Department[];
//   departmentName: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   managerName: string;
//   managerEmail: string;
//   roleIds: number[];
//   roles: Role[];
//   isActive: boolean;
// }

export interface ContractUserData {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: Role[];
  departments: Department[];
  exp: number;
  iss: string;
  aud: string;
}

export interface ContractUsersListRecord extends ContractUser, ITimeStamp {
  // id: number;
  employeeId: number;
}
export type paginatedContractUsers = ApiResponse<paginatedResult<ContractUsersListRecord>>;

export interface ContractRole {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

export interface Employee {
  employeeId: number;
  // contractEmpId?: number,
  employeeCode: number;
  firstName: string;
  lastName: string;
  userRole: string;
  userDepartment?: any;
  isContractEmployee: boolean;
  employeePassword?: string | null;
  employeeStartDate: string;
  employeeEndDate: string;
  isTempPassword: boolean;
  isActive: boolean;
  departments: Department[];
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


export interface Department {
  departmentId: number;
  departmentName: string;
}

export interface ContractEmployee {
  employeeId: string,
  // contractEmpId?: string,
  employeeCode: string;
  firstName: string;
  lastName: string;
  userRole: string;
  employeePassword: string;
  employeeStartDate: string;
  employeeEndDate: string;
  isTempPassword: boolean;
  isActive: boolean;
  isContractEmployee: boolean;
  departments: {
    departmentId: number;
    departmentName: string;
  }[];
}


export interface ContractUser {
  employeeId: number;
  contractEmpId?: number;
  employeeCode: number;
  firstName: string;
  lastName: string;
  userRole: string;
  employeePassword: string | null;
  employeeStartDate: string;
  employeeEndDate: string;
  isActive: boolean;
  isContractEmployee: boolean;
  departments: Department[];

  // 🔽 Computed or UI-specific fields (optional but used in HTML)
  // id: number; // alias for employeeId
  empCode?: string; // for display in table
  name?: string; // for full name
  departmentName?: string; // for displaying joined department names
  departmentIds?: string[]; // for filtering/selecting departments
}