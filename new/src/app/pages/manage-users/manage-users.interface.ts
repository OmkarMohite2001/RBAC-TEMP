import {
  ApiResponse,
  paginatedResult,
} from '../../core/models/api-request-response.interface';
import { ITimeStamp } from '../../core/models/common.interface';
import { Role } from '../access-control/access-control.interface';
import { Department } from '../department/department.interface';

export interface User {
  employeeId: string;
  departmentIds: number;
  departments: Department[];
  departmentName: string;
  firstName: string;
  lastName: string;
  email: string;
  managerName: string;
  managerEmail: string;
  roleIds: number[];
  roles: Role[];
  isActive: boolean;
}

export interface UserData {
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

export interface UsersListRecord extends User, ITimeStamp {
  id: number;
}
export type paginatedUsers = ApiResponse<paginatedResult<UsersListRecord>>;

export interface role {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}
