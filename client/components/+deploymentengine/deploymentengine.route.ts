import {RouteProps} from "react-router";
import {DeploymentEngine} from "./deploymentengine";
import {graphURL} from "../+deploymentengine-graph";
import {IURLParams} from "../../navigation";

export const deploymentEngineRoute: RouteProps = {
    get path() {
        return DeploymentEngine.tabRoutes.map(({path}) => path).flat()
    }
};

export const deploymentEngineURL = (params?: IURLParams) => graphURL(params);