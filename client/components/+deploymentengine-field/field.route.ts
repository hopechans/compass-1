import {RouteProps} from "react-router";
import {buildURL} from "../../navigation";

export const fieldRoute: RouteProps = {
    path: "/field"
}

export interface IFieldRouteParams {
}

export const fieldURL = buildURL<IFieldRouteParams>(fieldRoute.path)