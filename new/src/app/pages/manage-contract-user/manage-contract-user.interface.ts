import {
  ApiResponse,
  paginatedResult,
} from '../../core/models/api-request-response.interface';
import { ITimeStamp } from '../../core/models/common.interface';

export interface ContractDepartment {
  departmentId: number;
  departmentName: string;
}

export interface ContractUsersListRecord extends ContractUser, ITimeStamp {
  employeeId: number;
}

export type paginatedContractUsers = ApiResponse<
  paginatedResult<ContractUsersListRecord>
>;

export interface Employee {
  employeeId: number;
  contractEmpId?: number;
  employeeCode: number;
  firstName: string;
  lastName: string;
  userRole: string;
  userDepartment?: unknown;
  isContractEmployee: boolean;
  employeePassword?: string | null;
  employeeStartDate: string;
  employeeEndDate: string;
  isTempPassword: boolean;
  isActive: boolean;
  departments: ContractDepartment[];
}

export interface ContractEmployee {
  employeeId: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  userRole: number | string;
  employeePassword: string;
  employeeStartDate: string;
  employeeEndDate: string;
  isTempPassword: boolean;
  isActive: boolean;
  isContractEmployee: boolean;
  departments: ContractDepartment[];
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
  departments: ContractDepartment[];
  empCode?: string;
  name?: string;
  departmentName?: string;
  departmentIds?: string[];
}
