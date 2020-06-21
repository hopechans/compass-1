import { autobind } from "../../utils";
import { KubeObject } from "../kube-object";
import { KubeApi } from "../kube-api";

@autobind()
export class TaskRun extends KubeObject {
    static kind = "TaskRun"

    spec: any;


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
