import { RouteProps } from "react-router";
import { buildURL } from "../../navigation";
import { Tekton } from './tekton'

export const tektonRoute: RouteProps = {
  get path() {
    return Tekton.tabRoutes.map(({ path }) => path).flat()
  }
}

export const pipelineRoute: RouteProps = {
  path: "/tekton-pipeline",
};

export const tektonURL = buildURL(pipelineRoute.path);
export const pipelineURL = buildURL(pipelineRoute.path);