import { autobind } from "../../utils";
import { KubeObject } from "../kube-object";
import { KubeApi } from "../kube-api";

export class TaskRef {
    name: string;
    kind: string;
    apiVersion: string;
}

export class ParamSpec {
    name: string;
    type: string;
    description: string;
    default: string | Array<any>;
}

export class PipelineTask {
    name: string;
    taskRef: TaskRef;
    runAfter: string;
}

@autobind()
export class Pipeline extends KubeObject {
    static kind = "Pipeline"
    spec: {
        resources: {
            name: string;
            type: Map<string, boolean>;
        };
        tasks: PipelineTask[];
        params: ParamSpec[];
    }
    status: {}

    getTasks(): PipelineTask[] {
        return this.spec.tasks || [];
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
    isNamespaced: false,
    objectConstructor: Pipeline,
});
