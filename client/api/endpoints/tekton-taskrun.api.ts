import {autobind} from "../../utils";
import {KubeObject} from "../kube-object";
import {KubeApi} from "../kube-api";
import {Inputs, Outputs, Param, TaskSpec} from "./tekton-task.api";
import {TaskRef} from "./tekton-pipeline.api";
import {PipelineRef, PipelineResourceBinding, PodTemplate,} from "./tekton-pipelinerun.api";

export interface Conditions {
  type: string
  status: string
  severity?: string
  lastTransitionTime?: string
  reason?: string
  message?: string
}

export interface ContainerState {
  waiting?: {
    reason?: string
    message?: string
  }
  running?: {
    startedAt?: number
  }
  terminated?: {
    exitCode?: number
    signal?: number
    reason?: number
    message?: number
    startedAt?: number
    finishedAt?: number
    containerID?: string
  }
}

export interface StepState extends ContainerState {
  name: string
  container: string
  imageID: string
}

export interface CloudEventDeliveryState {
  condition: string
  sentAt?: number
  message: string
  retryCount: number
}

export interface CloudEventDelivery {
  target: string
  status: CloudEventDeliveryState
}

export interface TaskRunStatus extends TaskRunStatusFields {
  observedGeneration?: number
  conditions?: Conditions
}

export interface TaskRunResult {
  name: string
  value: string
}

export interface PipelineResourceResult {
  key: string
  value: string
  resourceRef: PipelineRef
  type: string
}

export interface SidecarState extends ContainerState {
  name: string
  container: string
  imageID: string
}

export interface TaskRunStatusFields {
  podName: string
  startTime?: number
  completionTime?: number
  steps?: StepState[]
  cloudEvents?: CloudEventDelivery[]
  retriesStatus?: TaskRunStatus[]
  resourcesResult?: PipelineResourceResult[]
  taskResults?: TaskRunResult[]
  sidecars?: SidecarState
}

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
  status: TaskRunStatusFields;

  getServiceAccountName(): string {
    return this.spec.serviceAccountName || "";
  }

  getInputsResource() {
    return this.spec.inputs.resources || [];
  }

  getOutputsResource() {
    return this.spec.outputs.resources || [];
  }

  getSteps() {
    return this.status.steps || [];
  }
}

export const taskRunApi = new KubeApi({
  kind: TaskRun.kind,
  apiBase: "/apis/tekton.dev/v1alpha1/taskruns",
  isNamespaced: true,
  objectConstructor: TaskRun,
});
