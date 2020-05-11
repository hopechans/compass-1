import {RouteProps} from "react-router";
import {buildURL} from "../../navigation";

export const graphRoute: RouteProps = {
    path: "/graph"
}

export interface IGraphParams {
}

export const graphURL = buildURL<IGraphParams>(graphRoute.path);