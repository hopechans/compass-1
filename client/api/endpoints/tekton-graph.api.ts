import {autobind} from "../../utils";
import {KubeObject} from "../kube-object";
import {KubeApi} from "../kube-api";

interface TektonGraphSpec {
  data: string
}

@autobind()
export class TektonGraph extends KubeObject {
  static kind = "TektonGraph";
  spec: TektonGraphSpec;
}

export const tektonGraphApi = new KubeApi({
  kind: TektonGraph.kind,
  apiBase: "/apis/fuxi.nip.io/v1/tektongraphs",
  isNamespaced: true,
  objectConstructor: TektonGraph,
});
