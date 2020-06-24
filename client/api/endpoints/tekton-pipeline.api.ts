import {autobind} from "../../utils";
import {KubeObject} from "../kube-object";
import {KubeApi} from "../kube-api";

export interface TaskRef {
  name: string;
  kind?: string;
  apiVersion?: string;
}

export interface ParamSpec {
  name: string;
  type: string;
  description: string;
  default: string | Array<any>;
}

export interface PipelineTask {
  name: string;
  taskRef: TaskRef;
  runAfter: string[];
}

export class PipelineTask implements PipelineTask {}

export interface PipelineSpec {
  resources: {
    name: string;
    type: string;
  }[];
  tasks: PipelineTask[];
  params: ParamSpec[];
}

@autobind()
export class Pipeline extends KubeObject {
  static kind = "Pipeline"
  spec: PipelineSpec
  status: {}

  getTasks(): PipelineTask[] {
    return this.spec.tasks || [];
  }

  getOwnerNamespace(): string {
    return this.metadata.namespace || "";
  }

  getTaskSet() {
    const taskList: PipelineTask[] = this.spec.tasks;
    if (!taskList) return [];
    const taskSet: string[] = [];
    taskList.map(task => {
      taskSet.push(task.taskRef.name);
    })
    return taskSet;
  }
}

export const pipelineApi = new KubeApi({
  kind: Pipeline.kind,
  apiBase: "/apis/tekton.dev/v1alpha1/pipelines",
  isNamespaced: true,
  objectConstructor: Pipeline,
});
