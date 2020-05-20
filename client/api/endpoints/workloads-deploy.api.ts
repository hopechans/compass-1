import get from "lodash/get";
import { WorkloadKubeObject } from "../workload-kube-object";
import { autobind } from "../../utils";
import { KubeApi } from "../kube-api";
import { Stone } from "./stone.api"

@autobind()
export class Deploy extends WorkloadKubeObject {
    static kind = "Workloads"
    spec: {
        name: string,  // the app name
        resourceType: string;
        generateTimestamp: string;
        metadata: string; // the field record array container configuration
    }
    status: {}


    getAppName() {
        return get(this, "spec.appName")
    }

    getResourceType() {
        return get(this, "spec.resourceType")
    }

    getGenerateTimestamp() {
        return get(this, "spec.generateTimestamp")
    }

    getTemplate() {
        switch (this.getResourceType()) {
            case ("Stones"):
                return new Stone(get(this, "spec.metadata"));
            default:
        }
    }
}

export const deployApi = new KubeApi({
    kind: Deploy.kind,
    apiBase: "/apis/fuxi.nip.io/v1/workloads",
    isNamespaced: true,
    objectConstructor: Deploy,
});
