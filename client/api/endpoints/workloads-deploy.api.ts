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
        generateTimestamp: string;
        metadata: WorkloadKubeObject; // the field record array container configuration
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

    getObject() {
        return get(this, "spec.metadata");
    }

    setTemplate(metadata: WorkloadKubeObject) {
        this.spec.metadata = metadata;
    }

}

export const deployApi = new KubeApi({
    kind: Deploy.kind,
    apiBase: "/apis/fuxi.nip.io/v1/workloads",
    isNamespaced: true,
    objectConstructor: Deploy,
});
