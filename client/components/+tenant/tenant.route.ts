import { RouteProps } from "react-router"
import { buildURL, IURLParams } from "../../navigation";
import { Tenant } from "./tenant";
export const tenantRoute: RouteProps = {
  get path() {
    return Tenant.tabRoutes.map(({ path }) => path).flat()
  }
}

// Routes

export const tenantDepartmentRoute: RouteProps = {
  path: "/tenantDepartment"
}
export const tenantRoleRoute: RouteProps = {
  path: "/tenantRole"
}
export const tenantMemberRoute: RouteProps = {
  path: "/tenantMember"
}

// Route params
export interface ITenantDepartmentParams {
}

export interface ITenantRoleParams {
}

export interface ITenantMemberParams {
}

// URL-builders
export const tenantURL = (params?: IURLParams) => tenantDepartmentURL(params);
export const tenantDepartmentURL = buildURL<ITenantDepartmentParams>(tenantDepartmentRoute.path)
export const tenantRoleURL = buildURL<ITenantRoleParams>(tenantRoleRoute.path)
export const tenantMemberURL = buildURL<ITenantMemberParams>(tenantMemberRoute.path)
