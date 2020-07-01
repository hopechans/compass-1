import { autobind } from "../../utils";
import { KubeObject } from "../kube-object";
import { KubeApi } from "../kube-api";
import { PipelineSpec, Param } from "./tekton-pipeline.api";
import { Params } from "./tekton-task.api";

export interface PipelineRef {
  name: string;
  apiVersion?: string;
}

// PipelineResourceRef can be used to refer to a specific instance of a Resource
export interface PipelineResourceRef {
  name: string;
  apiVersion?: string;
}

export interface SecretParam {
  fieldName?: string;
  secretKey?: string;
  secretName?: string;
}

// PipelineResourceSpec defines  an individual resources used in the pipeline.
export interface PipelineResourceSpec {
  description?: string;
  type: string;
  params: Params[];
  secretParams?: SecretParam[];
}

// PipelineResourceBinding connects a reference to an instance of a PipelineResource
// with a PipelineResource dependency that the Pipeline has declared
export interface PipelineResourceBinding {
  name: string;
  resourceRef?: PipelineRef;
  resourceSpec?: PipelineResourceBinding;
}

export interface PodTemplate {
  nodeSelector?: Map<string, string>;
  tolerations?: Array<any>;
  affinity?: any;
  securityContext?: any;
  volumes?: {
    name: string;
    volumeSource: any;
  }[];
  runtimeClassName: string;
}

// PipelineRunSpecServiceAccountName can be used to configure specific
// ServiceAccountName for a concrete Task
export interface PipelineRunSpecServiceAccountName {
  taskName: string;
  ServiceAccountName: string;
}

// PipelineRunSpec defines the desired state of PipelineRun
export interface PipelineRunSpec {
  pipelineRef?: PipelineRef;
  pipelineSpec?: PipelineSpec;
  resources: PipelineResourceBinding[];
  params?: Param[];
  serviceAccountName?: string;
  serviceAccountNames?: PipelineRunSpecServiceAccountName[];
  status?: string;
  timeout?: string | number;
  podTemplate?: PodTemplate;
}

@autobind()
export class PipelineRun extends KubeObject {
  static kind = "PipelineRun";
  spec: PipelineRunSpec;
  status: {
    observedGeneration: number;
    conditions?: any;
    startTime: number | string;
    completionTime: number | string;
    taskRuns: any;
  };

  getOwnerNamespace(): string {
    if (this.metadata.labels == undefined) {
      return "";
    }
    return this.metadata.labels.namespace != undefined
      ? this.metadata.labels.namespace
      : "";
  }

  getTasks(): any {
    if (this.status.taskRuns === undefined) return [];
    return this.status.taskRuns;
  }
}

export const pipelineRunApi = new KubeApi({
  kind: PipelineRun.kind,
  apiBase: "/apis/tekton.dev/v1alpha1/pipelineruns",
  isNamespaced: true,
  objectConstructor: PipelineRun,
});
