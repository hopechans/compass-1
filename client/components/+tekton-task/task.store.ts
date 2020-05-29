import { observable } from "mobx";
import { autobind } from "../../utils";
import { KubeObjectStore } from "../../kube-object.store";
import { IPodMetrics, podsApi, PodStatus, taskApi, Task } from "../../api/endpoints";
import { podsStore } from "../+workloads-pods/pods.store";
import { apiManager } from "../../api/api-manager";

@autobind()
export class TaskStore extends KubeObjectStore<Task> {
  api = taskApi
  @observable metrics: IPodMetrics = null;


  reset() {
    this.metrics = null;
  }
}

export const taskStore = new TaskStore();
apiManager.registerStore(taskApi, taskStore);
