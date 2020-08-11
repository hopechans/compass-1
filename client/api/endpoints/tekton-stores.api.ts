import { autobind } from "../../utils";
import { KubeObject } from "../kube-object";
import { KubeApi } from "../kube-api";

@autobind()
export class TektonStore extends KubeObject {
  static kind = "TektonStore";

  spec: {
    tektonresourcetype: string;
    data: string;
    author: string;
    forks: number;
    paramsdescription: string;
    subreference: string;
  };

  getOwnerNamespace(): string {
    if (this.metadata.labels == undefined) {
      return "";
    }
    return this.metadata.labels.namespace != undefined
      ? this.metadata.labels.namespace
      : "";
  }
}

export const tektonStoreApi = new KubeApi({
  kind: TektonStore.kind,
  apiBase: "/apis/fuxi.nip.io/v1/tektonstores",
  isNamespaced: true,
  objectConstructor: TektonStore,
});
