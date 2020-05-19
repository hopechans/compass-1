import {KubeObject} from "../kube-object";
import {KubeApi} from "../kube-api";


export class Page extends KubeObject {
    static kind = "Page";

    spec: {
        scaleTargetRef: {
            kind: string;
            name: string;
            apiVersion: string;
        };
        minReplicas: number;
        maxReplicas: number;
    }
    status: {
        currentReplicas: number;
        desiredReplicas: number;
        conditions: {
            lastTransitionTime: string;
            message: string;
            reason: string;
            status: string;
            type: string;
        }[];
    }

}

export const pageApi = new KubeApi({
    kind: Page.kind,
    apiBase: "/apis/fuxi.nip.io/v1/pages",
    isNamespaced: true,
    objectConstructor: Page,
});
