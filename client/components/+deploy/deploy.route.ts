import {RouteProps} from "react-router"
import {buildURL, IURLParams} from "../../navigation";
import {Deploys} from "./deploy";

export const deployRoute: RouteProps = {
  path: "/workloads-template"
}

// Route params
export interface IDeployWorkloadsParams {
}

// URL-builders
export const deployURL = buildURL<IDeployWorkloadsParams>(deployRoute.path)