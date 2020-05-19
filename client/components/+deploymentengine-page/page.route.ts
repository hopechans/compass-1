import {RouteProps} from "react-router";
import {buildURL} from "../../navigation";

export const pageRoute: RouteProps = {
    path: "/page"
}

export interface IPageRouteParams {
}

export const pageURL = buildURL<IPageRouteParams>(pageRoute.path)