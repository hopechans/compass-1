import { autobind } from "../../utils";
import { KubeObject } from "../kube-object";
import { KubeApi } from "../kube-api";

export interface TektonStoreSpec {
  tektonresourcetype: string;
  data: string;
  author: string;
  forks: number;
  paramsdescription: string;
}
@autobind()
export class TektonStore extends KubeObject {
  static kind = "TektonStore";

  spec: TektonStoreSpec;

  getType(): string {
    return this.spec?.tektonresourcetype || "";
  }

  getData(): string {
    return this.spec?.data || "";
  }

  getAuthor(): string {
    return this.spec?.author || "";
  }

  getForks(): number {
    return this.spec?.forks || 0;
  }

  getParamsDescription(): string {
    return this.spec?.paramsdescription || "";
  }

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
