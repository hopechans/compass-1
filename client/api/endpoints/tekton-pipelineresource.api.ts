import {autobind} from "../../utils";
import {KubeObject} from "../kube-object";
import {KubeApi} from "../kube-api";

@autobind()
export class PipelineResource extends KubeObject {
  static kind = "PipelineResource"
  spec: {
    type: string;
    params: {
      name: string,
      value: string
    }[],
    secrets: [],
  }
}

export const pipelineResourceApi = new KubeApi({
  kind: PipelineResource.kind,
  apiBase: "/apis/tekton.dev/v1alpha1/pipelineresources",
  isNamespaced: false,
  objectConstructor: PipelineResource,
});
