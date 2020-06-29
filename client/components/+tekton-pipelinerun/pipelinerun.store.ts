import { observable } from "mobx";
import { autobind } from "../../utils";
import { KubeObjectStore } from "../../kube-object.store";
import { pipelineRunApi, PipelineRun } from "../../api/endpoints";
import { apiManager } from "../../api/api-manager";

@autobind()
export class PipelineRunStore extends KubeObjectStore<PipelineRun> {
  api = pipelineRunApi;
  // @observable metrics: IPodMetrics = null;

  // reset() {
  //   this.metrics = null;
  // }
}

export const pipelineRunStore = new PipelineRunStore();
apiManager.registerStore(pipelineRunApi, pipelineRunStore);
