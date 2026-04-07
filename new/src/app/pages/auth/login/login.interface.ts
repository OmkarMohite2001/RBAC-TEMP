export interface Login {
    strLoginId: string;
    strPassword: string;
  }
  
  
export interface LoginResponse {
    token: string;
    roles: string[];
    permissions: Permission[]
    userId?: string;
  }
    
  export interface Permission {
      applicationId: number;
      applicationName: string;
      moduleId: number;
      moduleName: string;
      
      canRead?: boolean;
      canWrite?: boolean;
      canDelete?: boolean;
    }
