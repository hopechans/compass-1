import {RouteProps} from "react-router";
import {buildURL} from "../../navigation";

export const formRoute: RouteProps = {
    path: "/form"
}

export interface IFormRouteParams {
}

export const formURL = buildURL<IFormRouteParams>(formRoute.path)