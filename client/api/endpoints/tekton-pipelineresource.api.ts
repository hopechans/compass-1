import {autobind} from "../../utils";
import {KubeObject} from "../kube-object";
import {KubeApi} from "../kube-api";

export interface PipelineResourceSpec {
  type: string;
  params: {
    name: string,
    value: string
  }[],
  secrets: [],
}

@autobind()
export class PipelineResource extends KubeObject {
  static kind = "PipelineResource"
  spec: PipelineResourceSpec

  getOwnerNamespace(): string {
    return this.metadata.namespace || "";
  }
}

export const pipelineResourceApi = new KubeApi({
  kind: PipelineResource.kind,
  apiBase: "/apis/tekton.dev/v1alpha1/pipelineresources",
  isNamespaced: true,
  objectConstructor: PipelineResource,
});
