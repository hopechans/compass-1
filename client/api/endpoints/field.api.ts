import {KubeObject} from "../kube-object";
import {KubeApi} from "../kube-api";


export class Field extends KubeObject {
    static kind = "Field";

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

export const fieldApi = new KubeApi({
    kind: Field.kind,
    apiBase: "/apis/fuxi.nip.io/v1/fields",
    isNamespaced: true,
    objectConstructor: Field,
});
