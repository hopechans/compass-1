import {autobind} from "../../utils";
import {KubeObject} from "../kube-object";
import {KubeApi} from "../kube-api";

export interface Job {
  branch: string;
  pipeline_run: string;
  args: string[];
}

export const job: Job = {
  branch: "",
  pipeline_run: "",
  args: []
}

@autobind()
export class TektonWebHook extends KubeObject {
  static kind = "TektonWebHook";

  spec: {
    secret: string;
    git: string;
    jobs: Job[];
  };

}

export const tektonWebHookApi = new KubeApi({
  kind: TektonWebHook.kind,
  apiBase: "/apis/fuxi.nip.io/v1/tektonwebhooks",
  isNamespaced: true,
  objectConstructor: TektonWebHook,
});