import {autobind} from "../../utils";
import {KubeObject} from "../kube-object";
import {KubeApi} from "../kube-api";
import {PipelineSpec} from "./tekton-pipeline.api";

export interface PipelineRef {
  name: string;
  apiVersion: string;
}

// export interface PipelineSpec {
//   resources: { name: string, type: string }[];
//   // TaskRef is a reference to a task definition.
//   tasks: {
//     name: string,
//     taskRef: {
//       name: string;
//       kind: string;
//       apiVersion: string;
//     },
//     // Conditions is a list of conditions that need to be true for the task to run
//     conditions: {
//       conditionRef: string;
//       params: {
//         name: string;
//         value: string | Array<any>;
//       }[];
//       resources: {
//         name: string;
//         resource: string;
//       }[];
//     }[];
//     // Retries represents how many times this task should be retried in case of task failure: ConditionSucceeded set to False
//     retries: number;
//
//     // RunAfter is the list of PipelineTask names that should be executed before
//     // this Task executes. (Used to force a specific ordering in graph execution.)
//     runAfter: string[];
//
//     // Resources declares the resources given to this task as inputs and
//     resources: {
//       inputs: {
//         // Name is the name of the PipelineResource as declared by the Task.
//         name: string;
//         // Resource is the name of the DeclaredPipelineResource to use.
//         resource: string;
//         // From is the list of PipelineTask names that the resource has to come from.
//         from: string[];
//       }[];
//       outputs: [];
//     };
//     // Parameters declares parameters passed to this task.
//     params: {
//       name: string;
//       value: string | Array<any>;
//     }[];
//   }[];
//
//   // Parameters declares parameters passed to this task.
//   params: {
//     name: string;
//     type: string;
//     description: string;
//     default: string | Array<any>;
//   }[];
// }

export interface PipelineResourceBinding {
  name: string;
  resourceRef: {
    name: string;
    apiVersion: string;
  };
  resourceSpec: {
    type: string;
    params: {
      name: string;
      value: string;
    }[];
    secrets: {
      fieldName: string;
      secretKey: string;
      secretName: string;
    }[]
  }
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

export interface PipelineRunSpec {
  pipelineRef: PipelineRef,
  // pipelineSpec: PipelineSpec,
  pipelineSpec: PipelineSpec,
  resources: PipelineResourceBinding[],
  params: {
    name: string;
    value: string | Array<any>;
  }[],
  serviceAccountName: string,
  serviceAccountNames: {
    taskName: string;
    serviceAccountName: string;
  }[],
  status: string,
  timeout: string | number,
  podTemplate: PodTemplate,
}

@autobind()
export class PipelineRun extends KubeObject {
  static kind = "PipelineRun"

  spec: PipelineRunSpec
  status: {
    observedGeneration: number;
    conditions?: any;
    startTime: number | string;
    completionTime: number | string;
    taskRuns: Map<string, any>;
  };

  getOwnerNamespace(): string {
    return this.metadata.labels.namespace || "";
  }
}

export const pipelineRunApi = new KubeApi({
  kind: PipelineRun.kind,
  apiBase: "/apis/tekton.dev/v1alpha1/pipelineruns",
  isNamespaced: true,
  objectConstructor: PipelineRun,
});
