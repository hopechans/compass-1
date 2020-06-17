import {autobind} from "../../utils";
import {KubeObjectStore} from "../../kube-object.store";
import {taskRunApi, TaskRun} from "../../api/endpoints";
import {apiManager} from "../../api/api-manager";

@autobind()
export class TaskRunStore extends KubeObjectStore<TaskRun> {
  api = taskRunApi
}

export const taskRunStore = new TaskRunStore();
apiManager.registerStore(taskRunApi, taskRunStore);
