import get from "lodash/get";
import { WorkloadKubeObject } from "../workload-kube-object";
import { autobind } from "../../utils";
import { KubeApi } from "../kube-api";

@autobind()
export class Deploy extends WorkloadKubeObject {
    static kind = "Workloads"

    spec: {
        name: string,  // the app name
        resourceType: string;
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
        if (this.metadata && this.metadata.creationTimestamp) {
            return this.metadata.creationTimestamp;
        }
        return ""
    }

    getObject() {
        return get(this, "spec.metadata");
    }

    setMetadata(metadata: string) {
        this.spec.metadata = metadata;
    }

}

export const deployApi = new KubeApi({
    kind: Deploy.kind,
    apiBase: "/apis/fuxi.nip.io/v1/workloads",
    isNamespaced: true,
    objectConstructor: Deploy,
});
