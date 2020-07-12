import { observable } from "mobx";
import { autobind } from "../../utils";
import { KubeObjectStore } from "../../kube-object.store";
import { pipelineRunApi, PipelineRun } from "../../api/endpoints";
import { apiManager } from "../../api/api-manager";
import { tektonGraphStore } from "../+tekton-graph/tekton-graph.store";
import { initData } from "../+tekton-graph/graphs";

@autobind()
export class PipelineRunStore extends KubeObjectStore<PipelineRun> {
  api = pipelineRunApi;


  getNodeData(pipelineRun: PipelineRun) {
    let graphName: string = ""
    pipelineRun.getAnnotations().filter((item) => {
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

export const pipelineRunStore = new PipelineRunStore();
apiManager.registerStore(pipelineRunApi, pipelineRunStore);
