import get from "lodash/get";
import { IPodContainer, Pod } from "./pods.api";
import { WorkloadKubeObject } from "../workload-kube-object";
import { autobind } from "../../utils";
import { KubeApi } from "../kube-api";

@autobind()
export class Deploy extends WorkloadKubeObject {
    static kind = "Workloads"
    spec: {
        resourceType: string;
        generateTimestamp: string;
        metadata: string; // the field record array container configuration
    }
    status: {}

    getResourceType() {
        return get(this, "spec.resourceType")
    }

    getGenerateTimestamp() {
        return get(this, "spec.generateTimestamp")
    }

    getContainers() {
        const metadata: string = get(this, "spec.metadata")
        const containers: IPodContainer[] = JSON.parse(metadata);
        return [...containers].map(container => container)
    }
}

export const deployApi = new KubeApi({
    kind: Deploy.kind,
    apiBase: "/apis/fuxi.nip.io/v1/workloads",
    isNamespaced: true,
    objectConstructor: Deploy,
});
