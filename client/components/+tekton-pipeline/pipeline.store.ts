import { autobind } from "../../utils";
import { KubeObjectStore } from "../../kube-object.store";
import { pipelineApi, Pipeline } from "../../api/endpoints";
// import { podsStore } from "../+workloads-pods/pods.store";
import { apiManager } from "../../api/api-manager";

@autobind()
export class PipelineStore extends KubeObjectStore<Pipeline> {
    api = pipelineApi
}

export const pipelineStore = new PipelineStore();
apiManager.registerStore(pipelineApi, pipelineStore);
