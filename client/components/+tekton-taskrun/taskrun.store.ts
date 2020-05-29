import { observable } from "mobx";
import { autobind } from "../../utils";
import { KubeObjectStore } from "../../kube-object.store";
import { IPodMetrics, podsApi, PodStatus, taskRunApi, TaskRun } from "../../api/endpoints";
import { podsStore } from "../+workloads-pods/pods.store";
import { apiManager } from "../../api/api-manager";

@autobind()
export class TaskRunStore extends KubeObjectStore<TaskRun> {
  api = taskRunApi
  @observable metrics: IPodMetrics = null;


  reset() {
    this.metrics = null;
  }
}

export const taskRunStore = new TaskRunStore();
apiManager.registerStore(taskRunApi, taskRunStore);
