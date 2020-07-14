import { autobind } from "../../utils";
import { KubeObjectStore } from "../../kube-object.store";
import { pipelineApi, Pipeline, tektonGraphApi } from "../../api/endpoints";
import { apiManager } from "../../api/api-manager";
import { tektonGraphStore } from "../+tekton-graph/tekton-graph.store";
import { initData } from "../+tekton-graph/graphs";

@autobind()
export class PipelineStore extends KubeObjectStore<Pipeline> {
  api = pipelineApi;

  getNodeData(pipeline: Pipeline) {
    let graphName: string = "";
    pipeline.getAnnotations().filter((item) => {
      const R = item.split("=");
      if (R[0] == "fuxi.nip.io/tektongraphs") {
        graphName = R[1];
      }
    });
    if (graphName) {
      return JSON.parse(tektonGraphStore.getDataByName(graphName));
    }
    return initData;
  }
}

export const pipelineStore = new PipelineStore();
apiManager.registerStore(pipelineApi, pipelineStore);
