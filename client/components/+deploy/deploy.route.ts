import { RouteProps } from "react-router"
import { buildURL, IURLParams } from "../../navigation";
import { Deploy } from "./deploy";

export const deployRoute: RouteProps = {
  get path() {
    return Deploy.tabRoutes.map(({ path }) => path).flat()
  }
}

export const deployWorkloadsTemplateRoute: RouteProps = {
  path: "/workloads-template"
}


// Route params
export interface IDeployWorkloadsTemplateParams {
}


// URL-builders
export const deployURL = (params?: IURLParams) => deployWorkloadsTemplateURL(params);
export const deployWorkloadsTemplateURL = buildURL<IDeployWorkloadsTemplateParams>(deployWorkloadsTemplateRoute.path)
