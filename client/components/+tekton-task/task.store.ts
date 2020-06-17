import { autobind } from "../../utils";
import { KubeObjectStore } from "../../kube-object.store";
import { taskApi, Task } from "../../api/endpoints";
import { apiManager } from "../../api/api-manager";

@autobind()
export class TaskStore extends KubeObjectStore<Task> {
  api = taskApi
}

export const taskStore = new TaskStore();
apiManager.registerStore(taskApi, taskStore);
