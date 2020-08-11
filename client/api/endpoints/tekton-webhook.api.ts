import {autobind} from "../../utils";
import {KubeObject} from "../kube-object";
import {KubeApi} from "../kube-api";

@autobind()
export class TektonWebHook extends KubeObject {
  static kind = "TektonWebHook";

  spec: {
    git: string;
    branch: string;
    pipeline_run: string;
    args: string[];
  };

}

export const tektonWebHookApi = new KubeApi({
  kind: TektonWebHook.kind,
  apiBase: "/apis/fuxi.nip.io/v1/tektonwebhooks",
  isNamespaced: true,
  objectConstructor: TektonWebHook,
});