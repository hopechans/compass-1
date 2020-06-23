import {autobind} from "../../utils";
import {KubeObject} from "../kube-object";
import {KubeApi} from "../kube-api";

export interface Param {
  name: string;
  type: string;
  description: string;
  default: string | Array<any>;
}

export interface Inputs {
  // Resources is a list of the input resources required to run the task.
  // Resources are represented in TaskRuns as bindings to instances of
  // PipelineResources.
  resources?: {
    name: string;
    type: string;
  }[];
  // Params is a list of input parameters required to run the task. Params
  // must be supplied as inputs in TaskRuns unless they declare a default
  // value.
  params?: Param[];
}

export interface Outputs {
  results?: {
    // Name declares the name by which a result is referenced in the Task's
    // definition. Results may be referenced by name in the definition of a
    // Task's steps.
    name: string;
    // TODO: maybe this is an enum with types like "go test", "junit", etc.
    format: string;
    path: string;
  }[];
  resources?: {
    // Name declares the name by which a resource is referenced in the
    // definition. Resources may be referenced by name in the definition of a
    // Task's steps.
    name?: string;
    // Type is the type of this resource;

    type?: string;
    // TargetPath is the path in workspace directory where the resource
    // will be copied.
    targetPath?: string;
  }[];
}

// class Container implements IPodContainer {
//     name: string;
//     image: string;
//     command?: string[];
//     args?: string[];
//     ports: { name?: string; containerPort: number; protocol: string; }[];
//     resources?: { limits: { cpu: string; memory: string; }; requests: { cpu: string; memory: string; }; };
//     env?: { name: string; value?: string; valueFrom?: { fieldRef?: { apiVersion: string; fieldPath: string; }; secretKeyRef?: { key: string; name: string; }; configMapKeyRef?: { key: string; name: string; }; }; }[];
//     envFrom?: { configMapRef?: { name: string; }; }[];
//     volumeMounts?: { name: string; readOnly: boolean; mountPath: string; }[];
//     livenessProbe?: IContainerProbe;
//     readinessProbe?: IContainerProbe;
//     imagePullPolicy?: string;
//     // self add
//     securityContext: any;
// }
export interface PipelineParams {
  name: string;
  type: string;
  description: string;
  default: string;
}

export interface PipelineResources {
  name: string;
  type: string;
}

export interface Environment {
  type: string
  envConfig: any
}

export interface TaskStep {
  name: string;
  image: string;
  args: string[];
  commands: string[];
  environment: Environment[];
  workspaces: Workspace[];
  workingDir: string;
  results: Result[];
  scripts: string;
}

export interface Workspace {
  name: string;
  description: string;
  mountPath: string;
}

export interface VolumeMount {
  name: string;
  mountPath: string;
}

export interface Result {
  name: string;
  description: string;
}

export interface Params {
  name: string;
  value: string
}

export interface Volume {
  name: string;
  emptyDir: any;
}

export interface TaskSpec {
  params?: PipelineParams[];
  inputs?: Inputs;
  outputs?: Outputs;
  steps?: TaskStep[];
  volumes?: Volume[];
}

@autobind()
export class Task extends KubeObject {
  static kind = "Task"
  spec: TaskSpec

  getOwnerNamespace(): string {
    return this.metadata.labels.namespace || "";
  }
}

export const taskApi = new KubeApi({
  kind: Task.kind,
  apiBase: "/apis/tekton.dev/v1alpha1/tasks",
  isNamespaced: true,
  objectConstructor: Task,
});
