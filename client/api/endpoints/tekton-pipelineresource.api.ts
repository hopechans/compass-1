import { autobind } from "../../utils";
import { KubeObject } from "../kube-object";
import { KubeApi } from "../kube-api";

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

  getOwnerNamespace(): string {
    return this.metadata.labels.namespace || "";
  }

}

export const pipelineResourceApi = new KubeApi({
  kind: PipelineResource.kind,
  apiBase: "/apis/tekton.dev/v1alpha1/pipelineresources",
  isNamespaced: true,
  objectConstructor: PipelineResource,
});
