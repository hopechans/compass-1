import {autobind} from "../../utils";
import {KubeObject} from "../kube-object";
import {KubeApi} from "../kube-api";
import {Inputs, Outputs, Param, TaskSpec} from "./tekton-task.api";
import {TaskRef} from "./tekton-pipeline.api";
import {PipelineResourceBinding, PodTemplate} from "./tekton-pipelinerun.api";
import {PersistentVolumeClaim, PersistentVolumeClaimVolumeSource} from "./persistent-volume-claims.api";

export interface TaskResourceBinding {
  PipelineResourceBinding: PipelineResourceBinding
  paths: string[]
}

export interface TaskRunResources {
  inputs?: TaskResourceBinding[]
  outputs?: TaskResourceBinding[]
}


export interface TaskRunSpec {
  params?: Param[]
  resources?: TaskRunResources
  serviceAccountName: string
  taskRef?: TaskRef
  taskSpec?: TaskSpec
  status: string
  podTemplate: PodTemplate
  workspaces?: any[]
  timeout?: number
  inputs?: Inputs
  outputs?: Outputs
}

@autobind()
export class TaskRun extends KubeObject {
  static kind = "TaskRun"

  spec: TaskRunSpec;

  getOwnerNamespace(): string {
    return this.metadata.labels.namespace || "";
  }
}

export const taskRunApi = new KubeApi({
  kind: TaskRun.kind,
  apiBase: "/apis/tekton.dev/v1alpha1/taskruns",
  isNamespaced: true,
  objectConstructor: TaskRun,
});
