import { autobind } from "../../utils";
import { KubeObject } from "../kube-object";
import { KubeApi } from "../kube-api";


class Secret {
    fieldName: string;
    secretKey: string;
    secretName: string;
}

@autobind()
export class PipelineResource extends KubeObject {
    static kind = "PipelineResource"
    spec: {
        type: string;
        params: {
            name: string,
            value: string
        }[],
        secrets: Secret[],
    }
    status: {}

    getType() { return this.spec.type }

    getSecretSet() {
        const secretList: Secret[] = this.spec.secrets;
        if (!secretList) return [];
        const secretSet: string[] = [];
        secretList.map(secret => {
            secretSet.push(secret.fieldName);
        })
        return secretSet;
    }
}

export const pipelineResourceApi = new KubeApi({
    kind: PipelineResource.kind,
    apiBase: "/apis/tekton.dev/v1alpha1/pipelineresources",
    isNamespaced: false,
    objectConstructor: PipelineResource,
});
