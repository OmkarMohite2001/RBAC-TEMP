import {
  ApiResponse,
  paginatedResult,
} from '../../core/models/api-request-response.interface';
import { ITimeStamp } from '../../core/models/common.interface';

export interface Application {
  name: string;
  description: string;
  apiEndpointUrl: string;
  accessKey: string;
  isActive?: boolean;
}

export interface ApplicationListRecord extends Application, ITimeStamp {
  id: number;
  apiKey: string;
  moduleCount?: number;
  modules?: ModuleRecord[];
}

export interface Module {
  applicationId: number;
  parentModuleId: number;
  name: string;
}

export interface ModuleRecord extends Module, ITimeStamp {
  id: number;
  canDelete?: false;
  canRead?: false;
  canWrite?: false;
}

export interface applicationOptions {
  id: number;
  name: string;
}

export interface TreeNode {
  title: string;
  key: string;
  children?: TreeNode[];
  expanded?: boolean;
  canDelete?: false;
  canRead?: false;
  canWrite?: false;
}

export type paginatedApplication = ApiResponse<
  paginatedResult<ApplicationListRecord>
>;

export type applicationOptionsResult = ApiResponse<
  paginatedResult<applicationOptions>
>;

export type paginatedModule = ApiResponse<paginatedResult<ModuleRecord>>;
