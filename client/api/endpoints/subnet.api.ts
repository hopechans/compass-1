import {KubeObject} from "../kube-object";
import {KubeApi} from "../kube-api";


export class SubNet extends KubeObject {
    static kind = "SubNet";

    spec: {
        protocol: string,
        cidrBlock: string,
        gateway: string,
        namespaces: any[],
        excludeIps: string[],
    }
}

export const subNetApi = new KubeApi({
    kind: SubNet.kind,
    apiBase: "/apis/kubeovn.io/v1/subnets",
    isNamespaced: true,
    objectConstructor: SubNet,
});