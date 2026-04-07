import {
  ApiResponse,
  paginatedResult,
} from '../../core/models/api-request-response.interface';
import { ITimeStamp } from '../../core/models/common.interface';
import { ModuleRecord } from '../manage-applications/manage-applications.interface';

export interface Role {
  id: number;
  name: string;
}

export interface RoleItem {
  name: string;
  description: string;
  isActive: boolean;
  applicationIds?: number[];
  applications?: RoleApplicationModuleUpdateRequest[];
}

export interface RoleRecord extends RoleItem, ITimeStamp {
  id: number;
}

export interface RoleData {
  roleId: number;
  role: RoleRecord;
  applications: RoleApplication[];
}

export interface RoleModulePermission {
  id: number;
  parentModuleId?: number;
  name?: string;
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
}

export interface RoleApplication {
  applicationId: number;
  applicationName: string;
  modules: ModuleRecord[];
}

export interface RoleApplicationModuleUpdateRequest {
  applicationId: number;
  modules: RoleModulePermission[];
}

export type paginateRole = ApiResponse<paginatedResult<RoleRecord>>;
