import {autobind} from "../../utils";
import {KubeObject} from "../kube-object";
import {KubeApi} from "../kube-api";
import {PipelineSpec, Param} from "./tekton-pipeline.api";
import {Params} from "./tekton-task.api";
import {PersistentVolumeClaimVolumeSource} from "./persistent-volume-claims.api";
import {taskRunStore} from "../../components/+tekton-taskrun";
import {pipelineStore} from "../../components/+tekton-pipeline/pipeline.store";
import {tektonGraphStore} from "../../components/+tekton-graph/tekton-graph.store";
import {initData} from "../../components/+tekton-graph/graphs";

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
  workspaces?: WorkspaceBinding[];
}

export interface WorkspaceBinding {
  // Name is the name of the workspace populated by the volume.
  name: string;
  // SubPath is optionally a directory on the volume which should be used
  // for this binding (i.e. the volume will be mounted at this sub directory).
  // +optional
  subPath?: string;

  persistentVolumeClaim?: PersistentVolumeClaimVolumeSource;

  //not support it
  emptyDir?: any;
  configMap?: any;
  secret?: any;
}

@autobind()
export class PipelineRun extends KubeObject {
  static kind = "PipelineRun";

  params: {};

  spec: PipelineRunSpec;
  status: {
    observedGeneration: number;
    conditions?: any;
    startTime: number | string;
    completionTime: number | string;
    taskRuns: any;
  };

  getStartTime(): any {
    if (this.status?.startTime == undefined) {
      return "";
    }
    return this.status?.startTime || "";
  }

  getCompletionTime(): any {
    if (this.status?.completionTime == undefined) {
      return "";
    }
    return this.status?.completionTime || "";
  }

  getOwnerNamespace(): string {
    if (this.metadata.labels == undefined) {
      return "";
    }
    return this.metadata.labels.namespace != undefined
      ? this.metadata.labels.namespace
      : "";
  }

  getErrorReason(): string {
    if (this.status?.conditions == undefined || this.status?.conditions == {}) {
      return "";
    }
    return this.status?.conditions.map(
      (item: { status: string; reason: string; }) => {
        if (item.status == 'False') {
          return item.reason;
        }
      }) || "";
  }

  hasIssues(): boolean {
    return this.getErrorReason() != "";
  }

  getPipelineRefName() {
    return this.spec.pipelineRef.name;
  }

  getPipelineRefNodeData() {
    const pipeline = pipelineStore.getByName(this.getPipelineRefName());
    if (pipeline) {
      return pipeline.getNodeData()
    }
    return []
  }

  getTasks(): any {
    if (this.status.taskRuns === undefined) return [];
    return this.status.taskRuns;
  }

  getTaskRunName(): string[] {
    return (
      Object.keys(this.getTasks()).map((item: any) => {
        return item;
      }).slice() || []
    );
  }

  getTaskRunMap() {
    let taskMap: any = new Map<string, any>();
    this.getTaskRunName().map((name: string, index: number) => {
      const currentTask = taskRunStore.getByName(name);
      if (currentTask?.spec !== undefined) {
        taskMap[currentTask.spec.taskRef.name] = currentTask
      }
    });
    return taskMap;
  }

  getNodeData() {
    let graphName: string = ""
    this.getAnnotations().filter((item) => {
      const R = item.split("=");
      if (R[0] == "fuxi.nip.io/tektongraphs") {
        graphName = R[1]
      }
    });
    console.log(graphName)
    if (graphName) {
      return JSON.parse(tektonGraphStore.getByName(graphName).spec.data);
    }
    return initData;
  }
}

export const pipelineRunApi = new KubeApi({
  kind: PipelineRun.kind,
  apiBase: "/apis/tekton.dev/v1alpha1/pipelineruns",
  isNamespaced: true,
  objectConstructor: PipelineRun,
});

