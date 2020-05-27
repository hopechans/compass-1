import {KubeObject} from "../kube-object";
import {KubeApi} from "../kube-api";
import {autobind} from "../../utils";

@autobind()
export class Form extends KubeObject {
    static kind = "Form";

    spec: {
        tree: string,
    }
}

export const formApi = new KubeApi({
    kind: Form.kind,
    apiBase: "/apis/fuxi.nip.io/v1/forms",
    isNamespaced: true,
    objectConstructor: Form,
});
