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

export function secondsToHms(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor((seconds % 3600) % 60);

  let hDisplay = h > 0 ? h + (h == 1 ? "h " : "h") : "";
  let mDisplay = m > 0 ? m + (m == 1 ? "m " : "m") : "";
  let sDisplay = s > 0 ? s + (s == 1 ? "s " : "s") : "";
  return hDisplay + mDisplay + sDisplay;
}